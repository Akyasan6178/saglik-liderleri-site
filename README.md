# Geleceğin Dijital Sağlık Liderleri Platformu

Geleceğin Dijital Sağlık Liderleri programı için geliştirilmiş; aday kabulü, takım/görev takibi, katılımcı performans yönetimi, yapay zeka destekli İçerik DNA analizleri ve Google Drive entegrasyonlu teslim sistemini içeren sunucusuz (serverless) web platformudur.

---

## 🔗 Canlı Ortam Bağlantısı

* **Canlı Web Platformu URL**: [https://gelecegin-saglik-liderleri.omerkarapinar.workers.dev/login](https://gelecegin-saglik-liderleri.omerkarapinar.workers.dev/login)

---

## 🏗️ Aktif Üretim Mimarisi

* **Frontend**: React 19, Vite, Tailwind CSS, React Router (Cloudflare Workers / Pages üzerinde barındırılır)
* **Kimlik Doğrulama**: Supabase Auth (JWT Tabanlı Session Yönetimi)
* **Veritabanı & Güvenlik**: Supabase Postgres + Row Level Security (RLS) Politikaları
* **Sunucusuz API / Fonksiyonlar**: Supabase Edge Functions (Deno / TypeScript)
* **Dosya Depolama**: Google Drive API (Service Account Entegrasyonu)

---

## 👥 Kullanıcı Rolleri

Platform 3 ana rol üzerinden çalışmaktadır:

1. **Admin (`admin`)**: Sistem yöneticisi. Adayları inceler/onaylar, CSV ile toplu import yapar, takımları ve görevleri yönetir, mentor atar, katılımcı performans puanlarını günceller, İçerik DNA analizlerini takip eder.
2. **Mentor (`mentor`)**: Takım mentoru. Kendisine atanan takımları ve katılımcıları görür, katılımcı görev teslimlerini inceler, revizyon ister veya nihai değerlendirme/puanlama yapar.
3. **Katılımcı (`katilimci`)**: Programa kabul edilen aday. Haftalık görevlerini görüntüler, dosya/link teslim eder, mentor geri bildirimlerini takip eder, 20 soruluk İçerik DNA formunu doldurur ve AI analiz raporunu görüntüler.

---

## ✨ Ana Özellikler

* **Aday ve Başvuru Yönetimi**: Adayların listelenmesi, onay/red durumları ve tek tıkla katılımcıya dönüştürülmesi.
* **Toplu CSV İçe Aktarma**: Aday verilerinin CSV dosyasından toplu olarak veritabanına aktarılması.
* **Takım ve Görev Yönetimi**: Takımların oluşturulması, mentor ataması, haftalık görev tanımları ve son teslim tarihi takibi.
* **Google Drive Entegrasyonlu Teslim**: Katılımcıların görev teslimlerinin Google Drive klasör yapısında güvenle depolanması.
* **Mentor Revizyon ve Değerlendirme**: Teslimler için revizyon isteme döngüsü ve nihai puanlama/geri bildirim mekanizması.
* **Yapay Zeka Destekli İçerik DNA Analizi**: 20 soruluk katılımcı DNA formu, Gemini AI ile kişiselleştirilmiş strateji raporu üretimi ve kategorili detay görünümü.
* **Kapsamlı Performans Yönetimi**: Görev teslimleri, toplantı katılımları, sosyal medya etkileşim bonusları ve admin manuel puanlarının otomatik hesaplanması.

---

## 📦 Legacy Backend Notu

* Eski Django REST API backend kodları aktif üretim akışlarında **kullanılmamaktadır**.
* Geçmiş referans ve geri dönüş ihtimallerine karşı `legacy_backend/` klasörü altında pasif arşiv olarak tutulmaktadır.

---

## 🛠️ Geliştirme ve Dağıtım Süreci

Projeye yeni bir özellik eklendiğinde veya hata düzeltildiğinde izlenecek adımlar:

1. Bağımlılıkları kontrol edin ve geliştirmeleri yapın.
2. Üretim derlemesini doğrulayın:
   ```bash
   npm run build
   ```
3. Değişiklik durumunu kontrol edin:
   ```bash
   git status
   ```
4. Yapılan değişiklikleri anlamlı bir commit mesajı ile kaydedin:
   ```bash
   git commit -m "feat/fix: aciklama"
   ```
5. Ana dala gönderin (Cloudflare Otomatik Deploy tetiklenir):
   ```bash
   git push origin main
   ```
6. Canlı deploy bağlantısından değişiklikleri doğrulayın.

---

## 🔐 Güvenlik İlkeleri

* **API Keys & Secrets**: `.env`, service role key, Google private key veya Gemini API key gibi gizli anahtarlar **ASLA** git deposuna commit edilmez.
* **Service Role Restriksiyonu**: `SUPABASE_SERVICE_ROLE_KEY` yalnızca sunucu/Edge Function tarafında kullanılır; istemci (frontend) koduna kesinlikle konulmaz.
* **Google Credentials**: Google Service Account credential bilgileri yalnızca Edge Function secret alanında saklanır.
* **Gizli Dosyalar**: `.env`, `.env.local` ve credential JSON dosyaları `.gitignore` ile koruma altındadır.
