from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Mentor, Katilimci

def create_user_for_profile(sender, instance, created, **kwargs):
    """
    Mentor veya Katilimci profili oluşturulduğunda,
    ilgili profile bağlı bir User nesnesi oluşturur.
    Kullanıcı adı olarak e-posta kullanılır.
    Varsayılan şifre: Marka2026!
    """
    if created and not instance.user:
        # User oluştur
        user = User.objects.create_user(
            username=instance.eposta,
            email=instance.eposta,
            password='Marka2026!'
        )
        
        # OLUŞTURULAN User nesnesini profile bağla ve kaydet
        instance.user = user
        instance.save(update_fields=['user'])

# Sinyalleri modellere bağla
@receiver(post_save, sender=Mentor)
def create_user_for_mentor(sender, instance, created, **kwargs):
    create_user_for_profile(sender, instance, created, **kwargs)

@receiver(post_save, sender=Katilimci)
def create_user_for_katilimci(sender, instance, created, **kwargs):
    create_user_for_profile(sender, instance, created, **kwargs)

@receiver(post_save, sender='core.Gorev')
def create_empty_teslim_for_gorev(sender, instance, created, **kwargs):
    """
    Yeni bir Görev oluşturulduğunda hedeflere göre otomatik boş (taslak) Teslim kayıtları oluşturur.
    Böylece Mentorlar görevi atanır atanmaz Mentor Panelinde 'Bekliyor' statüsünde görebilir.
    """
    if created:
        from .models import Teslim, Takim, Katilimci
        
        if instance.gorev_tipi == 'TAKIMSAL' and instance.hedef_takim:
            Teslim.objects.get_or_create(gorev=instance, takim=instance.hedef_takim)
            
        elif instance.gorev_tipi == 'BIREYSEL' and instance.hedef_katilimci:
            Teslim.objects.get_or_create(gorev=instance, katilimci=instance.hedef_katilimci)
            
        elif instance.gorev_tipi == 'GENEL':
            # Genel görevlerde tüm aktif takımlara atama yapıyoruz (sistem mantığına göre)
            for takim in Takim.objects.all():
                Teslim.objects.get_or_create(gorev=instance, takim=takim)
