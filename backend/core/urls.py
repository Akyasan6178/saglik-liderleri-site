from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AdayViewSet, TakimViewSet, KatilimciViewSet,
    GorevViewSet, TeslimViewSet, MentorViewSet,
    CustomTokenObtainPairView, google_form_webhook,
    import_csv, import_sheets_url,
    katilimci_me, mentor_me, mentor_takimlarim, mentor_katilimcilarim,
    teslim_submit, teslim_revizyon_iste, teslim_nihai_degerlendir,
    icerik_dna_me, icerik_dna_submit,
    admin_icerik_dna_list, admin_icerik_dna_detail, admin_icerik_dna_regenerate,
    # Performans
    katilimci_performans_me,
    admin_performans_list, admin_performans_detail,
    admin_performans_not_ekle, admin_toplanti_katilimi_ekle, admin_sosyal_medya_ekle,
)

router = DefaultRouter()
router.register(r'mentorlar',    MentorViewSet)
router.register(r'adaylar',      AdayViewSet)
router.register(r'takimlar',     TakimViewSet)
router.register(r'katilimcilar', KatilimciViewSet)
router.register(r'gorevler',     GorevViewSet)
router.register(r'teslimler',    TeslimViewSet)

urlpatterns = [
    path('teslimler/submit/',                           teslim_submit,                       name='teslim-submit'),
    path('teslimler/<int:pk>/revizyon-iste/',           teslim_revizyon_iste,                name='teslim-revizyon-iste'),
    path('teslimler/<int:pk>/nihai-degerlendir/',       teslim_nihai_degerlendir,            name='teslim-nihai-degerlendir'),
    path('', include(router.urls)),
    path('login/',                                      CustomTokenObtainPairView.as_view(), name='login'),
    path('katilimci/me/',                               katilimci_me,                        name='katilimci-me'),
    path('takimlar/me/',                                katilimci_me,                        name='takimlar-me'),
    # Mentor Endpoints
    path('mentor/me/',                                  mentor_me,                           name='mentor-me'),
    path('mentor/takimlarim/',                          mentor_takimlarim,                   name='mentor-takimlarim'),
    path('mentor/katilimcilarim/',                      mentor_katilimcilarim,               name='mentor-katilimcilarim'),
    path('google-form-webhook/',                        google_form_webhook,                 name='google-form-webhook'),
    path('import-csv/',                                 import_csv,                          name='import-csv'),
    path('import-sheets-url/',                          import_sheets_url,                   name='import-sheets-url'),
    # İçerik DNA Testi — Katılımcı
    path('icerik-dna/me/',                              icerik_dna_me,                       name='icerik-dna-me'),
    path('icerik-dna/submit/',                          icerik_dna_submit,                   name='icerik-dna-submit'),
    # İçerik DNA Testi — Admin
    path('admin/icerik-dna/',                           admin_icerik_dna_list,               name='admin-icerik-dna-list'),
    path('admin/icerik-dna/<int:pk>/',                  admin_icerik_dna_detail,             name='admin-icerik-dna-detail'),
    path('admin/icerik-dna/<int:pk>/regenerate/',       admin_icerik_dna_regenerate,         name='admin-icerik-dna-regenerate'),
    # Performans — Katılımcı
    path('performans/me/',                              katilimci_performans_me,             name='performans-me'),
    # Performans — Admin
    path('admin/performans/',                           admin_performans_list,               name='admin-performans-list'),
    path('admin/performans/<int:katilimci_id>/',        admin_performans_detail,             name='admin-performans-detail'),
    path('admin/performans/<int:katilimci_id>/not-ekle/',         admin_performans_not_ekle,       name='admin-performans-not-ekle'),
    path('admin/performans/<int:katilimci_id>/toplanti-katilimi/', admin_toplanti_katilimi_ekle,    name='admin-performans-toplanti'),
    path('admin/performans/<int:katilimci_id>/sosyal-medya/',      admin_sosyal_medya_ekle,         name='admin-performans-sosyal-medya'),
]
