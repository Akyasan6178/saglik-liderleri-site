import csv
import io
import re
import urllib.request
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework.exceptions import AuthenticationFailed
from .models import (
    Aday, Takim, Katilimci, Gorev, Teslim, TeslimHareketi, Mentor, IcerikDNATesti,
    KatilimciPerformans, PerformansKriteri, KatilimciPerformansNotu,
    ToplantiKatilimi, SosyalMedyaPerformansi,
)
from .serializers import (
    AdaySerializer, TakimSerializer, KatilimciSerializer,
    GorevSerializer, TeslimSerializer, MentorSerializer,
    IcerikDNATestiSerializer, AdminIcerikDNATestiSerializer,
    KatilimciPerformansSerializer, AdminKatilimciPerformansSerializer,
    PerformansKriteriSerializer, KatilimciPerformansNotuSerializer,
    ToplantiKatimiSerializer, SosyalMedyaPerformansiSerializer,
)
from .ai_services import generate_icerik_dna_report


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['email'] = self.fields.pop('username')
        self.fields['email'].required = True

    def validate(self, attrs):
        email = attrs.get('email') or attrs.get('username')
        password = attrs.get('password')

        try:
            user_obj = User.objects.get(email=email)
            username = user_obj.username
        except User.DoesNotExist:
            raise AuthenticationFailed('Bu e-posta adresi ile kayitli bir kullanici bulunamadi.')

        user = authenticate(username=username, password=password)

        if user is None:
            raise AuthenticationFailed('Sifre hatali.')

        refresh = self.get_token(user)

        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

        role = 'Misafir'
        if user.is_superuser:
            role = 'Admin'
        elif hasattr(user, 'mentor_profili'):
            role = 'Mentor'
        elif hasattr(user, 'katilimci_profili'):
            role = 'Katilimci'
        data['role'] = role
        data['username'] = user.username
        data['email'] = user.email

        return data


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class MentorViewSet(viewsets.ModelViewSet):
    queryset = Mentor.objects.all()
    serializer_class = MentorSerializer


class AdayViewSet(viewsets.ModelViewSet):
    queryset = Aday.objects.all()
    serializer_class = AdaySerializer


class TakimViewSet(viewsets.ModelViewSet):
    queryset = Takim.objects.all()
    serializer_class = TakimSerializer


class KatilimciViewSet(viewsets.ModelViewSet):
    queryset = Katilimci.objects.all()
    serializer_class = KatilimciSerializer


class GorevViewSet(viewsets.ModelViewSet):
    queryset = Gorev.objects.all()
    serializer_class = GorevSerializer


class TeslimViewSet(viewsets.ModelViewSet):
    queryset = Teslim.objects.none()
    serializer_class = TeslimSerializer

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Teslim.objects.none()

        if user.is_superuser:
            return Teslim.objects.all()

        if hasattr(user, 'mentor_profili'):
            mentor = user.mentor_profili
            from django.db.models import Q
            return Teslim.objects.filter(
                Q(takim__mentor=mentor) | Q(katilimci__takim__mentor=mentor)
            ).distinct()

        if hasattr(user, 'katilimci_profili'):
            return Teslim.objects.filter(katilimci=user.katilimci_profili)

        return Teslim.objects.none()


# ─────────────────────────────────────────────────────────────────────────────
# GOOGLE FORM WEBHOOK — Kimlik dogrulama gerektirmez, secret header ile korunur
# ─────────────────────────────────────────────────────────────────────────────
WEBHOOK_SECRET = getattr(settings, 'GOOGLE_FORM_WEBHOOK_SECRET', 'gdsl-2026-secret-key')


@api_view(['POST'])
@authentication_classes([])
@permission_classes([AllowAny])
def google_form_webhook(request):
    """
    Google Apps Script bu endpoint'e POST atar.
    Header: X-Webhook-Secret: <GOOGLE_FORM_WEBHOOK_SECRET>
    Body (JSON):
      {
        "ad": "...",
        "soyad": "...",
        "eposta": "...",
        "telefon": "...",
        "universite": "...",
        "sinif": "...",
        "sosyal_medya": "...",
        "icerik_uretimi": "...",
        "takvim_onay": true
      }
    """
    # Guvenlik kontrolu
    secret = request.headers.get('X-Webhook-Secret', '')
    if secret != WEBHOOK_SECRET:
        return Response(
            {'error': 'Yetkisiz erisim.'},
            status=status.HTTP_403_FORBIDDEN
        )

    data = request.data

    # Zorunlu alan kontrolu
    eposta = data.get('eposta', '').strip().lower()
    ad     = data.get('ad', '').strip()
    soyad  = data.get('soyad', '').strip()

    if not eposta or not ad:
        return Response(
            {'error': 'ad ve eposta alanlari zorunludur.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    def safe_str(val):
        """None veya boş string gelirse None döner, aksi halde temizlenmiş string."""
        if val is None:
            return None
        s = str(val).strip()
        return s or None

    # Ayni e-posta ile tekrar basvurursa guncelle (upsert)
    aday, created = Aday.objects.update_or_create(
        eposta=eposta,
        defaults={
            'ad':             ad,
            'soyad':          soyad,
            'telefon':        safe_str(data.get('telefon')),
            'universite':     safe_str(data.get('universite')),
            'sinif':          safe_str(data.get('sinif')),
            'sosyal_medya':   safe_str(data.get('sosyal_medya')),
            'icerik_uretimi': safe_str(data.get('icerik_uretimi')),
            'takvim_onay':    bool(data.get('takvim_onay', False)),
            'kaynak':         'Google Form',
        }
    )


    action = 'olusturuldu' if created else 'guncellendi'
    return Response(
        {
            'success': True,
            'action':  action,
            'aday_id': aday.id,
            'ad_soyad': aday.ad_soyad,
        },
        status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
    )


# ─────────────────────────────────────────────────────────────────────────────
# YARDIMCI: Sınıf metnini normalize et
# ─────────────────────────────────────────────────────────────────────────────
_SINIF_MAP = {
    '1. sınıf': '1. Sinif', '1. sinif': '1. Sinif', '1.sinif': '1. Sinif', '1': '1. Sinif',
    '2. sınıf': '2. Sinif', '2. sinif': '2. Sinif', '2.sinif': '2. Sinif', '2': '2. Sinif',
    '3. sınıf': '3. Sinif', '3. sinif': '3. Sinif', '3.sinif': '3. Sinif', '3': '3. Sinif',
    '4. sınıf': '4. Sinif', '4. sinif': '4. Sinif', '4.sinif': '4. Sinif', '4': '4. Sinif',
    'mezun': 'Mezun',
}

def _normalize_sinif(raw):
    key = (raw or '').strip().lower()
    return _SINIF_MAP.get(key, 'Diger' if key else None)


def _safe(val):
    if val is None:
        return None
    s = str(val).strip()
    return s or None


# ─────────────────────────────────────────────────────────────────────────────
# YARDIMCI: CSV satırı → Aday upsert
# ─────────────────────────────────────────────────────────────────────────────
# Beklenen sütunlar (Google Sheets export başlıkları):
#   Zaman Damgası | Adınız | Soyadınız | E-posta | Telefon | Üniversite | Sınıf | Sosyal Medya | İçerik | Takvim Onayı
# Sütun adı yoksa indeks sırasına göre yorumlanır.
_COL_ALIASES = {
    'ad':             ['adınız', 'adi', 'ad', 'isim', 'name', 'first name', 'firstname'],
    'soyad':          ['soyadınız', 'soyadi', 'soyad', 'surname', 'last name', 'lastname'],
    'eposta':         ['e-posta adresiniz', 'eposta', 'e-posta', 'email', 'mail'],
    'telefon':        ['telefon numaranız', 'telefon', 'phone', 'tel'],
    'universite':     ['okuduğunuz / mezun olduğunuz üniversite', 'üniversite', 'universite', 'university', 'okul'],
    'sinif':          ['sınıf', 'sinif', 'class', 'year'],
    'sosyal_medya':   ['sosyal medya adresleriniz (instagram ve tiktok)', 'sosyal medya', 'social media', 'instagram', 'sosyalmedya'],
    'icerik_uretimi': ['daha önce içerik ürettiniz mi?', 'içerik', 'icerik', 'content'],
    'takvim_onay':    ['program takvimine uyum ve devamlılık onayı', 'takvim onayı', 'takvim', 'onay', 'approval'],
}

def _map_headers(headers):
    """Başlık satırını alan adına map'le. {alan_adi: sütun_indexi}"""
    mapping = {}
    for idx, h in enumerate(headers):
        normalized = h.strip().lower()
        for field, aliases in _COL_ALIASES.items():
            if any(normalized == a or normalized.startswith(a) for a in aliases):
                if field not in mapping:
                    mapping[field] = idx
                break
    return mapping


def _row_to_aday(row, mapping, use_index=False):
    """
    CSV satırından Aday verisi çıkar.
    mapping: {alan_adi: sutun_idx} (başlıktan)
    use_index: True ise sabit indeks sırası (A=0,B=1,C=2,...) kullan
    """
    def g(field, fallback_idx):
        idx = mapping.get(field, fallback_idx) if not use_index else fallback_idx
        if idx is None or idx >= len(row):
            return ''
        return str(row[idx]).strip()

    ad     = g('ad',     1)
    eposta = g('eposta', 3).lower()

    if not ad or not eposta or '@' not in eposta:
        return None  # Zorunlu alan eksik ya da geçersiz

    sinif_raw  = g('sinif', 6)
    takvim_raw = g('takvim_onay', 9)
    takvim     = bool(takvim_raw) and takvim_raw.lower() not in ('false', '0', 'hayır', 'hayir', '')

    return {
        'ad':             ad,
        'soyad':          g('soyad',          2),
        'eposta':         eposta,
        'telefon':        _safe(g('telefon',        4)),
        'universite':     _safe(g('universite',     5)),
        'sinif':          _normalize_sinif(sinif_raw),
        'sosyal_medya':   _safe(g('sosyal_medya',   7)),
        'icerik_uretimi': _safe(g('icerik_uretimi', 8)),
        'takvim_onay':    takvim,
    }


def _import_from_csv_text(csv_text):
    """CSV metin içeriğini işle, (olusturulan, guncellenen, atlanan, hatalar) döndür."""
    olusturulan = 0
    guncellenen = 0
    atlanan     = 0
    hatalar     = []

    reader = csv.reader(io.StringIO(csv_text))
    rows   = list(reader)

    if not rows:
        return olusturulan, guncellenen, atlanan, ['CSV boş.']

    # İlk satır başlık mı? En az 3 hücre ve '@' içermiyorsa başlıktır.
    first = rows[0]
    has_header = len(first) >= 3 and '@' not in ' '.join(first)
    mapping = _map_headers(first) if has_header else {}
    data_rows = rows[1:] if has_header else rows

    for i, row in enumerate(data_rows):
        lineno = i + (2 if has_header else 1)
        if not any(c.strip() for c in row):
            continue  # Boş satır
        try:
            aday_data = _row_to_aday(row, mapping)
            if aday_data is None:
                atlanan += 1
                hatalar.append(f'Satır {lineno}: ad veya geçerli e-posta yok — atlandı.')
                continue

            _, created = Aday.objects.update_or_create(
                eposta=aday_data['eposta'],
                defaults={
                    'ad':             aday_data['ad'],
                    'soyad':          aday_data['soyad'],
                    'telefon':        aday_data['telefon'],
                    'universite':     aday_data['universite'],
                    'sinif':          aday_data['sinif'],
                    'sosyal_medya':   aday_data['sosyal_medya'],
                    'icerik_uretimi': aday_data['icerik_uretimi'],
                    'takvim_onay':    aday_data['takvim_onay'],
                    'kaynak':         'CSV Import',
                }
            )
            if created:
                olusturulan += 1
            else:
                guncellenen += 1
        except Exception as exc:
            atlanan += 1
            hatalar.append(f'Satır {lineno}: {exc}')

    return olusturulan, guncellenen, atlanan, hatalar


# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINT 1: CSV Dosyası Yükleme
# ─────────────────────────────────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAdminUser])
def import_csv(request):
    """
    Multipart form-data ile CSV dosyası alır.
    Field adı: 'file'
    """
    uploaded = request.FILES.get('file')
    if not uploaded:
        return Response({'error': "'file' alanı gerekli."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        raw = uploaded.read().decode('utf-8-sig')  # BOM'u da temizle
    except UnicodeDecodeError:
        try:
            uploaded.seek(0)
            raw = uploaded.read().decode('windows-1254')
        except Exception:
            return Response({'error': 'Dosya encoding çözümlenemedi. UTF-8 olarak kaydedin.'}, status=400)

    olusturulan, guncellenen, atlanan, hatalar = _import_from_csv_text(raw)

    return Response({
        'success':     True,
        'olusturulan': olusturulan,
        'guncellenen': guncellenen,
        'atlanan':     atlanan,
        'hatalar':     hatalar[:20],  # En fazla 20 hata detayı
        'toplam':      olusturulan + guncellenen + atlanan,
    }, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────────────────────
# ENDPOINT 2: Google Sheets Public URL'den Import
# ─────────────────────────────────────────────────────────────────────────────
def _sheets_url_to_csv(url):
    """
    Google Sheets paylaşım URL'sini CSV export URL'sine çevirir.
    Desteklenen formatlar:
      - https://docs.google.com/spreadsheets/d/{ID}/edit#gid=...
      - https://docs.google.com/spreadsheets/d/{ID}/pub?...
      - Doğrudan export URL'si (zaten /export içeriyorsa aynen döner)
    """
    if '/export' in url and 'format=csv' in url:
        return url  # Zaten CSV export URL'si

    match = re.search(r'/spreadsheets/d/([a-zA-Z0-9_-]+)', url)
    if not match:
        raise ValueError('Geçerli bir Google Sheets URL\'si değil.')

    sheet_id = match.group(1)

    # gid (sayfa numarası) varsa ekle
    gid_match = re.search(r'[?&#]gid=(\d+)', url)
    gid_param = f'&gid={gid_match.group(1)}' if gid_match else ''

    return f'https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv{gid_param}'


@api_view(['POST'])
@permission_classes([IsAdminUser])
def import_sheets_url(request):
    """
    Body JSON: { "url": "https://docs.google.com/spreadsheets/d/..." }
    Sheet herkese açık (Anyone with the link - Viewer) olmalı.
    """
    url = (request.data.get('url') or '').strip()
    if not url:
        return Response({'error': "'url' alanı gerekli."}, status=400)

    try:
        csv_url = _sheets_url_to_csv(url)
    except ValueError as e:
        return Response({'error': str(e)}, status=400)

    try:
        req = urllib.request.Request(
            csv_url,
            headers={'User-Agent': 'Mozilla/5.0 (compatible; GDSL-Importer/1.0)'}
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            raw_bytes = resp.read()
    except Exception as exc:
        return Response({
            'error': f'Sheet indirilemedi: {exc}. Sayfanın "Herkesle paylaş (Görüntüleyici)" olduğundan emin olun.'
        }, status=400)

    try:
        raw = raw_bytes.decode('utf-8-sig')
    except UnicodeDecodeError:
        raw = raw_bytes.decode('windows-1254', errors='replace')

    olusturulan, guncellenen, atlanan, hatalar = _import_from_csv_text(raw)

    return Response({
        'success':     True,
        'csv_url':     csv_url,
        'olusturulan': olusturulan,
        'guncellenen': guncellenen,
        'atlanan':     atlanan,
        'hatalar':     hatalar[:20],
        'toplam':      olusturulan + guncellenen + atlanan,
    }, status=200)



# ─────────────────────────────────────────────────────────────────────────────
# KATILIMCI ME ENDPOINT
# ─────────────────────────────────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def katilimci_me(request):
    """GET /api/katilimci/me/ — Oturum açık kullanıcının katılımcı profilini ve takım bilgisini döndürür."""
    if not hasattr(request.user, 'katilimci_profili'):
        return Response({'detail': 'Kullanıcı bir katılımcı değil.'}, status=status.HTTP_403_FORBIDDEN)

    katilimci = request.user.katilimci_profili
    takim_obj = katilimci.takim

    data = {
        'id': katilimci.id,
        'ad_soyad': katilimci.ad_soyad,
        'eposta': katilimci.eposta,
        'takim': takim_obj.id if takim_obj else None,
        'takim_adi': takim_obj.takim_adi if takim_obj else None,
        'toplam_puan': takim_obj.toplam_puan if takim_obj else 0,
        'program_katilim_durumu': katilimci.program_katilim_durumu,
        'kabul_durumu': katilimci.kabul_durumu,
        'universite': katilimci.aday.universite if katilimci.aday else None,
        'sinif': katilimci.aday.sinif if katilimci.aday else None,
    }
    return Response(data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────────────────────
# KATILIMCI TESLİM SUBMIT ENDPOINT
# ─────────────────────────────────────────────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def teslim_submit(request):
    """
    POST /api/teslimler/submit/ — Katılımcıların bir göreve teslim yapmasını sağlar.
    Teslim yoksa BEKLIYOR durumunda oluşturur ve ILK_TESLIM hareketi ekler.
    Teslim REVIZYON_ISTENDI ise REVIZE_EDILDI durumuna çeker ve REVIZE_TESLIM hareketi ekler.
    Teslim TAMAMLANDI ise 400 hatası döndürür.
    """
    if not hasattr(request.user, 'katilimci_profili'):
        return Response({'detail': 'Bu işlem yalnızca katılımcılara açıktır.'}, status=status.HTTP_403_FORBIDDEN)

    katilimci = request.user.katilimci_profili
    gorev_id = request.data.get('gorev')

    if not gorev_id:
        return Response({'detail': 'Görev ID zorunludur.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        gorev = Gorev.objects.get(id=gorev_id)
    except (Gorev.DoesNotExist, ValueError):
        return Response({'detail': 'Belirtilen görev bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

    # Görev atama yetkisi kontrolü
    if gorev.gorev_tipi == Gorev.GorevTipi.BIREYSEL:
        if gorev.hedef_katilimci and gorev.hedef_katilimci != katilimci:
            return Response({'detail': 'Bu görev başka bir katılımcıya atanmıştır.'}, status=status.HTTP_403_FORBIDDEN)
    elif gorev.gorev_tipi == Gorev.GorevTipi.TAKIMSAL:
        if gorev.hedef_takim and katilimci.takim != gorev.hedef_takim:
            return Response({'detail': 'Bu görev başka bir takıma atanmıştır.'}, status=status.HTTP_403_FORBIDDEN)

    # Mevcut Teslim kontrolü
    teslim = None
    if gorev.gorev_tipi == Gorev.GorevTipi.TAKIMSAL and katilimci.takim:
        teslim = Teslim.objects.filter(gorev=gorev, takim=katilimci.takim).first()

    if not teslim:
        teslim = Teslim.objects.filter(gorev=gorev, katilimci=katilimci).first()

    # TAMAMLANDI ise yeniden teslim yükleme engeli
    if teslim and teslim.durum == Teslim.Durum.TAMAMLANDI:
        return Response({'detail': 'Bu görev nihai olarak değerlendirildiği için yeni teslim yüklenemez.'}, status=status.HTTP_400_BAD_REQUEST)

    teslim_linki = request.data.get('teslim_linki', '')
    aciklama = request.data.get('aciklama', '')
    teslim_dosyasi = request.FILES.get('teslim_dosyasi') or request.FILES.get('dosya')

    now = timezone.now()

    if teslim:
        is_revizyon = (teslim.durum == Teslim.Durum.REVIZYON_ISTENDI)
        teslim.durum = Teslim.Durum.REVIZE_EDILDI if is_revizyon else Teslim.Durum.BEKLIYOR
        teslim.teslim_linki = teslim_linki
        teslim.aciklama = aciklama
        teslim.teslim_tarihi = now
        teslim.degerlendirildi = False
        teslim.revizyon_istendi = False
        if teslim_dosyasi:
            teslim.teslim_dosyasi = teslim_dosyasi
        if not teslim.katilimci:
            teslim.katilimci = katilimci
        if not teslim.takim and katilimci.takim:
            teslim.takim = katilimci.takim
        teslim.save()

        # Timeline Hareketi
        islem_tipi = TeslimHareketi.IslemTipi.REVIZE_TESLIM if is_revizyon else TeslimHareketi.IslemTipi.ILK_TESLIM
        TeslimHareketi.objects.create(
            teslim=teslim,
            islem_tipi=islem_tipi,
            aciklama=aciklama,
            teslim_linki=teslim_linki,
            teslim_dosyasi=teslim.teslim_dosyasi,
            olusturan_user=request.user
        )
        status_code = status.HTTP_200_OK
    else:
        teslim = Teslim.objects.create(
            gorev=gorev,
            katilimci=katilimci,
            takim=katilimci.takim,
            teslim_linki=teslim_linki,
            teslim_dosyasi=teslim_dosyasi,
            aciklama=aciklama,
            durum=Teslim.Durum.BEKLIYOR,
            degerlendirildi=False,
            revizyon_istendi=False,
        )
        # Timeline Hareketi
        TeslimHareketi.objects.create(
            teslim=teslim,
            islem_tipi=TeslimHareketi.IslemTipi.ILK_TESLIM,
            aciklama=aciklama,
            teslim_linki=teslim_linki,
            teslim_dosyasi=teslim_dosyasi,
            olusturan_user=request.user
        )
        status_code = status.HTTP_201_CREATED

    serializer = TeslimSerializer(teslim, context={'request': request})
    return Response(serializer.data, status=status_code)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def teslim_revizyon_iste(request, pk):
    """
    POST /api/teslimler/<pk>/revizyon-iste/ — Mentor/Admin teslim için revizyon ister.
    """
    try:
        teslim = Teslim.objects.get(pk=pk)
    except Teslim.DoesNotExist:
        return Response({'detail': 'Teslim bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

    # Yetki kontrolü: Admin veya ilgili Mentor
    if not request.user.is_staff:
        if not hasattr(request.user, 'mentor_profili'):
            return Response({'detail': 'Bu işlem yalnızca mentorlar veya yöneticiler tarafından yapılabilir.'}, status=status.HTTP_403_FORBIDDEN)
        mentor = request.user.mentor_profili
        is_own = (teslim.takim and teslim.takim.mentor == mentor) or (teslim.katilimci and teslim.katilimci.takim and teslim.katilimci.takim.mentor == mentor)
        if not is_own:
            return Response({'detail': 'Bu teslimi değerlendirme yetkiniz yok.'}, status=status.HTTP_403_FORBIDDEN)

    revizyon_notu = request.data.get('revizyon_notu') or request.data.get('mentor_yorumu') or ''
    mentor_yorumu = request.data.get('mentor_yorumu') or revizyon_notu

    teslim.durum = Teslim.Durum.REVIZYON_ISTENDI
    teslim.revizyon_istendi = True
    teslim.degerlendirildi = False
    teslim.mentor_yorumu = mentor_yorumu
    teslim.save()

    # Timeline Hareketi
    TeslimHareketi.objects.create(
        teslim=teslim,
        islem_tipi=TeslimHareketi.IslemTipi.REVIZYON_ISTENDI,
        revizyon_notu=revizyon_notu,
        mentor_yorumu=mentor_yorumu,
        olusturan_user=request.user
    )

    serializer = TeslimSerializer(teslim, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def teslim_nihai_degerlendir(request, pk):
    """
    POST /api/teslimler/<pk>/nihai-degerlendir/ — Mentor/Admin teslim için nihai değerlendirme ve puanlama yapar.
    """
    try:
        teslim = Teslim.objects.get(pk=pk)
    except Teslim.DoesNotExist:
        return Response({'detail': 'Teslim bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

    # Yetki kontrolü: Admin veya ilgili Mentor
    if not request.user.is_staff:
        if not hasattr(request.user, 'mentor_profili'):
            return Response({'detail': 'Bu işlem yalnızca mentorlar veya yöneticiler tarafından yapılabilir.'}, status=status.HTTP_403_FORBIDDEN)
        mentor = request.user.mentor_profili
        is_own = (teslim.takim and teslim.takim.mentor == mentor) or (teslim.katilimci and teslim.katilimci.takim and teslim.katilimci.takim.mentor == mentor)
        if not is_own:
            return Response({'detail': 'Bu teslimi değerlendirme yetkiniz yok.'}, status=status.HTTP_403_FORBIDDEN)

    raw_puan = request.data.get('alinan_puan')
    if raw_puan is None:
        return Response({'detail': 'Alınan puan zorunludur.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        puan_val = int(raw_puan)
        if puan_val < 0 or puan_val > 100:
            raise ValueError()
    except (ValueError, TypeError):
        return Response({'detail': 'Puan 0 ile 100 arasında bir tamsayı olmalıdır.'}, status=status.HTTP_400_BAD_REQUEST)

    mentor_yorumu = request.data.get('mentor_yorumu', '')

    teslim.durum = Teslim.Durum.TAMAMLANDI
    teslim.degerlendirildi = True
    teslim.revizyon_istendi = False
    teslim.alinan_puan = puan_val
    teslim.mentor_yorumu = mentor_yorumu
    teslim.save()

    # Timeline Hareketi
    TeslimHareketi.objects.create(
        teslim=teslim,
        islem_tipi=TeslimHareketi.IslemTipi.NIHAI_DEGERLENDIRME,
        puan=puan_val,
        mentor_yorumu=mentor_yorumu,
        olusturan_user=request.user
    )

    serializer = TeslimSerializer(teslim, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────────────────────
# MENTOR ENDPOINTLERİ
# ─────────────────────────────────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_me(request):
    """GET /api/mentor/me/ — Oturum açık kullanıcının mentor profilini döndürür."""
    if not hasattr(request.user, 'mentor_profili'):
        return Response({'detail': 'Kullanıcı bir mentor değil.'}, status=status.HTTP_403_FORBIDDEN)

    mentor = request.user.mentor_profili
    data = {
        'id': mentor.id,
        'ad_soyad': mentor.ad_soyad,
        'eposta': mentor.eposta,
        'uzmanlik': mentor.uzmanlik,
        'username': request.user.username,
    }
    return Response(data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_takimlarim(request):
    """GET /api/mentor/takimlarim/ — Giriş yapan mentora atanmış takımları döndürür."""
    if not hasattr(request.user, 'mentor_profili'):
        return Response({'detail': 'Kullanıcı bir mentor değil.'}, status=status.HTTP_403_FORBIDDEN)

    mentor = request.user.mentor_profili
    takimlar = Takim.objects.filter(mentor=mentor).prefetch_related('katilimcilar__aday')
    serializer = TakimSerializer(takimlar, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mentor_katilimcilarim(request):
    """GET /api/mentor/katilimcilarim/ — Mentora atanmış takımlardaki katılımcıları döndürür."""
    if not hasattr(request.user, 'mentor_profili'):
        return Response({'detail': 'Kullanıcı bir mentor değil.'}, status=status.HTTP_403_FORBIDDEN)

    mentor = request.user.mentor_profili
    katilimcilar = Katilimci.objects.filter(takim__mentor=mentor).select_related('aday', 'takim')

    data = [
        {
            'id': k.id,
            'aday_ad_soyad': k.aday.ad_soyad if k.aday else '',
            'ad_soyad': k.aday.ad_soyad if k.aday else '',
            'eposta': k.eposta,
            'takim_adi': k.takim.takim_adi if k.takim else None,
            'universite': k.aday.universite if k.aday else None,
            'sinif': k.aday.sinif if k.aday else None,
            'program_katilim_durumu': k.program_katilim_durumu,
        }
        for k in katilimcilar
    ]
    return Response(data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────────────────────
# İÇERİK DNA TESTİ — KATILIMCı ENDPOINTLERİ
# ─────────────────────────────────────────────────────────────────────────────
def _clean_error_message(exc: Exception) -> str:
    """Hata mesajındaki hassas bilgileri (API key vb.) temizler ve Türkçe açıklama üretir."""
    raw_str = str(exc)
    # sk-... API key kalıplarını sansürle
    safe_str = re.sub(r'sk-[a-zA-Z0-9T3BlbkFJ\-]{10,}', '[REDACTED_KEY]', raw_str)

    if 'insufficient_quota' in raw_str or 'RateLimitError' in raw_str or '429' in raw_str:
        return 'OpenAI API kotası tükendi veya bakiyeniz yetersiz. Lütfen OpenAI platform hesabınızı ve faturalandırma detaylarınızı kontrol edin.'
    elif 'AuthenticationError' in raw_str or 'invalid_api_key' in raw_str or '401' in raw_str:
        return 'OpenAI API anahtarınız geçersiz veya yetkisiz.'
    elif 'NotFoundError' in raw_str or '404' in raw_str:
        return 'OpenAI API belirtilen modeli bulamadı veya erişim izniniz yok.'

    return f"İçerik DNA raporu üretilirken hata oluştu: {safe_str}"


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def icerik_dna_me(request):
    """GET /api/icerik-dna/me/ — Oturum açık katılımcının test kaydını döndürür."""
    if not hasattr(request.user, 'katilimci_profili'):
        return Response({'detail': 'Bu işlem yalnızca katılımcılara açıktır.'}, status=status.HTTP_403_FORBIDDEN)

    katilimci = request.user.katilimci_profili
    testi, _ = IcerikDNATesti.objects.get_or_create(katilimci=katilimci)
    serializer = IcerikDNATestiSerializer(testi)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def icerik_dna_submit(request):
    if not hasattr(request.user, 'katilimci_profili'):
        return Response({'detail': 'Bu işlem yalnızca katılımcılara açıktır.'}, status=status.HTTP_403_FORBIDDEN)

    katilimci = request.user.katilimci_profili
    cevaplar  = request.data.get('cevaplar', {})

    if not isinstance(cevaplar, dict) or not cevaplar:
        return Response({'detail': 'cevaplar alanı boş olamaz ve dict olmalıdır.'}, status=status.HTTP_400_BAD_REQUEST)

    testi, _ = IcerikDNATesti.objects.get_or_create(katilimci=katilimci)

    from django.utils import timezone
    testi.cevaplar        = cevaplar
    testi.durum           = IcerikDNATesti.Durum.ISLENIYOR
    testi.gonderim_tarihi = timezone.now()
    testi.hata_mesaji     = None
    testi.save(update_fields=['cevaplar', 'durum', 'gonderim_tarihi', 'hata_mesaji'])

    try:
        sonuc = generate_icerik_dna_report(cevaplar)
        testi.rapor_json  = sonuc['rapor_json']
        testi.rapor_metni = sonuc['rapor_metni']
        testi.durum       = IcerikDNATesti.Durum.TAMAMLANDI
        testi.ai_model    = sonuc['rapor_json'].get('model', 'placeholder-v1')
        testi.save(update_fields=['rapor_json', 'rapor_metni', 'durum', 'ai_model'])
    except Exception as exc:
        hata_str = _clean_error_message(exc)
        testi.durum       = IcerikDNATesti.Durum.HATA
        testi.hata_mesaji = hata_str
        testi.save(update_fields=['durum', 'hata_mesaji'])
        serializer = IcerikDNATestiSerializer(testi)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = IcerikDNATestiSerializer(testi)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ─────────────────────────────────────────────────────────────────────────────
# İÇERİK DNA TESTİ — ADMİN ENDPOINTLERİ
# ─────────────────────────────────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_icerik_dna_list(request):
    """GET /api/admin/icerik-dna/ — Tüm testleri listeler."""
    testler = IcerikDNATesti.objects.select_related('katilimci__aday').all()
    serializer = AdminIcerikDNATestiSerializer(testler, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_icerik_dna_detail(request, pk):
    """GET /api/admin/icerik-dna/<id>/ — Tek test detayı."""
    try:
        testi = IcerikDNATesti.objects.select_related('katilimci__aday').get(pk=pk)
    except IcerikDNATesti.DoesNotExist:
        return Response({'detail': 'Bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)
    serializer = AdminIcerikDNATestiSerializer(testi)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_icerik_dna_regenerate(request, pk):
    """POST /api/admin/icerik-dna/<id>/regenerate/ — Raporu yeniden üretir."""
    try:
        testi = IcerikDNATesti.objects.get(pk=pk)
    except IcerikDNATesti.DoesNotExist:
        return Response({'detail': 'Bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

    if not testi.cevaplar:
        return Response({'detail': 'Henüz cevap gönderilmemiş.'}, status=status.HTTP_400_BAD_REQUEST)

    testi.durum = IcerikDNATesti.Durum.ISLENIYOR
    testi.save(update_fields=['durum'])

    try:
        sonuc = generate_icerik_dna_report(testi.cevaplar)
        testi.rapor_json  = sonuc['rapor_json']
        testi.rapor_metni = sonuc['rapor_metni']
        testi.durum       = IcerikDNATesti.Durum.TAMAMLANDI
        testi.ai_model    = sonuc['rapor_json'].get('model', 'placeholder-v1')
        testi.hata_mesaji = None
        testi.save(update_fields=['rapor_json', 'rapor_metni', 'durum', 'ai_model', 'hata_mesaji'])
    except Exception as exc:
        hata_str = _clean_error_message(exc)
        testi.durum       = IcerikDNATesti.Durum.HATA
        testi.hata_mesaji = hata_str
        testi.save(update_fields=['durum', 'hata_mesaji'])
        serializer = AdminIcerikDNATestiSerializer(testi)
        return Response(serializer.data, status=status.HTTP_200_OK)

    serializer = AdminIcerikDNATestiSerializer(testi)
    return Response(serializer.data)


# ─────────────────────────────────────────────────────────────────────────────
# PERFORMANS — KATILIMCı ENDPOINTİ
# ─────────────────────────────────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def katilimci_performans_me(request):
    """GET /api/performans/me/ — Katılımcının kendi performans özetini döner."""
    if not hasattr(request.user, 'katilimci_profili'):
        return Response(
            {'detail': 'Bu endpoint yalnızca katılımcılara açıktır.'},
            status=status.HTTP_403_FORBIDDEN
        )
    katilimci = request.user.katilimci_profili
    performans, _ = KatilimciPerformans.objects.get_or_create(katilimci=katilimci)
    serializer = KatilimciPerformansSerializer(performans)
    return Response(serializer.data)


# ─────────────────────────────────────────────────────────────────────────────
# PERFORMANS — ADMİN ENDPOINTLERİ
# ─────────────────────────────────────────────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_performans_list(request):
    """GET /api/admin/performans/ — Tüm katılımcıların performans özeti."""
    performanslar = KatilimciPerformans.objects.select_related(
        'katilimci__aday', 'katilimci__takim'
    ).all()
    serializer = AdminKatilimciPerformansSerializer(performanslar, many=True)
    return Response(serializer.data)


@api_view(['GET', 'PATCH'])
@permission_classes([IsAdminUser])
def admin_performans_detail(request, katilimci_id):
    """
    GET  /api/admin/performans/<katilimci_id>/ — Tek katılımcının performans detayı.
    PATCH /api/admin/performans/<katilimci_id>/ — Performans güncelle + recalculate().
    """
    try:
        katilimci = Katilimci.objects.select_related('aday', 'takim').get(pk=katilimci_id)
    except Katilimci.DoesNotExist:
        return Response({'detail': 'Katılımcı bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

    performans, _ = KatilimciPerformans.objects.get_or_create(katilimci=katilimci)

    if request.method == 'GET':
        # Detay: performans + ilişkili kayıtlar
        performans_data = AdminKatilimciPerformansSerializer(performans).data
        teslimler = Teslim.objects.filter(katilimci=katilimci).select_related('gorev')
        toplanti_katilimlari = ToplantiKatilimi.objects.filter(katilimci=katilimci)
        sosyal_medya = SosyalMedyaPerformansi.objects.filter(katilimci=katilimci)
        performans_notlari = KatilimciPerformansNotu.objects.filter(katilimci=katilimci).select_related('kriter', 'veren_user')

        return Response({
            'katilimci': {
                'id': katilimci.id,
                'ad_soyad': katilimci.aday.ad_soyad,
                'eposta': katilimci.aday.eposta,
                'takim': katilimci.takim.takim_adi if katilimci.takim else None,
                'program_katilim_durumu': katilimci.program_katilim_durumu,
            },
            'performans': performans_data,
            'teslimler': TeslimSerializer(teslimler, many=True).data,
            'toplanti_katilimlari': ToplantiKatimiSerializer(toplanti_katilimlari, many=True).data,
            'sosyal_medya_performanslari': SosyalMedyaPerformansiSerializer(sosyal_medya, many=True).data,
            'performans_notlari': KatilimciPerformansNotuSerializer(performans_notlari, many=True).data,
        })

    # PATCH
    izin_verilen_alanlar = {
        'gorev_puani', 'toplanti_katilim_puani', 'etkilesim_bonus_puani',
        'manuel_puan', 'admin_ici_not', 'katilimciya_gorunen_not',
    }
    data = {k: v for k, v in request.data.items() if k in izin_verilen_alanlar}
    serializer = AdminKatilimciPerformansSerializer(performans, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        performans.refresh_from_db()
        performans.recalculate()
        return Response(AdminKatilimciPerformansSerializer(performans).data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_performans_not_ekle(request, katilimci_id):
    """POST /api/admin/performans/<katilimci_id>/not-ekle/ — Kriter bazlı not ekle."""
    try:
        katilimci = Katilimci.objects.get(pk=katilimci_id)
    except Katilimci.DoesNotExist:
        return Response({'detail': 'Katılımcı bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    data['katilimci'] = katilimci.id
    serializer = KatilimciPerformansNotuSerializer(data=data)
    if serializer.is_valid():
        serializer.save(veren_user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_toplanti_katilimi_ekle(request, katilimci_id):
    """POST /api/admin/performans/<katilimci_id>/toplanti-katilimi/ — Toplantı katılımı ekle."""
    try:
        katilimci = Katilimci.objects.get(pk=katilimci_id)
    except Katilimci.DoesNotExist:
        return Response({'detail': 'Katılımcı bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    data['katilimci'] = katilimci.id
    serializer = ToplantiKatimiSerializer(data=data)
    if serializer.is_valid():
        serializer.save(giren_user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_sosyal_medya_ekle(request, katilimci_id):
    """POST /api/admin/performans/<katilimci_id>/sosyal-medya/ — Sosyal medya performansı ekle."""
    try:
        katilimci = Katilimci.objects.get(pk=katilimci_id)
    except Katilimci.DoesNotExist:
        return Response({'detail': 'Katılımcı bulunamadı.'}, status=status.HTTP_404_NOT_FOUND)

    data = request.data.copy()
    data['katilimci'] = katilimci.id
    serializer = SosyalMedyaPerformansiSerializer(data=data)
    if serializer.is_valid():
        serializer.save(giren_user=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
