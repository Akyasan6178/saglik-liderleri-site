import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

/* ─── Inline SVG icons ─── */
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
)

const IconDatabase = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M21 6.375c0 2.692-4.03 4.875-9 4.875S3 9.067 3 6.375 7.03 1.5 12 1.5s9 2.183 9 4.875z" />
    <path d="M12 12.75c2.685 0 5.19-.586 7.078-1.609a8.283 8.283 0 001.897-1.384c.016.121.025.244.025.368C21 12.817 16.97 15 12 15s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.285 8.285 0 001.897 1.384C6.809 12.164 9.315 12.75 12 12.75z" />
    <path d="M12 16.5c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 15.914 9.315 16.5 12 16.5z" />
    <path d="M12 20.25c2.685 0 5.19-.586 7.078-1.609a8.282 8.282 0 001.897-1.384c.016.121.025.244.025.368 0 2.692-4.03 4.875-9 4.875s-9-2.183-9-4.875c0-.124.009-.247.025-.368a8.284 8.284 0 001.897 1.384C6.809 19.664 9.315 20.25 12 20.25z" />
  </svg>
)

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
  </svg>
)

const IconUsers = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
  </svg>
)

const IconCloud = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.23-10.004 6.072 6.072 0 01-.02-.496z" clipRule="evenodd" />
  </svg>
)

const IconKey = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z" clipRule="evenodd" />
  </svg>
)

/* ─── Section card data ─── */
const SECTIONS = [
  {
    id: 'toplanan-veriler',
    icon: <IconDatabase />,
    title: '1. Hangi Veriler İşlenir?',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    border: 'border-blue-100',
    items: [
      'Ad, soyad ve e-posta adresi',
      'Başvuru bilgileri ve iletişim bilgileri',
      'Eğitim alanı ve üniversite bilgileri',
      'Görev teslimleri (Google Drive)',
      'İçerik DNA formu cevapları',
      'Program performans kayıtları ve mentor geri bildirimleri',
    ],
  },
  {
    id: 'kullanim-amaci',
    icon: <IconShield />,
    title: '2. Veriler Ne İçin Kullanılır?',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    border: 'border-emerald-100',
    items: [
      'Başvuru değerlendirme ve aday seçimi',
      'Katılımcı yönetimi ve program koordinasyonu',
      'Mentor geri bildirimi ve revizyon süreçleri',
      'Görev teslim ve değerlendirme takibi',
      'Program performans istatistikleri',
      'İçerik DNA analizi (yapay zeka destekli)',
    ],
  },
  {
    id: 'altyapi',
    icon: <IconCloud />,
    title: '3. Hangi Altyapılar Kullanılır?',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    border: 'border-violet-100',
    items: [
      'Supabase Auth — kimlik doğrulama',
      'Supabase Postgres + RLS — veritabanı ve erişim politikaları',
      'Supabase Edge Functions — güvenli sunucu mantığı',
      'Google Drive (Service Account) — dosya depolama',
      'Cloudflare Pages/Workers — frontend yayını',
    ],
  },
  {
    id: 'dosya-teslim',
    icon: <IconKey />,
    title: '4. Dosya ve Teslim Verileri',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    border: 'border-orange-100',
    items: [
      'Katılımcı teslim dosyaları Google Drive klasör yapısında tutulur',
      'Dosya bağlantıları yalnızca yetkili kullanıcı akışlarında gösterilir',
      'Mentor yalnızca kendi takımına ait dosyalara erişebilir',
      'Admin erişimi audit loglarıyla izlenir',
    ],
  },
  {
    id: 'erisim-yetki',
    icon: <IconUsers />,
    title: '5. Erişim ve Yetki Yapısı',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-500',
    border: 'border-pink-100',
    items: [
      'Admin — tüm katılımcı ve program verilerine erişim',
      'Mentor — yalnızca kendi takımındaki katılımcılar',
      'Katılımcı — yalnızca kendi profil ve teslim verileri',
      'Veriler üçüncü şahıslarla ticari amaçla kesinlikle paylaşılmaz',
    ],
  },
  {
    id: 'guncelleme',
    icon: <IconLock />,
    title: '6. Güncelleme Notu',
    iconBg: 'bg-slate-100',
    iconColor: 'text-slate-500',
    border: 'border-slate-200',
    items: [
      'Bu sayfa bilgilendirme amacıyla hazırlanmıştır',
      'Nihai hukuki metin gerektiğinde güncellenecektir',
      'Resmi iletişim adresi daha sonra eklenecektir',
      'KVKK uyumluluğu için hukuki danışmanlık sürmektedir',
    ],
  },
]

export default function Gizlilik() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">

      {/* ─── Navbar ─── */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md group-hover:shadow-orange-300/50 transition-shadow duration-300">
              <span className="text-white font-black text-sm">GD</span>
            </div>
            <div>
              <div className="text-slate-800 font-bold text-sm leading-tight">Geleceğin Dijital</div>
              <div
                className="font-semibold text-xs"
                style={{
                  background: 'linear-gradient(135deg,#f97316,#ec4899,#7c3aed)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Sağlık Liderleri
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors duration-200">
              Ana Sayfa
            </Link>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-white font-semibold px-5 py-2 rounded-xl text-xs sm:text-sm shadow-sm"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ─── Hero Banner ─── */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950" />
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="absolute -top-24 right-1/4 w-72 h-72 rounded-full bg-violet-500/10 blur-[70px]" />
          <div className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full bg-orange-500/8 blur-[60px]" />

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest mb-8">
              🔒 Gizlilik & Güvenlik
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
              Gizlilik Politikası
            </h1>
            <p className="text-white/75 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Verilerinizin korunması ve güvenli işlenmesi bizim için en yüksek önceliktir.
            </p>
          </div>
        </section>

        {/* ─── Info alert ─── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-start gap-4 shadow-sm">
            <span className="text-amber-500 text-xl flex-shrink-0 mt-0.5">⚠️</span>
            <p className="text-amber-800 text-sm leading-relaxed">
              <strong>Bilgilendirme Notu:</strong> Bu sayfa bilgilendirme amacıyla hazırlanmıştır. Nihai hukuki gizlilik metni gerektiğinde güncellenecektir.
            </p>
          </div>
        </div>

        {/* ─── Main content: 2-col layout ─── */}
        <section className="py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

              {/* ─── Left summary panel ─── */}
              <aside className="lg:col-span-1 space-y-4 lg:sticky lg:top-24">
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                  <h2 className="font-black text-slate-900 text-base">Özet</h2>
                  <ul className="space-y-3 text-sm text-slate-600">
                    {[
                      { label: 'Hangi veriler?', anchor: '#toplanan-veriler' },
                      { label: 'Ne için kullanılır?', anchor: '#kullanim-amaci' },
                      { label: 'Altyapılar', anchor: '#altyapi' },
                      { label: 'Dosya & teslim', anchor: '#dosya-teslim' },
                      { label: 'Erişim & yetki', anchor: '#erisim-yetki' },
                      { label: 'Güncelleme notu', anchor: '#guncelleme' },
                    ].map(item => (
                      <li key={item.label}>
                        <a
                          href={item.anchor}
                          className="flex items-center gap-2 text-slate-500 hover:text-orange-500 transition-colors duration-200"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Trust signals */}
                <div className="bg-slate-900 rounded-2xl p-6 space-y-4 text-white shadow-sm">
                  <h3 className="font-bold text-sm opacity-70 uppercase tracking-wider">Güvenlik</h3>
                  <div className="space-y-3">
                    {[
                      { icon: '🔐', text: 'Supabase RLS ile satır bazlı erişim kontrolü' },
                      { icon: '☁️', text: 'Drive verileri Service Account ile korunur' },
                      { icon: '🌐', text: 'Cloudflare CDN güvenliği' },
                      { icon: '🔒', text: 'Şifreli bağlantı (HTTPS)' },
                    ].map(item => (
                      <div key={item.text} className="flex items-start gap-3 text-xs text-slate-300 leading-relaxed">
                        <span className="text-base flex-shrink-0">{item.icon}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>

              {/* ─── Right: section cards ─── */}
              <div className="lg:col-span-2 space-y-5">
                {SECTIONS.map(section => (
                  <div
                    id={section.id}
                    key={section.id}
                    className={`bg-white border ${section.border} rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow duration-300 scroll-mt-24`}
                  >
                    {/* Section header */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className={`w-12 h-12 rounded-xl ${section.iconBg} ${section.iconColor} flex items-center justify-center flex-shrink-0`}>
                        {section.icon}
                      </div>
                      <h2 className="font-bold text-slate-900 text-lg pt-2">{section.title}</h2>
                    </div>
                    {/* Items */}
                    <ul className="space-y-2.5">
                      {section.items.map(item => (
                        <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ─── Footer CTA strip ─── */}
        <section className="py-12 bg-white border-t border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-slate-900 font-bold text-lg">Sorunuz mu var?</p>
              <p className="text-slate-500 text-sm">İletişim sayfamız üzerinden ulaşabilirsiniz.</p>
            </div>
            <div className="flex gap-3">
              <Link
                to="/iletisim"
                className="btn-primary text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-sm inline-flex items-center gap-2"
              >
                İletişim
              </Link>
              <Link
                to="/"
                className="btn-outline font-semibold px-6 py-3 rounded-xl text-sm inline-flex items-center gap-2"
              >
                Ana Sayfa
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
