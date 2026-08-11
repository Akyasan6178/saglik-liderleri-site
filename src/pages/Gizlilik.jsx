import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Gizlilik() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      
      {/* Header Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">GD</span>
            </div>
            <div>
              <div className="text-slate-800 font-bold text-sm leading-tight">Geleceğin Dijital</div>
              <div className="gradient-text font-semibold text-xs">Sağlık Liderleri</div>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors">
              Ana Sayfa
            </Link>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-white font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-sm"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-slate-800 via-indigo-900 to-purple-900 text-white rounded-3xl p-8 sm:p-12 shadow-soft space-y-4">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/20">
            Hukuki Bilgilendirme
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Gizlilik Politikası</h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            Verilerinizin korunması ve güvenliği bizim için en yüksek önceliktir.
          </p>
        </div>

        {/* Informational Alert Box */}
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-5 text-xs sm:text-sm font-medium leading-relaxed">
          🔒 <strong>Bilgilendirme Notu:</strong> Bu sayfa taslak bilgilendirme amacıyla hazırlanmıştır. Bu sayfa nihai gizlilik metniyle güncellenecektir.
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft space-y-8 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              Toplanan Veriler
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Program başvuruları ve platform kullanımı sırasında ad, soyad, e-posta adresi, iletişim bilgileri, eğitim/meslek bilgileri, içerik DNA form yanıtları ve görev teslim dosyaları toplanmaktadır.
            </p>
            {/* TODO: Buraya nihai gizlilik metni eklenecek. */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 italic">
              📌 <strong>Not:</strong> [Buraya nihai gizlilik metni eklenecek.]
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              Verilerin Kullanım Amacı
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Toplanan kişisel veriler; aday değerlendirmesi, katılımcı doğrulaması, mentorluk süreçlerinin yürütülmesi, yapay zeka destekli içerik DNA raporlarının oluşturulması ve sertifikasyon işlemleri amacıyla işlenmektedir.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              Supabase ve Google Drive Altyapısı Notu
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Kullanıcı kimlik doğrulaması ve veritabanı işlemleri Supabase altyapısı (Postgres + RLS) üzerinde güvenle saklanır. Görev teslim dosyaları ise yetkili Google Drive Service Account entegrasyonu ile korumalı klasör yapısında depolanmaktadır.
            </p>
            {/* TODO: Buraya veri saklama süresi eklenecek. */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 italic">
              📌 <strong>Not:</strong> [Buraya veri saklama süresi eklenecek.]
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              Başvuru ve Katılımcı Verileri Güvenliği
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Kullanıcı verileri üçüncü şahıslarla ticari amaçla kesinlikle paylaşılmaz. Verilere yalnızca yetkili sistem yöneticileri ve ilgili mentörler sınırlı erişim politikaları (RLS) dahilinde ulaşabilir.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              İletişim ve Haklarınız
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Kişisel verilerinizle ilgili bilgi alma, düzeltme veya silme talepleriniz için resmi iletişim kanallarımız üzerinden başvurabilirsiniz.
            </p>
            {/* TODO: Buraya resmi iletişim adresi eklenecek. */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 italic">
              📌 <strong>Not:</strong> [Buraya resmi iletişim adresi eklenecek.]
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
