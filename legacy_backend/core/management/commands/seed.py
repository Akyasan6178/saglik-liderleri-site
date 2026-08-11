import random
from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from core.models import Aday, Takim, Katilimci, Gorev, Teslim

class Command(BaseCommand):
    help = 'Veritabanını sahte (seeder) verilerle doldurur.'

    def handle(self, *args, **kwargs):
        fake = Faker('tr_TR')

        self.stdout.write(self.style.WARNING('Mevcut veriler temizleniyor...'))
        Teslim.objects.all().delete()
        Gorev.objects.all().delete()
        Katilimci.objects.all().delete()
        Takim.objects.all().delete()
        Aday.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Veriler temizlendi.'))

        # 1. Takımlar
        takim_adlari = ['Alfa', 'Beta', 'Gama']
        takimlar = []
        for ad in takim_adlari:
            takim = Takim.objects.create(
                takim_adi=ad,
                mentor=fake.name(),
                mentor_eposta=fake.email(),
                buyuk_gorev_basligi=f"{ad} Takımı Dijital Sağlık Projesi"
            )
            takimlar.append(takim)
        self.stdout.write(self.style.SUCCESS(f'3 Takım oluşturuldu: {", ".join(takim_adlari)}'))

        # 2. Adaylar
        adaylar = []
        universiteler = ['Boğaziçi Üniversitesi', 'ODTÜ', 'İTÜ', 'Hacettepe Üniversitesi', 'Koç Üniversitesi', 'Sabancı Üniversitesi']
        bolumler = ['Bilgisayar Mühendisliği', 'Tıp', 'Biyomühendislik', 'Endüstri Mühendisliği', 'Yönetim Bilişim Sistemleri']

        # En az 10 adayın onaylanmış olması garanti olsun diye ilk 10'unu Onaylandı yapalım
        for i in range(15):
            durum = 'ONAYLANDI' if i < 10 else random.choice(['BEKLIYOR', 'ONAYLANDI', 'REDDEDILDI'])
            aday = Aday.objects.create(
                ad_soyad=fake.name(),
                eposta=fake.unique.email(),
                telefon=fake.phone_number()[:20],
                universite=random.choice(universiteler),
                bolum=random.choice(bolumler),
                sehir=fake.city(),
                linkedin=f"https://linkedin.com/in/{fake.user_name()}",
                instagram=f"@{fake.user_name()}",
                motivasyon_cevabi=fake.paragraph(nb_sentences=3),
                basvuru_durumu=durum
            )
            adaylar.append(aday)
        self.stdout.write(self.style.SUCCESS('15 Aday oluşturuldu.'))

        # 3. Katılımcılar
        onayli_adaylar = [a for a in adaylar if a.basvuru_durumu == 'ONAYLANDI']
        katilimcilar = []
        # En fazla 10 onaylı adayı katılımcı yap ve 3 takıma rastgele dağıt
        for aday in onayli_adaylar[:10]:
            katilimci = Katilimci.objects.create(
                aday=aday,
                takim=random.choice(takimlar),
                kabul_durumu=True,
                kabul_tarihi=timezone.now().date(),
                program_katilim_durumu='AKTIF',
                notlar=fake.sentence()
            )
            katilimcilar.append(katilimci)
        self.stdout.write(self.style.SUCCESS(f'{len(katilimcilar)} Katılımcı takımlara dağıtıldı.'))

        # 4. Görevler
        gorevler = []
        gorevler.append(Gorev.objects.create(
            hafta=1,
            gorev_adi='Problem Keşfi ve Müşteri Görüşmeleri',
            brief_aciklama=fake.paragraph(nb_sentences=4),
            gorev_tipi='TAKIM',
            son_teslim_tarihi=timezone.now() + timezone.timedelta(days=7),
            puan_kriterleri="Analiz: 40p, Sunum: 60p",
            maksimum_puan=100
        ))
        gorevler.append(Gorev.objects.create(
            hafta=2,
            gorev_adi='Prototip Geliştirme (MVP)',
            brief_aciklama=fake.paragraph(nb_sentences=4),
            gorev_tipi='TAKIM',
            son_teslim_tarihi=timezone.now() + timezone.timedelta(days=14),
            puan_kriterleri="Teknoloji Kullanımı: 50p, UX: 50p",
            maksimum_puan=100
        ))
        self.stdout.write(self.style.SUCCESS('2 Görev oluşturuldu.'))

        # 5. Teslimler
        for takim in takimlar:
            for gorev in gorevler:
                # Rastgele teslim etme ihtimali %80
                if random.random() > 0.2:
                    Teslim.objects.create(
                        gorev=gorev,
                        takim=takim,
                        teslim_linki=fake.url(),
                        aciklama=fake.sentence(),
                        mentor_yorumu=fake.sentence(),
                        alinan_puan=random.randint(60, 100),
                        degerlendirildi=True
                    )
        self.stdout.write(self.style.SUCCESS('Takım teslimleri ve değerlendirmeleri girildi.'))
        self.stdout.write(self.style.SUCCESS('Seeder işlemi başarıyla tamamlandı! 🚀'))
