import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

const SECTIONS = [
  {
    icon: '📋',
    title: 'Hangi bilgiler alınır?',
    items: [
      'Ad, soyad',
      'E-posta ve telefon',
      'Üniversite / sınıf bilgisi',
      'Başvuru yanıtları',
      'Görev teslimleri',
      'İçerik DNA cevapları',
      'Program performans kayıtları',
    ],
    accent: 'border-orange-100 bg-orange-50/40',
    iconBg: 'bg-orange-50',
  },
  {
    icon: '🎯',
    title: 'Neden kullanılır?',
    items: [
      'Başvuruları değerlendirmek',
      'Katılımcı ve takım süreçlerini yürütmek',
      'Mentor geri bildirimlerini yönetmek',
      'Görev teslimlerini takip etmek',
      'Program deneyimini ölçmek',
    ],
    accent: 'border-violet-100 bg-violet-50/40',
    iconBg: 'bg-violet-50',
  },
  {
    icon: '☁️',
    title: 'Nerede tutulur?',
    items: [
      'Uygulama verileri Supabase altyapısında tutulur',
      'Görev teslim dosyaları Google Drive klasör yapısında saklanır',
      'Site Cloudflare üzerinden yayınlanır',
    ],
    accent: 'border-sky-100 bg-sky-50/40',
    iconBg: 'bg-sky-50',
  },
  {
    icon: '🔑',
    title: 'Kim erişebilir?',
    items: [
      'Adminler: program yönetimi için gerekli verilere erişir',
      'Mentorlar: yalnızca kendi takımlarıyla ilgili verilere erişir',
      'Katılımcılar: kendi panellerindeki verilere erişir',
    ],
    accent: 'border-emerald-100 bg-emerald-50/40',
    iconBg: 'bg-emerald-50',
  },
]

export default function Gizlilik() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">

      {/* ─── Navbar ─── */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">GD</span>
            </div>
            <div>
              <div className="text-slate-800 font-bold text-sm leading-tight">Geleceğin Dijital</div>
              <div
                className="font-semibold text-xs"
                style={{ background:'linear-gradient(135deg,#f97316,#ec4899,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}
              >
                Sağlık Liderleri
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors">Ana Sayfa</Link>
            <button onClick={() => navigate('/login')} className="btn-primary text-white font-semibold px-5 py-2 rounded-xl text-sm shadow-sm">
              Giriş Yap
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ─── Compact hero ─── */}
        <section className="bg-white border-b border-slate-100 py-12 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-5">
              🔒 Hukuki Bilgilendirme
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 leading-tight">
              Gizlilik Politikası
            </h1>
            <p className="text-slate-500 text-base leading-relaxed">
              Geleceğin Dijital Sağlık Liderleri programında yalnızca başvuru, katılım ve program takibi için gerekli bilgiler işlenir.
            </p>
          </div>
        </section>

        {/* ─── Info note ─── */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3.5 flex items-center gap-3">
            <span className="text-amber-400 text-lg flex-shrink-0">ℹ️</span>
            <p className="text-amber-800 text-sm">
              Bu sayfa bilgilendirme amacıyla hazırlanmıştır. Nihai hukuki metin gerektiğinde güncellenecektir.
            </p>
          </div>
        </div>

        {/* ─── 4 sade kart ─── */}
        <section className="py-10 pb-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            {SECTIONS.map(s => (
              <div key={s.title} className={`rounded-2xl border p-6 ${s.accent}`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-xl ${s.iconBg} flex items-center justify-center text-lg flex-shrink-0`}>
                    {s.icon}
                  </div>
                  <h2 className="font-bold text-slate-900 text-base">{s.title}</h2>
                </div>
                <ul className="space-y-2">
                  {s.items.map(item => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Contact section */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-lg">✉️</div>
                <h2 className="font-bold text-slate-900 text-base">İletişim</h2>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Gizlilik veya veri kullanımıyla ilgili sorularınız için iletişim sayfamıza ulaşabilirsiniz.
              </p>
              <Link
                to="/iletisim"
                className="inline-flex items-center gap-2 btn-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm shadow-sm"
              >
                İletişim sayfasına git →
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
