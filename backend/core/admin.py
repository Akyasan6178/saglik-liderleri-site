"""
Admin konfigürasyonu — Geleceğin Dijital Sağlık Liderleri
==========================================================
Her model için arama, filtreleme ve liste görünümleri yapılandırılmıştır.
"""

from django.contrib import admin
from django.utils.html import format_html
from .models import (
    Aday, Takim, Katilimci, Gorev, Teslim, Mentor, IcerikDNATesti, TeslimHareketi,
    KatilimciPerformans, PerformansKriteri, KatilimciPerformansNotu,
    ToplantiKatilimi, SosyalMedyaPerformansi,
)


# ─────────────────────────────────────────────────────────────────────────────
# 0-A. MENTOR ADMIN
# ─────────────────────────────────────────────────────────────────────────────
@admin.register(Mentor)
class MentorAdmin(admin.ModelAdmin):
    list_display  = ('ad_soyad', 'eposta', 'uzmanlik')
    search_fields = ('ad_soyad', 'eposta', 'uzmanlik')
    ordering      = ('ad_soyad',)



# ─────────────────────────────────────────────────────────────────────────────
# Admin site başlık özelleştirme
# ─────────────────────────────────────────────────────────────────────────────
admin.site.site_header  = '🏥 Geleceğin Dijital Sağlık Liderleri'
admin.site.site_title   = 'GDSL Yönetim Paneli'
admin.site.index_title  = 'Program Yönetim Merkezi'


# ─────────────────────────────────────────────────────────────────────────────
# 1. ADAY ADMIN
# ─────────────────────────────────────────────────────────────────────────────
@admin.register(Aday)
class AdayAdmin(admin.ModelAdmin):
    list_display = (
        'ad_soyad', 'eposta', 'telefon',
        'universite', 'sinif', 'kaynak',
        'basvuru_tarihi', 'durum_renk',
    )
    list_filter  = ('basvuru_durumu', 'sinif', 'universite')
    search_fields = ('ad', 'soyad', 'eposta', 'universite')
    ordering     = ('-basvuru_tarihi',)
    readonly_fields = ('basvuru_tarihi', 'kaynak')
    date_hierarchy = 'basvuru_tarihi'

    fieldsets = (
        ('👤 Kisisel Bilgiler', {
            'fields': ('ad', 'soyad', 'eposta', 'telefon'),
        }),
        ('🎓 Akademik Bilgiler', {
            'fields': ('universite', 'sinif'),
        }),
        ('🌐 Sosyal Medya & Icerik', {
            'fields': ('sosyal_medya', 'icerik_uretimi', 'takvim_onay'),
        }),
        ('📋 Basvuru Durumu', {
            'fields': ('basvuru_durumu', 'kaynak', 'basvuru_tarihi'),
        }),
    )

    actions = ['onayla', 'reddet', 'bekliyora_al']

    @admin.display(description='Durum', ordering='basvuru_durumu')
    def durum_renk(self, obj):
        renkler = {
            'BEKLIYOR':   ('#f59e0b', '⏳ Bekliyor'),
            'ONAYLANDI':  ('#10b981', '✅ Onaylandı'),
            'REDDEDILDI': ('#ef4444', '❌ Reddedildi'),
        }
        renk, etiket = renkler.get(obj.basvuru_durumu, ('#6b7280', '?'))
        return format_html(
            '<span style="color:{}; font-weight:bold;">{}</span>', renk, etiket
        )

    @admin.action(description='Seçili adayları ONAYLA')
    def onayla(self, request, queryset):
        guncellenen = queryset.update(basvuru_durumu='ONAYLANDI')
        self.message_user(request, f'{guncellenen} aday onaylandı.')

    @admin.action(description='Seçili adayları REDDET')
    def reddet(self, request, queryset):
        guncellenen = queryset.update(basvuru_durumu='REDDEDILDI')
        self.message_user(request, f'{guncellenen} aday reddedildi.')

    @admin.action(description='Seçili adayları BEKLİYOR durumuna al')
    def bekliyora_al(self, request, queryset):
        guncellenen = queryset.update(basvuru_durumu='BEKLIYOR')
        self.message_user(request, f'{guncellenen} aday bekliyora alındı.')


# ─────────────────────────────────────────────────────────────────────────────
# 2. TAKIM ADMIN
# ─────────────────────────────────────────────────────────────────────────────
class KatilimciInline(admin.TabularInline):
    """Takım detay sayfasında katılımcıları göster."""
    model        = Katilimci
    extra        = 0
    readonly_fields = ('ad_soyad', 'eposta', 'program_katilim_durumu')
    fields       = ('ad_soyad', 'eposta', 'program_katilim_durumu')
    can_delete   = False
    show_change_link = True

    @admin.display(description='Ad Soyad')
    def ad_soyad(self, obj):
        return obj.aday.ad_soyad

    @admin.display(description='E-posta')
    def eposta(self, obj):
        return obj.aday.eposta


@admin.register(Takim)
class TakimAdmin(admin.ModelAdmin):
    list_display  = ('takim_adi', 'mentor', 'buyuk_gorev_basligi', 'uye_sayisi', 'toplam_puan', 'olusturulma_tarihi')
    list_filter   = ()
    search_fields = ('takim_adi', 'mentor', 'buyuk_gorev_basligi')
    ordering      = ('-toplam_puan',)
    readonly_fields = ('toplam_puan', 'olusturulma_tarihi')
    inlines       = [KatilimciInline]

    fieldsets = (
        ('🏷️ Takım Bilgileri', {
            'fields': ('takim_adi',),
        }),
        ('👨‍🏫 Mentor', {
            'fields': ('mentor',),
        }),
        ('🚀 Proje', {
            'fields': ('buyuk_gorev_basligi',),
        }),
        ('📊 Puan', {
            'fields': ('toplam_puan', 'olusturulma_tarihi'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Üye Sayısı')
    def uye_sayisi(self, obj):
        sayi = obj.katilimcilar.count()
        return format_html('<strong>{}</strong> üye', sayi)


# ─────────────────────────────────────────────────────────────────────────────
# 3. KATILIMCı ADMIN
# ─────────────────────────────────────────────────────────────────────────────
class TeslimInline(admin.TabularInline):
    """Katılımcı detay sayfasında teslimlerini göster."""
    model       = Teslim
    extra       = 0
    fields      = ('gorev', 'teslim_linki', 'teslim_tarihi', 'alinan_puan', 'degerlendirildi')
    readonly_fields = ('teslim_tarihi',)
    can_delete  = False
    show_change_link = True


@admin.register(Katilimci)
class KatilimciAdmin(admin.ModelAdmin):
    list_display  = ('ad_soyad_display', 'eposta_display', 'takim', 'kabul_durumu', 'program_katilim_durumu', 'kabul_tarihi')
    list_filter   = ('kabul_durumu', 'program_katilim_durumu', 'takim')
    search_fields = ('aday__ad_soyad', 'aday__eposta', 'takim__takim_adi')
    ordering      = ('aday__ad_soyad',)
    autocomplete_fields = ['aday', 'takim']
    inlines       = [TeslimInline]

    fieldsets = (
        ('👤 Aday', {
            'fields': ('aday',),
        }),
        ('🏅 Kabul & Takım', {
            'fields': ('kabul_durumu', 'kabul_tarihi', 'takim'),
        }),
        ('📈 Program Durumu', {
            'fields': ('program_katilim_durumu', 'notlar'),
        }),
    )

    @admin.display(description='Ad Soyad', ordering='aday__ad_soyad')
    def ad_soyad_display(self, obj):
        return obj.aday.ad_soyad

    @admin.display(description='E-posta', ordering='aday__eposta')
    def eposta_display(self, obj):
        return obj.aday.eposta


# ─────────────────────────────────────────────────────────────────────────────
# 4. GÖREV ADMIN
# ─────────────────────────────────────────────────────────────────────────────
class TeslimGorevInline(admin.TabularInline):
    model       = Teslim
    extra       = 0
    fields      = ('takim', 'katilimci', 'teslim_linki', 'alinan_puan', 'degerlendirildi')
    readonly_fields = ('teslim_tarihi',)
    show_change_link = True


@admin.register(Gorev)
class GorevAdmin(admin.ModelAdmin):
    list_display  = ('hafta', 'gorev_adi', 'gorev_tipi', 'son_teslim_tarihi', 'maksimum_puan', 'teslim_sayisi')
    list_filter   = ('gorev_tipi', 'hafta')
    search_fields = ('gorev_adi', 'brief_aciklama')
    ordering      = ('hafta', 'gorev_adi')
    inlines       = [TeslimGorevInline]

    fieldsets = (
        ('📋 Görev Tanımı', {
            'fields': ('hafta', 'gorev_adi', 'gorev_tipi', 'brief_aciklama'),
        }),
        ('🕐 Zaman & Puan', {
            'fields': ('son_teslim_tarihi', 'maksimum_puan', 'puan_kriterleri'),
        }),
    )

    @admin.display(description='Teslim Sayısı')
    def teslim_sayisi(self, obj):
        sayi = obj.teslimler.count()
        return format_html(
            '<span style="color: {};">{} teslim</span>',
            '#10b981' if sayi > 0 else '#9ca3af',
            sayi
        )


# ─────────────────────────────────────────────────────────────────────────────
# 5. TESLİM ADMIN
# ─────────────────────────────────────────────────────────────────────────────
class TeslimHareketiInline(admin.TabularInline):
    """Teslim detay sayfasında hareket geçmişini göster."""
    model           = TeslimHareketi
    extra           = 0
    fields          = ('islem_tipi', 'teslim_linki', 'puan', 'mentor_yorumu', 'revizyon_notu', 'olusturulma_tarihi')
    readonly_fields = ('olusturulma_tarihi',)
    can_delete      = False
    show_change_link = True


@admin.register(Teslim)
class TeslimAdmin(admin.ModelAdmin):
    list_display  = ('gorev', 'sahip_display', 'teslim_tarihi', 'alinan_puan', 'degerlendirildi_display')
    list_filter   = ('degerlendirildi', 'gorev__hafta', 'takim')
    search_fields = ('gorev__gorev_adi', 'takim__takim_adi', 'katilimci__aday__ad_soyad')
    ordering      = ('-teslim_tarihi',)
    readonly_fields = ('teslim_tarihi',)
    autocomplete_fields = ['gorev', 'katilimci', 'takim']
    inlines       = [TeslimHareketiInline]

    fieldsets = (
        ('📎 Bağlantılar', {
            'fields': ('gorev', 'takim', 'katilimci'),
        }),
        ('🔗 Teslim', {
            'fields': ('teslim_linki', 'teslim_tarihi', 'aciklama'),
        }),
        ('⭐ Değerlendirme', {
            'fields': ('degerlendirildi', 'alinan_puan', 'mentor_yorumu'),
        }),
    )

    actions = ['degerlendirildi_isaretle']

    @admin.display(description='Teslim Eden')
    def sahip_display(self, obj):
        if obj.takim:
            return format_html('🏷️ <strong>{}</strong>', obj.takim.takim_adi)
        if obj.katilimci:
            return format_html('👤 {}', obj.katilimci.aday.ad_soyad)
        return '—'

    @admin.display(description='Değerlendirildi?', boolean=True)
    def degerlendirildi_display(self, obj):
        return obj.degerlendirildi

    @admin.action(description='Seçili teslimleri değerlendirildi olarak işaretle')
    def degerlendirildi_isaretle(self, request, queryset):
        guncellenen = queryset.update(degerlendirildi=True)
        self.message_user(request, f'{guncellenen} teslim değerlendirildi olarak işaretlendi.')


# ─────────────────────────────────────────────────────────────────────────────
# 6. TESLİM HAREKETİ ADMIN
# ─────────────────────────────────────────────────────────────────────────────

@admin.register(TeslimHareketi)
class TeslimHareketiAdmin(admin.ModelAdmin):
    list_display    = ('teslim', 'islem_tipi_display', 'puan', 'olusturan_user', 'olusturulma_tarihi')
    list_filter     = ('islem_tipi',)
    search_fields   = ('teslim__gorev__gorev_adi', 'teslim__katilimci__aday__ad_soyad', 'aciklama')
    ordering        = ('-olusturulma_tarihi',)
    readonly_fields = ('olusturulma_tarihi',)

    fieldsets = (
        ('🔗 Teslim Bağlantısı', {
            'fields': ('teslim', 'islem_tipi'),
        }),
        ('📎 İçerik', {
            'fields': ('teslim_linki', 'teslim_dosyasi', 'aciklama'),
        }),
        ('⭐ Değerlendirme', {
            'fields': ('puan', 'mentor_yorumu', 'revizyon_notu'),
        }),
        ('🔧 Meta', {
            'fields': ('olusturan_user', 'olusturulma_tarihi'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='İşlem Tipi', ordering='islem_tipi')
    def islem_tipi_display(self, obj):
        renkler = {
            'ILK_TESLIM':          ('#3b82f6', '📥 İlk Teslim'),
            'REVIZYON_ISTENDI':    ('#f59e0b', '🔄 Revizyon İstendi'),
            'REVIZE_TESLIM':       ('#8b5cf6', '📤 Revize Teslim'),
            'NIHAI_DEGERLENDIRME': ('#10b981', '✅ Nihai Değerlendirme'),
        }
        renk, etiket = renkler.get(obj.islem_tipi, ('#6b7280', obj.islem_tipi))
        return format_html('<span style="color:{}; font-weight:bold;">{}</span>', renk, etiket)


# ─────────────────────────────────────────────────────────────────────────────
# 7. İÇERİK DNA TESTİ ADMIN
# ─────────────────────────────────────────────────────────────────────────────
@admin.register(IcerikDNATesti)
class IcerikDNATestiAdmin(admin.ModelAdmin):
    list_display    = ('katilimci_adi', 'durum_display', 'ai_model', 'prompt_versiyonu', 'gonderim_tarihi', 'olusturulma_tarihi')
    list_filter     = ('durum', 'ai_model')
    search_fields   = ('katilimci__aday__ad_soyad', 'katilimci__aday__eposta', 'ai_model')
    ordering        = ('-olusturulma_tarihi',)
    readonly_fields = ('olusturulma_tarihi', 'guncellenme_tarihi', 'gonderim_tarihi', 'katilimci')
    date_hierarchy  = 'olusturulma_tarihi'

    fieldsets = (
        ('👤 Katılımcı', {
            'fields': ('katilimci',),
        }),
        ('📊 Durum & AI', {
            'fields': ('durum', 'ai_model', 'prompt_versiyonu'),
        }),
        ('📄 İçerik', {
            'fields': ('rapor_metni',),
        }),
        ('🛠️ Teknik', {
            'fields': ('cevaplar', 'rapor_json', 'hata_mesaji'),
            'classes': ('collapse',),
        }),
        ('📅 Tarihler', {
            'fields': ('gonderim_tarihi', 'olusturulma_tarihi', 'guncellenme_tarihi'),
            'classes': ('collapse',),
        }),
    )

    actions = ['rapoyu_sifirla', 'durumu_taslak_yap']

    @admin.display(description='Katılımcı', ordering='katilimci__aday__ad_soyad')
    def katilimci_adi(self, obj):
        return obj.katilimci.aday.ad_soyad

    @admin.display(description='Durum', ordering='durum')
    def durum_display(self, obj):
        renkler = {
            'TASLAK':     ('#6b7280', '📝 Taslak'),
            'GONDERILDI': ('#3b82f6', '📨 Gönderildi'),
            'ISLENIYOR':  ('#f59e0b', '⚙️ İşleniyor'),
            'TAMAMLANDI': ('#10b981', '✅ Tamamlandı'),
            'HATA':       ('#ef4444', '❌ Hata'),
        }
        renk, etiket = renkler.get(obj.durum, ('#6b7280', obj.durum))
        return format_html('<span style="color:{}; font-weight:bold;">{}</span>', renk, etiket)

    @admin.action(description='Seçili testlerin raporunu sıfırla (Taslak durumuna al)')
    def rapoyu_sifirla(self, request, queryset):
        guncellenen = queryset.update(durum='TASLAK', rapor_metni='', rapor_json={}, hata_mesaji=None)
        self.message_user(request, f'{guncellenen} testin raporu sıfırlandı.')

    @admin.action(description='Seçili testleri TASLAK durumuna al')
    def durumu_taslak_yap(self, request, queryset):
        guncellenen = queryset.update(durum='TASLAK')
        self.message_user(request, f'{guncellenen} test TASLAK durumuna alındı.')


# ─────────────────────────────────────────────────────────────────────────────
# 8. KATILIMCI PERFORMANS ADMIN
# ─────────────────────────────────────────────────────────────────────────────
@admin.register(KatilimciPerformans)
class KatilimciPerformansAdmin(admin.ModelAdmin):
    list_display  = ('katilimci_adi', 'bireysel_puan', 'gorev_puani',
                     'toplanti_katilim_puani', 'etkilesim_bonus_puani',
                     'manuel_puan', 'guncellenme_tarihi')
    search_fields = ('katilimci__aday__ad', 'katilimci__aday__soyad', 'katilimci__aday__eposta')
    list_filter   = ('katilimci__takim',)
    ordering      = ('-bireysel_puan',)
    readonly_fields = ('bireysel_puan', 'olusturulma_tarihi', 'guncellenme_tarihi')

    fieldsets = (
        ('👤 Katılımcı', {
            'fields': ('katilimci',),
        }),
        ('📊 Puanlar', {
            'fields': ('bireysel_puan', 'gorev_puani', 'toplanti_katilim_puani',
                       'etkilesim_bonus_puani', 'manuel_puan'),
        }),
        ('📝 Notlar', {
            'fields': ('admin_ici_not', 'katilimciya_gorunen_not'),
        }),
        ('📅 Tarihler', {
            'fields': ('olusturulma_tarihi', 'guncellenme_tarihi'),
            'classes': ('collapse',),
        }),
    )

    @admin.display(description='Katılımcı', ordering='katilimci__aday__ad')
    def katilimci_adi(self, obj):
        return obj.katilimci.aday.ad_soyad

    actions = ['puanlari_yeniden_hesapla']

    @admin.action(description='Seçili katılımcıların bireysel puanını yeniden hesapla')
    def puanlari_yeniden_hesapla(self, request, queryset):
        for perf in queryset:
            perf.recalculate()
        self.message_user(request, f'{queryset.count()} katılımcının puanı yeniden hesaplandı.')


# ─────────────────────────────────────────────────────────────────────────────
# 9. PERFORMANS KRİTERİ ADMIN
# ─────────────────────────────────────────────────────────────────────────────
@admin.register(PerformansKriteri)
class PerformansKriteriAdmin(admin.ModelAdmin):
    list_display  = ('ad', 'kategori', 'maksimum_puan', 'aktif', 'olusturulma_tarihi')
    list_filter   = ('kategori', 'aktif')
    search_fields = ('ad', 'aciklama')
    ordering      = ('kategori', 'ad')


# ─────────────────────────────────────────────────────────────────────────────
# 10. KATILIMCı PERFORMANS NOTU ADMIN
# ─────────────────────────────────────────────────────────────────────────────
@admin.register(KatilimciPerformansNotu)
class KatilimciPerformansNotuAdmin(admin.ModelAdmin):
    list_display  = ('katilimci_adi', 'kriter', 'puan', 'veren_user', 'olusturulma_tarihi')
    list_filter   = ('kriter__kategori',)
    search_fields = ('katilimci__aday__ad', 'katilimci__aday__soyad', 'not_metni')
    ordering      = ('-olusturulma_tarihi',)
    readonly_fields = ('olusturulma_tarihi',)
    autocomplete_fields = ['katilimci']

    @admin.display(description='Katılımcı', ordering='katilimci__aday__ad')
    def katilimci_adi(self, obj):
        return obj.katilimci.aday.ad_soyad


# ─────────────────────────────────────────────────────────────────────────────
# 11. TOPLANTI KATILIMı ADMIN
# ─────────────────────────────────────────────────────────────────────────────
@admin.register(ToplantiKatilimi)
class ToplantiKatimiAdmin(admin.ModelAdmin):
    list_display  = ('katilimci_adi', 'baslik', 'tarih', 'katildi_mi_display',
                     'katilim_puani', 'giren_user', 'olusturulma_tarihi')
    list_filter   = ('katildi_mi', 'tarih')
    search_fields = ('katilimci__aday__ad', 'katilimci__aday__soyad', 'baslik')
    ordering      = ('-tarih',)
    readonly_fields = ('olusturulma_tarihi',)
    autocomplete_fields = ['katilimci']
    date_hierarchy = 'tarih'

    @admin.display(description='Katılımcı', ordering='katilimci__aday__ad')
    def katilimci_adi(self, obj):
        return obj.katilimci.aday.ad_soyad

    @admin.display(description='Katıldı mı?', boolean=True)
    def katildi_mi_display(self, obj):
        return obj.katildi_mi


# ─────────────────────────────────────────────────────────────────────────────
# 12. SOSYAL MEDYA PERFORMANSI ADMIN
# ─────────────────────────────────────────────────────────────────────────────
@admin.register(SosyalMedyaPerformansi)
class SosyalMedyaPerformansiAdmin(admin.ModelAdmin):
    list_display  = ('katilimci_adi', 'platform', 'takipci_sayisi',
                     'etkilesim_sayisi', 'etkilesim_orani', 'bonus_puan',
                     'giren_user', 'olusturulma_tarihi')
    list_filter   = ('platform',)
    search_fields = ('katilimci__aday__ad', 'katilimci__aday__soyad', 'platform')
    ordering      = ('-olusturulma_tarihi',)
    readonly_fields = ('etkilesim_orani', 'olusturulma_tarihi')
    autocomplete_fields = ['katilimci']

    @admin.display(description='Katılımcı', ordering='katilimci__aday__ad')
    def katilimci_adi(self, obj):
        return obj.katilimci.aday.ad_soyad
