# Geleceğin Dijital Sağlık Liderleri — Operasyon ve El Kitabı (Final)

Bu doküman, Geleceğin Dijital Sağlık Liderleri platformunun üretim mimarisini, güvenlik kurallarını, veri akışlarını, panel fonksiyonlarını, operasyonel süreçlerini ve depolama mimarisini eksiksiz olarak tanımlar.

---

## 1. Proje Durumu Özeti

Geleceğin Dijital Sağlık Liderleri platformu, sunucusuz (serverless) mimariye tamamen aktarılmıştır. Eski Django REST API katmanına olan tüm canlı runtime bağımlılıkları kesilmiş, backend kodları `legacy_backend/` klasöründe pasif arşiv durumuna getirilmiştir. Proje canlı üretim ortamında kesintisiz çalışmaktadır.

---

## 2. Aktif Mimari

Platform aşağıdaki sunucusuz teknolojiler üzerinde çalışır:

```
[İstemci / Tarayıcı]
       │
       ├──► Cloudflare Workers / Pages (React 19 + Vite SPA)
       │
       ├──► Supabase Auth (JWT Session & Rol Yönetimi)
       │
       ├──► Supabase Postgres Database (Row Level Security - RLS)
       │
       ├──► Supabase Edge Functions (Deno / TypeScript - Güvenli Admin/Mentor İşlemleri)
       │
       └──► Google Drive API (Service Account - Dosya Depolama)
```

---

## 3. Canlı Ortam Bilgileri

* **Canlı Web Platformu URL**: `https://gelecegin-saglik-liderleri.omerkarapinar.workers.dev/login`
* **Supabase Proje Referansı**: `wczupupflxvfnjbjkfrj`
* **Supabase API URL**: `https://wczupupflxvfnjbjkfrj.supabase.co`

---

## 4. Roller ve Yetki Mantığı

Sistemde 3 temel kullanıcı rolü tanımlıdır:

| Rol | Kod | Tanım | Giriş Yönlendirmesi |
|---|---|---|---|
| **Admin** | `admin` | Tam yetkili sistem yöneticisi | `/admin` |
| **Mentor** | `mentor` | Takım rehberi / değerlendirici | `/mentor` |
| **Katılımcı** | `katilimci` | Programa kabul edilen aday | `/katilimci` |

Giriş yapıldığında kullanıcının rolü `profiles` tablosundan okunur ve yetkisiz sayfa erişimleri (örneğin Katılımcının `/admin` yoluna gitmesi) otomatik olarak kendi paneline yönlendirilir veya engellenir.

---

## 5. Supabase Auth ve Profiles

* Kullanıcı kimlik doğrulaması Supabase Auth (`auth.users`) üzerinden yürütülür.
* Her `auth.users` kaydı için `public.profiles` tablosunda birebir eşleşen bir profil nesnesi bulunur:
  * `id`: `auth.users.id` ile aynı (UUID)
  * `email`: Kullanıcı e-posta adresi
  * `role`: `admin` | `mentor` | `katilimci`
  * `core_katilimci_id`: Katılımcı ise `core_katilimci` tablosundaki ID ilişki değeri
  * `core_mentor_id`: Mentor ise `core_mentor` tablosundaki ID ilişki değeri

---

## 6. RLS Güvenlik Özeti

Supabase Postgres veritabanındaki tüm tablolarda **Row Level Security (RLS)** etkindir:

* **Katılımcılar**: Yalnızca kendi teslimlerini (`core_teslim`), kendi DNA testlerini (`core_icerikdnatesti`) ve kendi profil bilgilerini okuyabilir.
* **Mentorlar**: Yalnızca kendi takımlarına atanmış katılımcıların verilerini ve teslimlerini okuyabilir.
* **Adminler**: Tüm tablolarda tam okuma/yazma yetkisine sahiptir.
* **Anonim (Giriş Yapmamış)**: Tablolara doğrudan erişimi engellenmiştir; başvuru formu gibi alanlar güvenli fonksiyonlar üzerinden çalışır.

---

## 7. Edge Functions

Hassas ve yetki gerektiren işlemler Supabase Edge Functions (Deno runtime) üzerinde `SUPABASE_SERVICE_ROLE_KEY` ile çalışır:

1. **`admin-actions`**: Aday kabul/red işlemleri, mentor kullanıcısı ve profil oluşturma/silme yetkilerini güvenle yürütür.
2. **`mentor-actions`**: Mentorların katılımcı detaylarını okuması, revizyon istemesi ve nihai değerlendirme/puanlama yapmasını sağlar.
3. **`ai-content-dna`**: Katılımcının 20 soruluk DNA yanıtlarını alır, Google Gemini AI API çağrısı yaparak kişiselleştirilmiş strateji raporu üretir.
4. **`google-drive-action`**: Google Service Account kullanarak dosya yükleme, klasör oluşturma ve dosya erişim linklerini yönetir.

---

## 8. Google Drive Entegrasyonu

* **Service Account**: Yüklemeler dedicated bir Google Service Account üzerinden gerçekleşir.
* **Root Klasör**: Ana proje klasöründe (`GOOGLE_DRIVE_ROOT_FOLDER_ID`) her katılımcı için özel klasör açılır.
* **Klasör Yapısı**: `[Katılımcı Adı]_[Katılımcı ID]` formatında düzenlenir.
* **Dosya Linkleri**: Yüklenen dosyaların indirme/görüntüleme linkleri `core_teslim.teslim_linki` alanına yazılır.
* **Secret Yönetimi**: `GOOGLE_SERVICE_ACCOUNT_JSON` ve `GOOGLE_DRIVE_ROOT_FOLDER_ID` yalnızca Edge Function secret alanında saklanır.

---

## 9. Admin Panel Özeti

Admin Paneli (`/admin`) aşağıdaki sekmelerden oluşur:

* **Adaylar**: Başvuruları listeleme, detay inceleme, kabul/red kararı verme.
* **CSV Import**: Aday verilerini toplu olarak CSV dosyasından içe aktarma.
* **Takımlar**: Takım oluşturma, düzenleme, takım mentoru atama.
* **Görevler**: Haftalık görev tanımlama, brief ekleme ve son teslim tarihi belirleme.
* **Performans**: Katılımcıların görev, toplantı, sosyal medya ve manuel puanlarını izleme ve güncelleme.
* **DNA Analizleri**: Katılımcıların 20 soruluk İçerik DNA form yanıtlarını kategorili kartlar halinde inceleme ve AI raporunu görüntüleme.
* **Mentor Yönetimi**: Sisteme yeni mentor ekleme ve mevcut mentorları yönetme.

---

## 10. Katılımcı Panel Özeti

Katılımcı Paneli (`/katilimci`) aşağıdaki fonksiyonları sunar:

* **Genel Bakış**: Takım bilgisi, genel ilerleme ve özet skorlar.
* **Görevlerim & Teslimler**: Haftalık görev brieflerini inceleme, dosya veya bağlantı (link) yükleme.
* **Revizyon Teslimi**: Mentordan revizyon istendiğinde açıklamayı okuyup güncellenmiş teslimi yükleme.
* **İçerik DNA Testi**: 20 soruluk wizard formunu doldurma, AI raporunu ve kendi cevaplarını sekmeli görünümde inceleme.

---

## 11. Mentor Panel Özeti

Mentor Paneli (`/mentor`) mentorların aşağıdaki işlemleri yapmasını sağlar:

* **Takımım ve Katılımcılarım**: Mentora atanan takımın katılımcı listesini ve detaylarını görme.
* **Teslim İnceleme**: Katılımcıların yüklediği dosya ve bağlantıları inceleme.
* **Revizyon İsteme**: Eksik veya hatalı teslimler için katılımcıya açıklayıcı not yazarak revizyon isteme (`REVIZYON_ISTENDI`).
* **Nihai Değerlendirme**: Teslimi onaylama (`TAMAMLANDI`), puan verme ve geri bildirim yazma.

---

## 12. Veri Akışları

1. **Aday → Katılımcı**: Aday başvurur (`core_aday`) ➔ Admin onaylar ➔ `core_katilimci`, `auth.users` ve `profiles` kayıtları otomatik oluşur.
2. **Görev Teslimi**: Admin görev açar (`core_gorev`) ➔ Katılımcı dosya yükler ➔ Dosya Google Drive'a kaydedilir, `core_teslim` oluşturulur.
3. **Revizyon Döngüsü**: Mentor teslimi inceler ➔ Revizyon ister ➔ Katılımcı güncellenmiş dosyayı yükler ➔ Mentor tekrar inceler.
4. **Nihai Değerlendirme & Puanlama**: Mentor puan ve yorum girer ➔ Teslim durumu `TAMAMLANDI` olur ➔ Görev puanı `core_katilimciperformans` tablosuna yansır.

---

## 13. Puan Mantığı

Bir katılımcının **Bireysel Puanı** 4 bileşenden oluşur:

$$\text{Bireysel Puan} = \text{Görev Puanı} + \text{Toplantı Puanı} + \text{Etkileşim Bonusu} + \text{Manuel Puan}$$

* **Görev Puanı**: Mentorun onayladığı teslimlerden otomatik hesaplanır.
* **Toplantı Puanı**: Katılınan program toplantı kayıtlarından gelir.
* **Etkileşim Bonusu**: Sosyal medya paylaşım ve etkileşim kayıtlarından hesaplanır.
* **Manuel Puan**: Yalnızca Admin tarafından doğrudan girilebilir/düzenlenebilir.

---

## 14. Legacy Backend Durumu

* **Konum**: `legacy_backend/`
* **Neden Tutuluyor?**: Eski Django ORM modelleri, SQL yapıları ve veri dönüşüm kodları için geriye dönük referans ve arşiv amacıyla tutulmaktadır.
* **Ne Zaman Silinebilir?**: Tüm canlı kullanıcı ve kabul testleri (QA-05) tamamlandıktan sonra kullanıcı onayıyla `CUT-01C` görevi kapsamında tamamen silinebilir.

---

## 15. Deploy Süreci

1. Geliştirme sonrasında üretim derlemesi kontrol edilir:
   ```bash
   npm run build
   ```
2. Değişiklikler GitHub ana dalına gönderilir:
   ```bash
   git add .
   git commit -m "feat/fix: aciklama"
   git push origin main
   ```
3. Cloudflare Pages / Workers entegrasyonu push ile birlikte canlı ortamı otomatik derler ve yayınlar.

---

## 16. Test Kullanıcıları

Test ve operasyon doğrulamasında kullanılan hesaplar:

| Rol | E-posta Adresi | Şifre Yönetimi |
|---|---|---|
| **Admin** | `omer@markamutfagi.co` | Supabase Auth üzerinden yönetilir / resetlenir |
| **Mentor** | `mentor-test@gdsl.com` | Supabase Auth üzerinden yönetilir / resetlenir |
| **Katılımcı** | `katilimci-test@gdsl.com` | Supabase Auth üzerinden yönetilir / resetlenir |

*Güvenlik kuralı gereği gerçek şifreler dokümanlara veya koda kesinlikle yazılmaz.*

---

## 17. Final Manuel Test Checklist

Canlı yayın sonrasında aşağıdaki adımlar elle kontrol edilmelidir:

- [ ] Admin Login & Panel Okuma (`/admin`)
- [ ] Admin Aday Kabul / Red & CSV Import
- [ ] Katılımcı Login & Panel Okuma (`/katilimci`)
- [ ] Katılımcı Görev Teslimi & Drive Dosya Yükleme
- [ ] Katılımcı 20 Soruluk DNA Formu Submit & AI Rapor Görünümü
- [ ] Mentor Login & Panel Okuma (`/mentor`)
- [ ] Mentor Revizyon İsteme & Nihai Değerlendirme/Puanlama
- [ ] Yetkisiz Yönlendirme Kontrolü (Katılımcı ➔ Admin engeli)

---

## 18. Bilinen Riskler ve Dikkat Edilecekler

1. **CORS Yapılandırması**: Supabase Dashboard → API Settings altında Cloudflare Workers domaininin izinli listede olduğundan emin olunmalıdır.
2. **Google Drive Service Account Quota**: Yüksek boyutlu dosya yüklemelerinde Google Drive API kota sınırlarına dikkat edilmelidir.
3. **Browser Cache**: Büyük güncellemeler sonrası tarayıcı önbelleği (cache) temizliği veya Hard Refresh tavsiye edilir.

---

## 19. GitHub Transfer ve Yeni Repo Aktarım Notları

Projeyi başka bir ortama veya depoya aktarırken dikkat edilecek adımlar:

1. **Secret Kontrolü**: Depoda `.env` veya credential JSON dosyası bulunmadığından emin olun.
2. **Cloudflare Bağlantısı**: Yeni GitHub reposunu Cloudflare Pages/Workers projesine bağlayın.
3. **Supabase Edge Function Secrets**: Gerekli ortam değişkenlerini Supabase CLI ile tanımlayın:
   ```bash
   npx supabase secrets set GOOGLE_SERVICE_ACCOUNT_JSON="..." --project-ref wczupupflxvfnjbjkfrj
   ```
4. **Dağıtım Doğrulaması**: İlk push sonrası canlı URL üzerinden giriş testlerini yapın.

---

## 20. Yasaklı İşlemler

* ⛔ `auth.users.encrypted_password` alanına doğrudan SQL `UPDATE` yapmak yasaktır.
* ⛔ `SUPABASE_SERVICE_ROLE_KEY` veya Google Credentials bilgilerini istemci (frontend) koduna koymak yasaktır.
* ⛔ API key, secret veya şifreleri git deposuna commit etmek yasaktır.
* ⛔ `.env` veya `.env.local` dosyalarını git deposuna eklemek yasaktır.
