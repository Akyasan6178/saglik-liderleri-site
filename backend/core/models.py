"""
Geleceğin Dijital Sağlık Liderleri — Veritabanı Modelleri
==========================================================
Modeller:
  1. Mentor     — Bağımsız Marka Mutfağı ekip üyesi (mentor)
  3. Aday       — Başvuran kişi
  4. Takim      — Katılımcı grubu
  5. Katilimci  — Kabul edilmiş aday (Aday ile 1-1)
  6. Gorev      — Haftalık görev tanımı
  7. Teslim     — Görev teslimi (takım veya bireysel)
"""

from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User


# ─────────────────────────────────────────────────────────────────────────────
# 0-A. MENTOR
# ─────────────────────────────────────────────────────────────────────────────
class Mentor(models.Model):
    """Bağımsız Marka Mutfağı ekip üyesi — Aday/Katılımcı havuzuyla karıştırılmaz."""

    ad_soyad  = models.CharField(max_length=150, verbose_name='Ad Soyad')
    eposta    = models.EmailField(unique=True, verbose_name='E-posta')
    uzmanlik  = models.CharField(
        max_length=200,
        blank=True,
        verbose_name='Uzmanlık Alanı',
        help_text='Örn: Dijital Sağlık Pazarlaması, Ürün Tasarımı'
    )
    user      = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='mentor_profili',
        verbose_name='Kullanıcı Hesabı'
    )

    class Meta:
        verbose_name        = 'Mentor'
        verbose_name_plural = 'Mentorlar'
        ordering            = ['ad_soyad']

    def __str__(self):
        return f'{self.ad_soyad} ({self.eposta})'




# ─────────────────────────────────────────────────────────────────────────────
# 1. ADAY
# ─────────────────────────────────────────────────────────────────────────────
class Aday(models.Model):
    """Programa başvuran adayın profili — Google Form alanlarıyla eşleşir."""

    class BasvuruDurumu(models.TextChoices):
        BEKLIYOR   = 'BEKLIYOR',   'Bekliyor'
        ONAYLANDI  = 'ONAYLANDI',  'Onaylandi'
        REDDEDILDI = 'REDDEDILDI', 'Reddedildi'

    class Sinif(models.TextChoices):
        SINIF_1 = '1. Sinif', '1. Sinif'
        SINIF_2 = '2. Sinif', '2. Sinif'
        SINIF_3 = '3. Sinif', '3. Sinif'
        SINIF_4 = '4. Sinif', '4. Sinif'
        MEZUN   = 'Mezun',    'Mezun'
        DIGER   = 'Diger',    'Diger'

    # -- Kisisel Bilgiler ------------------------------------------------------
    ad      = models.CharField(max_length=80,  verbose_name='Ad')
    soyad   = models.CharField(max_length=80,  verbose_name='Soyad')
    eposta  = models.EmailField(unique=True,   verbose_name='E-posta')
    telefon = models.CharField(max_length=25,  blank=True, null=True, verbose_name='Telefon')

    # -- Akademik Bilgiler -----------------------------------------------------
    universite = models.CharField(max_length=200, blank=True, null=True, verbose_name='Universite')
    sinif      = models.CharField(
        max_length=20,
        choices=Sinif.choices,
        blank=True, null=True,
        verbose_name='Sinif'
    )

    # -- Sosyal Medya & Icerik -------------------------------------------------
    sosyal_medya   = models.TextField(blank=True, null=True, verbose_name='Sosyal Medya Adresleri')
    icerik_uretimi = models.TextField(blank=True, null=True, verbose_name='Icerik Uretim Deneyimi')
    takvim_onay    = models.BooleanField(default=False, verbose_name='Program Takvimine Uyum Onayi')

    # -- Durum & Tarih ---------------------------------------------------------
    basvuru_tarihi = models.DateTimeField(auto_now_add=True, verbose_name='Basvuru Tarihi')
    basvuru_durumu = models.CharField(
        max_length=20,
        choices=BasvuruDurumu.choices,
        default=BasvuruDurumu.BEKLIYOR,
        verbose_name='Basvuru Durumu'
    )
    kaynak = models.CharField(max_length=50, default='Google Form', verbose_name='Basvuru Kaynagi')

    class Meta:
        verbose_name        = 'Aday'
        verbose_name_plural = 'Adaylar'
        ordering            = ['-basvuru_tarihi']
        indexes             = [models.Index(fields=['eposta'])]

    def __str__(self):
        return f'{self.ad} {self.soyad} ({self.eposta})'

    @property
    def ad_soyad(self):
        return f'{self.ad} {self.soyad}'

    @property
    def durum_badge(self):
        badges = {
            'BEKLIYOR':   'Bekliyor',
            'ONAYLANDI':  'Onaylandi',
            'REDDEDILDI': 'Reddedildi',
        }
        return badges.get(self.basvuru_durumu, '')


# ─────────────────────────────────────────────────────────────────────────────
# 2. TAKIM
# ─────────────────────────────────────────────────────────────────────────────
class Takim(models.Model):
    """Katılımcı grubu — bir mentorun rehberliğinde çalışır."""

    takim_adi           = models.CharField(max_length=150, unique=True, verbose_name='Takım Adı')
    # v2: düz metin mentor/mentor_eposta → Mentor FK
    mentor              = models.ForeignKey(
        'Mentor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='takimlar',
        verbose_name='Mentor'
    )
    buyuk_gorev_basligi = models.CharField(
        max_length=250,
        blank=True,
        null=True,
        verbose_name='Büyük Görev Proje Başlığı',
        help_text='Takımın Demo Day\'de sunacağı proje başlığı.'
    )
    toplam_puan         = models.PositiveIntegerField(default=0, verbose_name='Toplam Puan')
    olusturulma_tarihi  = models.DateField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')

    class Meta:
        verbose_name        = 'Takım'
        verbose_name_plural = 'Takımlar'
        ordering            = ['-toplam_puan', 'takim_adi']

    def __str__(self):
        mentor_str = self.mentor.ad_soyad if self.mentor else 'Atanmadı'
        return f'{self.takim_adi} (Mentor: {mentor_str})'

    def puan_guncelle(self):
        """Takıma ait tüm teslimlerin puanlarını toplayarak toplam_puan'ı günceller."""
        from django.db.models import Sum
        toplam = Teslim.objects.filter(takim=self).aggregate(Sum('alinan_puan'))['alinan_puan__sum']
        self.toplam_puan = toplam or 0
        self.save(update_fields=['toplam_puan'])


# ─────────────────────────────────────────────────────────────────────────────
# 3. KATILIMCı
# ─────────────────────────────────────────────────────────────────────────────
class Katilimci(models.Model):
    """Programa kabul edilen aday. Aday ile 1-1, Takım ile N-1 ilişkisi var."""

    class ProgramKatilimDurumu(models.TextChoices):
        AKTIF    = 'AKTIF',    'Aktif'
        PASIF    = 'PASIF',    'Pasif (Devamsız)'
        MEZUN    = 'MEZUN',    'Mezun'
        AYRILDI  = 'AYRILDI',  'Ayrıldı'

    # ── İlişkiler ─────────────────────────────────────────────────────────────
    user  = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='katilimci_profili',
        verbose_name='Kullanıcı Hesabı'
    )
    aday  = models.OneToOneField(
        Aday,
        on_delete=models.PROTECT,
        related_name='katilimci',
        verbose_name='Aday'
    )
    takim = models.ForeignKey(
        Takim,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='katilimcilar',
        verbose_name='Takım'
    )

    # ── Durum ─────────────────────────────────────────────────────────────────
    kabul_durumu = models.BooleanField(
        default=False,
        verbose_name='Kabul Edildi mi?'
    )
    kabul_tarihi = models.DateField(
        null=True, blank=True,
        verbose_name='Kabul Tarihi'
    )
    program_katilim_durumu = models.CharField(
        max_length=20,
        choices=ProgramKatilimDurumu.choices,
        default=ProgramKatilimDurumu.AKTIF,
        verbose_name='Program Katılım Durumu'
    )

    # ── Ek Bilgiler ───────────────────────────────────────────────────────────
    notlar = models.TextField(
        blank=True,
        verbose_name='Yönetici Notları',
        help_text='Mentör/yönetici tarafından görülebilir iç notlar.'
    )

    class Meta:
        verbose_name        = 'Katılımcı'
        verbose_name_plural = 'Katılımcılar'
        ordering            = ['aday__ad']

    def __str__(self):
        takim_adi = self.takim.takim_adi if self.takim else 'Takımsız'
        return f'{self.aday.ad_soyad} → {takim_adi}'

    @property
    def ad_soyad(self):
        return self.aday.ad_soyad

    @property
    def eposta(self):
        return self.aday.eposta


# ─────────────────────────────────────────────────────────────────────────────
# 4. GÖREV
# ─────────────────────────────────────────────────────────────────────────────
class Gorev(models.Model):
    """Haftalık görev tanımı — genel, bireysel veya takımsal olarak atanabilir."""

    class GorevTipi(models.TextChoices):
        GENEL    = 'GENEL',    'Genel'
        BIREYSEL = 'BIREYSEL', 'Bireysel'
        TAKIMSAL = 'TAKIMSAL', 'Takımsal'

    hafta              = models.PositiveSmallIntegerField(verbose_name='Hafta No')
    gorev_adi          = models.CharField(max_length=200, verbose_name='Görev Adı')
    brief_aciklama     = models.TextField(verbose_name='Brief Açıklaması')
    gorev_tipi         = models.CharField(
        max_length=10,
        choices=GorevTipi.choices,
        default=GorevTipi.GENEL,
        verbose_name='Görev Tipi'
    )
    hedef_katilimci    = models.ForeignKey(
        'Katilimci',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='hedef_gorevler',
        verbose_name='Hedef Katılımcı',
        help_text='Yalnızca Bireysel görev tipinde doldurulur.'
    )
    hedef_takim        = models.ForeignKey(
        'Takim',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='hedef_gorevler',
        verbose_name='Hedef Takım',
        help_text='Yalnızca Takımsal görev tipinde doldurulur.'
    )
    son_teslim_tarihi  = models.DateTimeField(verbose_name='Son Teslim Tarihi')
    puan_kriterleri    = models.TextField(
        verbose_name='Puan Kriterleri',
        help_text='Her kriter için puan aralığını açıklayın (örn: Yenilikçilik: 0-30 puan).'
    )
    maksimum_puan      = models.PositiveSmallIntegerField(default=100, verbose_name='Maksimum Puan')
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name        = 'Görev'
        verbose_name_plural = 'Görevler'
        ordering            = ['hafta', 'gorev_adi']
        unique_together     = [('hafta', 'gorev_adi')]

    def __str__(self):
        return f'Hafta {self.hafta} — {self.gorev_adi}'


# ─────────────────────────────────────────────────────────────────────────────
# 5. TESLİM
# ─────────────────────────────────────────────────────────────────────────────
class Teslim(models.Model):
    """
    Görev teslimi. Bireysel görevlerde `katilimci` dolu, `takim` boş;
    takım görevlerinde `takim` dolu, `katilimci` boş olabilir.
    Her iki alanı da doldurmak mümkündür.
    """

    class Durum(models.TextChoices):
        BEKLIYOR          = 'BEKLIYOR',          'Değerlendirme Bekliyor'
        REVIZYON_ISTENDI  = 'REVIZYON_ISTENDI',  'Revizyon İstendi'
        REVIZE_EDILDI     = 'REVIZE_EDILDI',     'Revize Edildi'
        TAMAMLANDI        = 'TAMAMLANDI',        'Değerlendirme Tamamlandı'

    durum = models.CharField(
        max_length=20,
        choices=Durum.choices,
        default=Durum.BEKLIYOR,
        verbose_name='Teslim Durumu'
    )

    # ── İlişkiler ─────────────────────────────────────────────────────────────
    gorev      = models.ForeignKey(
        Gorev,
        on_delete=models.CASCADE,
        related_name='teslimler',
        verbose_name='Görev'
    )
    katilimci  = models.ForeignKey(
        Katilimci,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='teslimler',
        verbose_name='Katılımcı'
    )
    takim      = models.ForeignKey(
        Takim,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='teslimler',
        verbose_name='Takım'
    )

    # ── Teslim Detayları ──────────────────────────────────────────────────────
    teslim_linki   = models.URLField(null=True, blank=True, verbose_name='Teslim Linki (GitHub / Drive / vb.)')
    teslim_dosyasi = models.FileField(upload_to='teslimler/', null=True, blank=True, verbose_name='Teslim Dosyası')
    teslim_tarihi  = models.DateTimeField(auto_now_add=True, verbose_name='Teslim Tarihi')
    aciklama       = models.TextField(
        blank=True,
        verbose_name='Katılımcı Açıklaması',
        help_text='Katılımcının teslim hakkındaki notları.'
    )

    # ── Değerlendirme ─────────────────────────────────────────────────────────
    mentor_yorumu    = models.TextField(blank=True, null=True, verbose_name='Mentor Yorumu')
    alinan_puan      = models.PositiveSmallIntegerField(default=0, blank=True, null=True, verbose_name='Alınan Puan')
    degerlendirildi  = models.BooleanField(default=False, verbose_name='Değerlendirildi mi?')
    # v2: revizyon bayrağı
    revizyon_istendi = models.BooleanField(default=False, verbose_name='Revizyon İstendi mi?')

    class Meta:
        verbose_name        = 'Teslim'
        verbose_name_plural = 'Teslimler'
        ordering            = ['-teslim_tarihi']

    def __str__(self):
        sahip = str(self.takim or self.katilimci or 'Anonim')
        return f'{self.gorev} | {sahip}'

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.katilimci and not self.takim:
            raise ValidationError('Teslim bir katılımcıya veya takıma bağlı olmalıdır.')

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Takım puanını otomatik güncelle
        if self.takim:
            self.takim.puan_guncelle()


class TeslimHareketi(models.Model):
    """Teslim tarihçesi / timeline kaydı."""

    class IslemTipi(models.TextChoices):
        ILK_TESLIM          = 'ILK_TESLIM',          'İlk Teslim'
        REVIZYON_ISTENDI    = 'REVIZYON_ISTENDI',    'Revizyon İstendi'
        REVIZE_TESLIM       = 'REVIZE_TESLIM',       'Revize Teslim'
        NIHAI_DEGERLENDIRME = 'NIHAI_DEGERLENDIRME', 'Nihai Değerlendirme'

    teslim             = models.ForeignKey(Teslim, on_delete=models.CASCADE, related_name='hareketler', verbose_name='Teslim')
    islem_tipi         = models.CharField(max_length=25, choices=IslemTipi.choices, verbose_name='İşlem Tipi')
    aciklama           = models.TextField(blank=True, verbose_name='Açıklama')
    teslim_linki       = models.URLField(blank=True, null=True, verbose_name='Teslim Linki')
    teslim_dosyasi     = models.FileField(upload_to='teslimler/hareketler/', null=True, blank=True, verbose_name='Teslim Dosyası')
    puan               = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name='Puan')
    mentor_yorumu      = models.TextField(blank=True, null=True, verbose_name='Mentor Yorumu')
    revizyon_notu      = models.TextField(blank=True, null=True, verbose_name='Revizyon Notu')
    olusturan_user     = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Oluşturan Kullanıcı')
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')

    class Meta:
        verbose_name        = 'Teslim Hareketi'
        verbose_name_plural = 'Teslim Hareketleri'
        ordering            = ['olusturulma_tarihi']

    def __str__(self):
        return f'{self.teslim} - {self.get_islem_tipi_display()}'


# ─────────────────────────────────────────────────────────────────────────────
# 6. İÇERİK DNA TESTİ
# ─────────────────────────────────────────────────────────────────────────────
class IcerikDNATesti(models.Model):
    """Katılımcının içerik DNA testi — cevaplar + AI raporu."""

    class Durum(models.TextChoices):
        TASLAK      = 'TASLAK',      'Taslak'
        GONDERILDI  = 'GONDERILDI',  'Gönderildi'
        ISLENIYOR   = 'ISLENIYOR',   'İşleniyor'
        TAMAMLANDI  = 'TAMAMLANDI',  'Tamamlandı'
        HATA        = 'HATA',        'Hata'

    katilimci        = models.OneToOneField(
        Katilimci,
        on_delete=models.CASCADE,
        related_name='icerik_dna_testi',
        verbose_name='Katılımcı'
    )
    cevaplar         = models.JSONField(default=dict, verbose_name='Cevaplar')
    rapor_json       = models.JSONField(default=dict, blank=True, verbose_name='Rapor JSON')
    rapor_metni      = models.TextField(blank=True, verbose_name='Rapor Metni')
    durum            = models.CharField(
        max_length=15,
        choices=Durum.choices,
        default=Durum.TASLAK,
        verbose_name='Durum'
    )
    hata_mesaji      = models.TextField(blank=True, null=True, verbose_name='Hata Mesajı')
    ai_model         = models.CharField(max_length=100, blank=True, verbose_name='AI Modeli')
    prompt_versiyonu = models.CharField(max_length=20, default='v1', verbose_name='Prompt Versiyonu')
    gonderim_tarihi  = models.DateTimeField(null=True, blank=True, verbose_name='Gönderim Tarihi')
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')
    guncellenme_tarihi = models.DateTimeField(auto_now=True, verbose_name='Güncellenme Tarihi')

    class Meta:
        verbose_name        = 'İçerik DNA Testi'
        verbose_name_plural = 'İçerik DNA Testleri'
        ordering            = ['-olusturulma_tarihi']

    def __str__(self):
        return f'İçerik DNA — {self.katilimci.aday.ad_soyad} ({self.durum})'


# ─────────────────────────────────────────────────────────────────────────────
# 7. KATILIMCı PERFORMANS
# ─────────────────────────────────────────────────────────────────────────────
class KatilimciPerformans(models.Model):
    """Katılımcının bireysel performans puanı — takım puanından bağımsız."""

    katilimci              = models.OneToOneField(
        Katilimci,
        on_delete=models.CASCADE,
        related_name='performans',
        verbose_name='Katılımcı'
    )
    bireysel_puan          = models.PositiveIntegerField(default=0, verbose_name='Bireysel Puan')
    gorev_puani            = models.PositiveIntegerField(default=0, verbose_name='Görev Puanı')
    toplanti_katilim_puani = models.PositiveIntegerField(default=0, verbose_name='Toplantı Katılım Puanı')
    etkilesim_bonus_puani  = models.PositiveIntegerField(default=0, verbose_name='Etkileşim Bonus Puanı')
    manuel_puan            = models.IntegerField(default=0, verbose_name='Manuel Puan')
    admin_ici_not          = models.TextField(blank=True, verbose_name='Admin İçi Not')
    katilimciya_gorunen_not = models.TextField(blank=True, verbose_name='Katılımcıya Görünen Not')
    guncellenme_tarihi     = models.DateTimeField(auto_now=True, verbose_name='Güncellenme Tarihi')
    olusturulma_tarihi     = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')

    class Meta:
        verbose_name        = 'Katılımcı Performans'
        verbose_name_plural = 'Katılımcı Performansları'

    def __str__(self):
        return f'Performans — {self.katilimci.aday.ad_soyad} ({self.bireysel_puan} puan)'

    def hesapla_gorev_puani(self):
        """Değerlendirilen teslimlerden otomatik görev puanı hesaplar (yardımcı metod)."""
        from django.db.models import Sum
        toplam = Teslim.objects.filter(
            katilimci=self.katilimci,
            degerlendirildi=True
        ).aggregate(Sum('alinan_puan'))['alinan_puan__sum']
        return toplam or 0

    def recalculate(self):
        """bireysel_puan = gorev + toplanti + etkilesim + manuel (min 0)."""
        toplam = (
            self.gorev_puani
            + self.toplanti_katilim_puani
            + self.etkilesim_bonus_puani
            + self.manuel_puan
        )
        self.bireysel_puan = max(0, toplam)
        self.save(update_fields=['bireysel_puan', 'guncellenme_tarihi'])


# ─────────────────────────────────────────────────────────────────────────────
# 8. PERFORMANS KRİTERİ
# ─────────────────────────────────────────────────────────────────────────────
class PerformansKriteri(models.Model):
    """Admin tarafından tanımlanan performans değerlendirme kriteri."""

    class Kategori(models.TextChoices):
        GOREV     = 'GOREV',     'Görev'
        KATILIM   = 'KATILIM',   'Katılım'
        ETKILESIM = 'ETKILESIM', 'Etkileşim'
        MANUEL    = 'MANUEL',    'Manuel'

    ad                 = models.CharField(max_length=200, verbose_name='Ad')
    aciklama           = models.TextField(blank=True, verbose_name='Açıklama')
    kategori           = models.CharField(
        max_length=10,
        choices=Kategori.choices,
        default=Kategori.MANUEL,
        verbose_name='Kategori'
    )
    maksimum_puan      = models.PositiveIntegerField(default=100, verbose_name='Maksimum Puan')
    aktif              = models.BooleanField(default=True, verbose_name='Aktif mi?')
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')

    class Meta:
        verbose_name        = 'Performans Kriteri'
        verbose_name_plural = 'Performans Kriterleri'
        ordering            = ['kategori', 'ad']

    def __str__(self):
        return f'[{self.get_kategori_display()}] {self.ad} (maks. {self.maksimum_puan})'


# ─────────────────────────────────────────────────────────────────────────────
# 9. KATILIMCı PERFORMANS NOTU
# ─────────────────────────────────────────────────────────────────────────────
class KatilimciPerformansNotu(models.Model):
    """Admin tarafından bir katılımcıya kriter bazlı eklenen performans notu."""

    katilimci          = models.ForeignKey(
        Katilimci,
        on_delete=models.CASCADE,
        related_name='performans_notlari',
        verbose_name='Katılımcı'
    )
    kriter             = models.ForeignKey(
        PerformansKriteri,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='notlar',
        verbose_name='Kriter'
    )
    puan               = models.IntegerField(default=0, verbose_name='Puan')
    not_metni          = models.TextField(blank=True, verbose_name='Not Metni')
    veren_user         = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='verdigi_performans_notlari',
        verbose_name='Notu Veren Kullanıcı'
    )
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')

    class Meta:
        verbose_name        = 'Katılımcı Performans Notu'
        verbose_name_plural = 'Katılımcı Performans Notları'
        ordering            = ['-olusturulma_tarihi']

    def __str__(self):
        kriter_adi = self.kriter.ad if self.kriter else 'Kritersiz'
        return f'{self.katilimci.aday.ad_soyad} — {kriter_adi}: {self.puan} puan'


# ─────────────────────────────────────────────────────────────────────────────
# 10. TOPLANTI KATILIMı
# ─────────────────────────────────────────────────────────────────────────────
class ToplantiKatilimi(models.Model):
    """Admin tarafından kaydedilen katılımcı toplantı katılımı."""

    katilimci          = models.ForeignKey(
        Katilimci,
        on_delete=models.CASCADE,
        related_name='toplanti_katilimlari',
        verbose_name='Katılımcı'
    )
    baslik             = models.CharField(max_length=250, verbose_name='Toplantı Başlığı')
    tarih              = models.DateField(verbose_name='Toplantı Tarihi')
    katildi_mi         = models.BooleanField(default=False, verbose_name='Katıldı mı?')
    katilim_puani      = models.PositiveIntegerField(default=0, verbose_name='Katılım Puanı')
    not_metni          = models.TextField(blank=True, verbose_name='Not')
    giren_user         = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='girdigi_toplanti_katilimlari',
        verbose_name='Girişi Yapan Kullanıcı'
    )
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')

    class Meta:
        verbose_name        = 'Toplantı Katılımı'
        verbose_name_plural = 'Toplantı Katılımları'
        ordering            = ['-tarih']

    def __str__(self):
        katilim = '✅' if self.katildi_mi else '❌'
        return f'{self.katilimci.aday.ad_soyad} — {self.baslik} ({self.tarih}) {katilim}'


# ─────────────────────────────────────────────────────────────────────────────
# 11. SOSYAL MEDYA PERFORMANSI
# ─────────────────────────────────────────────────────────────────────────────
class SosyalMedyaPerformansi(models.Model):
    """Admin tarafından kaydedilen katılımcının sosyal medya performansı."""

    katilimci          = models.ForeignKey(
        Katilimci,
        on_delete=models.CASCADE,
        related_name='sosyal_medya_performanslari',
        verbose_name='Katılımcı'
    )
    platform           = models.CharField(max_length=100, verbose_name='Platform')
    takipci_sayisi     = models.PositiveIntegerField(default=0, verbose_name='Takipçi Sayısı')
    etkilesim_sayisi   = models.PositiveIntegerField(default=0, verbose_name='Etkileşim Sayısı')
    etkilesim_orani    = models.FloatField(default=0.0, verbose_name='Etkileşim Oranı (%)')
    bonus_puan         = models.PositiveIntegerField(default=0, verbose_name='Bonus Puan')
    not_metni          = models.TextField(blank=True, verbose_name='Not')
    giren_user         = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='girdigi_sosyal_medya_performanslari',
        verbose_name='Girişi Yapan Kullanıcı'
    )
    olusturulma_tarihi = models.DateTimeField(auto_now_add=True, verbose_name='Oluşturulma Tarihi')

    class Meta:
        verbose_name        = 'Sosyal Medya Performansı'
        verbose_name_plural = 'Sosyal Medya Performansları'
        ordering            = ['-olusturulma_tarihi']

    def __str__(self):
        return f'{self.katilimci.aday.ad_soyad} — {self.platform} (+{self.bonus_puan} puan)'

    def save(self, *args, **kwargs):
        # Etkileşim oranını otomatik hesapla
        if self.takipci_sayisi > 0:
            self.etkilesim_orani = round(self.etkilesim_sayisi / self.takipci_sayisi * 100, 2)
        else:
            self.etkilesim_orani = 0.0
        super().save(*args, **kwargs)


# ─────────────────────────────────────────────────────────────────────────────
# SİNYALLER
# ─────────────────────────────────────────────────────────────────────────────
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Aday)
def aday_onaylaninca_katilimci_olustur(sender, instance, created, **kwargs):
    """
    Bir Aday'ın başvuru_durumu 'ONAYLANDI' olarak güncellendiğinde,
    eğer henüz Katilimci kaydı yoksa otomatik olarak oluşturur.
    """
    if instance.basvuru_durumu == Aday.BasvuruDurumu.ONAYLANDI:
        Katilimci.objects.get_or_create(
            aday=instance,
            defaults={
                'kabul_durumu': True,
                'program_katilim_durumu': Katilimci.ProgramKatilimDurumu.AKTIF,
            }
        )


@receiver(post_save, sender=Katilimci)
def katilimci_olusunca_performans_olustur(sender, instance, created, **kwargs):
    """
    Yeni bir Katilimci kaydı oluşturulduğunda otomatik olarak
    KatilimciPerformans kaydı oluşturur.
    """
    if created:
        KatilimciPerformans.objects.get_or_create(katilimci=instance)
