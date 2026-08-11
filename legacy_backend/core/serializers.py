from rest_framework import serializers
from .models import (
    Aday, Takim, Katilimci, Gorev, Teslim, TeslimHareketi, Mentor, IcerikDNATesti,
    KatilimciPerformans, PerformansKriteri, KatilimciPerformansNotu,
    ToplantiKatilimi, SosyalMedyaPerformansi,
)


class MentorSerializer(serializers.ModelSerializer):
    gecici_sifre = serializers.CharField(write_only=True, required=False, allow_blank=True)
    has_user = serializers.SerializerMethodField(read_only=True)

    def get_has_user(self, obj):
        return obj.user_id is not None

    class Meta:
        model  = Mentor
        fields = ['id', 'ad_soyad', 'eposta', 'uzmanlik', 'user', 'gecici_sifre', 'has_user']

    def create(self, validated_data):
        gecici_sifre = validated_data.pop('gecici_sifre', None)
        eposta = validated_data.get('eposta')

        user = self._get_or_create_user(eposta, gecici_sifre)
        validated_data['user'] = user

        return super().create(validated_data)

    def update(self, instance, validated_data):
        gecici_sifre = validated_data.pop('gecici_sifre', None)
        new_eposta = validated_data.get('eposta', instance.eposta)

        user = instance.user
        if not user:
            user = self._get_or_create_user(new_eposta, gecici_sifre)
            instance.user = user
        else:
            if new_eposta and new_eposta != user.email:
                user.email = new_eposta
            if gecici_sifre and gecici_sifre.strip():
                user.set_password(gecici_sifre.strip())
            user.save()

        return super().update(instance, validated_data)

    def _get_or_create_user(self, eposta, passw):
        from django.contrib.auth.models import User
        if not eposta:
            return None

        user = User.objects.filter(email=eposta).first()
        if not user:
            username = eposta.split('@')[0]
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1

            user = User.objects.create(
                username=username,
                email=eposta,
                is_active=True,
                is_staff=False,
                is_superuser=False
            )

        if passw and passw.strip():
            user.set_password(passw.strip())
            user.save()

        return user



class AdaySerializer(serializers.ModelSerializer):
    ad_soyad = serializers.SerializerMethodField(read_only=True)

    def get_ad_soyad(self, obj):
        return f'{obj.ad} {obj.soyad}'

    class Meta:
        model = Aday
        fields = '__all__'


class KatilimciSerializer(serializers.ModelSerializer):
    # Frontend'in ismi okuyabilmesi için:
    aday_ad_soyad = serializers.CharField(source='aday.ad_soyad', read_only=True)
    # Eski uyumluluk için aday_adi de kalsın
    aday_adi      = serializers.CharField(source='aday.ad_soyad', read_only=True)
    takim_adi     = serializers.CharField(source='takim.takim_adi', read_only=True, default=None)

    class Meta:
        model = Katilimci
        fields = '__all__'


class TakimUyeSerializer(serializers.ModelSerializer):
    """Takım kartı içinde gösterilecek hafif üye bilgisi."""
    aday_adi        = serializers.CharField(source='aday.ad_soyad',   read_only=True)
    aday_universite = serializers.CharField(source='aday.universite', read_only=True)

    class Meta:
        model  = Katilimci
        fields = ['id', 'aday', 'aday_adi', 'aday_universite', 'program_katilim_durumu']


class TakimSerializer(serializers.ModelSerializer):
    # Takıma ait katılımcıları iç içe döndür (read-only)
    katilimcilar = TakimUyeSerializer(many=True, read_only=True)
    # Mentor adını read-only olarak da expose et (v2)
    mentor_adi   = serializers.CharField(source='mentor.ad_soyad', read_only=True, default=None)

    class Meta:
        model  = Takim
        fields = '__all__'


class GorevSerializer(serializers.ModelSerializer):
    # Frontend'in hedef isimlerini kolayca okuyabilmesi için read-only alanlar
    hedef_katilimci_adi = serializers.SerializerMethodField(read_only=True)
    hedef_takim_adi     = serializers.CharField(source='hedef_takim.takim_adi', read_only=True, default=None)

    def get_hedef_katilimci_adi(self, obj):
        if obj.hedef_katilimci and obj.hedef_katilimci.aday:
            return obj.hedef_katilimci.aday.ad_soyad
        return None

    class Meta:
        model  = Gorev
        fields = '__all__'


class TeslimHareketiSerializer(serializers.ModelSerializer):
    islem_tipi_etiketi  = serializers.CharField(source='get_islem_tipi_display', read_only=True)
    olusturan_adi       = serializers.SerializerMethodField(read_only=True)
    teslim_dosyasi_url  = serializers.SerializerMethodField(read_only=True)

    def get_olusturan_adi(self, obj):
        if obj.olusturan_user:
            return obj.olusturan_user.get_full_name() or obj.olusturan_user.username
        return 'Sistem'

    def get_teslim_dosyasi_url(self, obj):
        if obj.teslim_dosyasi:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.teslim_dosyasi.url)
            return obj.teslim_dosyasi.url
        return None

    class Meta:
        model  = TeslimHareketi
        fields = '__all__'


class TeslimSerializer(serializers.ModelSerializer):
    gorev_adi          = serializers.CharField(source='gorev.gorev_adi', read_only=True)
    takim_adi          = serializers.CharField(source='takim.takim_adi', read_only=True, default=None)
    katilimci_adi      = serializers.CharField(source='katilimci.aday.ad_soyad', read_only=True, default=None)
    durum_etiketi      = serializers.CharField(source='get_durum_display', read_only=True)
    teslim_dosyasi_url = serializers.SerializerMethodField(read_only=True)
    hareketler         = TeslimHareketiSerializer(many=True, read_only=True)

    def get_teslim_dosyasi_url(self, obj):
        if obj.teslim_dosyasi:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.teslim_dosyasi.url)
            return obj.teslim_dosyasi.url
        return None

    class Meta:
        model  = Teslim
        fields = '__all__'


class IcerikDNATestiSerializer(serializers.ModelSerializer):
    """Katılımcı kendi testini okur/günceller."""
    katilimci_adi = serializers.CharField(source='katilimci.aday.ad_soyad', read_only=True)

    class Meta:
        model  = IcerikDNATesti
        fields = [
            'id', 'katilimci', 'katilimci_adi',
            'cevaplar', 'rapor_json', 'rapor_metni',
            'durum', 'ai_model', 'prompt_versiyonu',
            'gonderim_tarihi', 'olusturulma_tarihi', 'guncellenme_tarihi',
        ]
        read_only_fields = [
            'id', 'katilimci', 'katilimci_adi',
            'rapor_json', 'rapor_metni',
            'durum', 'ai_model', 'prompt_versiyonu',
            'gonderim_tarihi', 'olusturulma_tarihi', 'guncellenme_tarihi',
        ]



class AdminIcerikDNATestiSerializer(serializers.ModelSerializer):
    """Admin tüm alanları okur."""
    katilimci_adi = serializers.CharField(source='katilimci.aday.ad_soyad', read_only=True)

    class Meta:
        model  = IcerikDNATesti
        fields = '__all__'


# ─────────────────────────────────────────────────────────────────────────────
# PERFORMANS SERIALIZERLARı
# ─────────────────────────────────────────────────────────────────────────────

class PerformansKriteriSerializer(serializers.ModelSerializer):
    kategori_etiketi = serializers.CharField(source='get_kategori_display', read_only=True)

    class Meta:
        model  = PerformansKriteri
        fields = ['id', 'ad', 'aciklama', 'kategori', 'kategori_etiketi', 'maksimum_puan', 'aktif', 'olusturulma_tarihi']


class KatilimciPerformansNotuSerializer(serializers.ModelSerializer):
    kriter_adi   = serializers.CharField(source='kriter.ad', read_only=True, default=None)
    veren_adi    = serializers.SerializerMethodField(read_only=True)

    def get_veren_adi(self, obj):
        if obj.veren_user:
            return obj.veren_user.get_full_name() or obj.veren_user.username
        return None

    class Meta:
        model  = KatilimciPerformansNotu
        fields = ['id', 'katilimci', 'kriter', 'kriter_adi', 'puan', 'not_metni',
                  'veren_user', 'veren_adi', 'olusturulma_tarihi']
        read_only_fields = ['veren_user', 'olusturulma_tarihi']


class ToplantiKatimiSerializer(serializers.ModelSerializer):
    giren_adi = serializers.SerializerMethodField(read_only=True)

    def get_giren_adi(self, obj):
        if obj.giren_user:
            return obj.giren_user.get_full_name() or obj.giren_user.username
        return None

    class Meta:
        model  = ToplantiKatilimi
        fields = ['id', 'katilimci', 'baslik', 'tarih', 'katildi_mi',
                  'katilim_puani', 'not_metni', 'giren_user', 'giren_adi', 'olusturulma_tarihi']
        read_only_fields = ['giren_user', 'olusturulma_tarihi']


class SosyalMedyaPerformansiSerializer(serializers.ModelSerializer):
    giren_adi = serializers.SerializerMethodField(read_only=True)

    def get_giren_adi(self, obj):
        if obj.giren_user:
            return obj.giren_user.get_full_name() or obj.giren_user.username
        return None

    class Meta:
        model  = SosyalMedyaPerformansi
        fields = ['id', 'katilimci', 'platform', 'takipci_sayisi', 'etkilesim_sayisi',
                  'etkilesim_orani', 'bonus_puan', 'not_metni', 'giren_user', 'giren_adi',
                  'olusturulma_tarihi']
        read_only_fields = ['etkilesim_orani', 'giren_user', 'olusturulma_tarihi']


class KatilimciPerformansSerializer(serializers.ModelSerializer):
    """Katılımcının kendi performans özeti — admin_ici_not HARİÇ."""
    katilimci_adi   = serializers.CharField(source='katilimci.aday.ad_soyad', read_only=True)
    takim_adi       = serializers.CharField(source='katilimci.takim.takim_adi', read_only=True, default=None)
    hesaplanan_gorev_puani = serializers.SerializerMethodField(read_only=True)

    def get_hesaplanan_gorev_puani(self, obj):
        return obj.hesapla_gorev_puani()

    class Meta:
        model  = KatilimciPerformans
        fields = [
            'id', 'katilimci', 'katilimci_adi', 'takim_adi',
            'bireysel_puan', 'gorev_puani', 'toplanti_katilim_puani',
            'etkilesim_bonus_puani', 'manuel_puan',
            'katilimciya_gorunen_not', 'hesaplanan_gorev_puani',
            'guncellenme_tarihi', 'olusturulma_tarihi',
        ]
        read_only_fields = fields  # Katılımcı sadece okuyabilir


class AdminKatilimciPerformansSerializer(serializers.ModelSerializer):
    """Admin için performans özeti — admin_ici_not DAHİL, tüm alanlar yazılabilir."""
    katilimci_adi = serializers.CharField(source='katilimci.aday.ad_soyad', read_only=True)
    takim_adi     = serializers.CharField(source='katilimci.takim.takim_adi', read_only=True, default=None)
    hesaplanan_gorev_puani = serializers.SerializerMethodField(read_only=True)

    def get_hesaplanan_gorev_puani(self, obj):
        return obj.hesapla_gorev_puani()

    class Meta:
        model  = KatilimciPerformans
        fields = [
            'id', 'katilimci', 'katilimci_adi', 'takim_adi',
            'bireysel_puan', 'gorev_puani', 'toplanti_katilim_puani',
            'etkilesim_bonus_puani', 'manuel_puan',
            'admin_ici_not', 'katilimciya_gorunen_not',
            'hesaplanan_gorev_puani',
            'guncellenme_tarihi', 'olusturulma_tarihi',
        ]
        read_only_fields = ['bireysel_puan', 'katilimci', 'guncellenme_tarihi', 'olusturulma_tarihi']
