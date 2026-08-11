import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

/* ─── Inline SVG Social Icons ─── */
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

/* ─── Social links ─── */
const SOCIAL_LINKS = [
  {
    id: 'instagram',
    label: 'Instagram',
    description: 'Güncel içerik ve duyurular',
    href: '#',
    icon: <IconInstagram />,
    bg: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    shadow: 'shadow-pink-200/60',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    description: 'Profesyonel ağ ve haberler',
    href: '#',
    icon: <IconLinkedIn />,
    bg: 'bg-sky-600',
    shadow: 'shadow-sky-200/60',
  },
  {
    id: 'youtube',
    label: 'YouTube',
    description: 'Eğitim videoları ve içerikler',
    href: '#',
    icon: <IconYouTube />,
    bg: 'bg-red-600',
    shadow: 'shadow-red-200/60',
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    description: 'Kısa format içerikler',
    href: '#',
    icon: <IconTikTok />,
    bg: 'bg-slate-900',
    shadow: 'shadow-slate-300/60',
  },
  {
    id: 'facebook',
    label: 'Facebook',
    description: 'Topluluk ve etkinlikler',
    href: '#',
    icon: <IconFacebook />,
    bg: 'bg-blue-700',
    shadow: 'shadow-blue-200/60',
  },
]

export default function Iletisim() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">

      {/* ─── Navbar ─── */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
            <Link to="/" className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors duration-200">
              Ana Sayfa
            </Link>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-white font-semibold px-5 py-2 rounded-xl text-sm shadow-sm"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ─── Compact Hero Banner ─── */}
        <section className="bg-white border-b border-slate-100 py-12 md:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider mb-5">
              Bize Ulaşın
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
              İletişim
            </h1>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
              Program, başvuru ve iş birliği konuları için Marka Mutfağı ekibiyle iletişime geçebilirsiniz.
            </p>
          </div>
        </section>

        {/* ─── Main 2-col grid ─── */}
        <section className="py-12 md:py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* ─── Left: Program contact ─── */}
              <div className="space-y-5">
                {/* Program card */}
                <div className="bg-white border border-orange-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center mb-5 shadow-md shadow-orange-200/50">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white" aria-hidden="true">
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mb-2">Program İletişimi</h2>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    Başvuru koşulları, değerlendirme süreçleri ve program takvimi ile ilgili sorularınız için destek ekibimizle iletişime geçebilirsiniz.
                  </p>
                  <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 flex items-center gap-3">
                    <span className="text-orange-400 text-base">📬</span>
                    <p className="text-orange-800 text-xs sm:text-sm font-medium">
                      İletişim kanalları yakında güncellenecektir.
                    </p>
                  </div>
                </div>

                {/* Marka Mutfağı card */}
                <div className="bg-white border border-violet-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center text-xl flex-shrink-0">
                      👨‍🍳
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Marka Mutfağı</h2>
                      <p className="text-slate-500 text-xs mt-0.5">Program kurucusu</p>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed mb-5">
                    Geleceğin Dijital Sağlık Liderleri programı Marka Mutfağı tarafından geliştirilmiştir. Kurumsal iş birliği, sponsorluk ve içerik stratejisi konularında doğrudan ulaşabilirsiniz.
                  </p>
                  <a
                    href="https://markamutfagi.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-700 font-semibold text-xs sm:text-sm px-4 py-2 rounded-xl hover:bg-violet-100 transition-colors duration-200"
                  >
                    markamutfagi.co sitesini ziyaret et ↗
                  </a>
                </div>
              </div>

              {/* ─── Right: Social media ─── */}
              <div className="space-y-5">
                {/* Social section card */}
                <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center flex-shrink-0 text-white">
                      🌐
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Sosyal Medya</h2>
                      <p className="text-slate-500 text-xs mt-0.5">Duyurular ve içerikler için takip edin</p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    Duyurular, güncel program haberleri ve içerik liderlerimizin paylaşımları için bizi sosyal medyada takip edin.
                  </p>

                  {/* Social icon grid */}
                  <div className="space-y-3">
                    {SOCIAL_LINKS.map(s => (
                      <a
                        key={s.id}
                        href={s.href}
                        aria-label={s.label}
                        title={`${s.label} — ${s.description}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200 hover:shadow-sm transition-all duration-200 group"
                      >
                        {/* Icon badge */}
                        <div
                          className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center text-white flex-shrink-0 shadow-sm ${s.shadow} group-hover:scale-105 transition-transform duration-200`}
                        >
                          {s.icon}
                        </div>
                        {/* Text */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-slate-900 text-sm">{s.label}</div>
                          <div className="text-slate-500 text-xs">{s.description}</div>
                        </div>
                        <span className="text-slate-300 group-hover:text-slate-500 transition-colors duration-200 text-sm">→</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Quick links card */}
                <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-sm">
                  <h3 className="font-bold text-xs opacity-60 uppercase tracking-wider mb-4">Hızlı Bağlantılar</h3>
                  <div className="space-y-2.5">
                    {[
                      { label: 'Hakkında', to: '/hakkinda', icon: 'ℹ️' },
                      { label: 'Gizlilik Politikası', to: '/gizlilik', icon: '🔒' },
                      { label: 'Başvuru Sayfası', href: 'https://markamutfagi.co/saglikliderleri/', icon: '🚀', external: true },
                    ].map(link => (
                      link.external ? (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors duration-200 group"
                        >
                          <span className="text-sm">{link.icon}</span>
                          <span className="flex-1">{link.label}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">↗</span>
                        </a>
                      ) : (
                        <Link
                          key={link.label}
                          to={link.to}
                          className="flex items-center gap-3 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors duration-200 group"
                        >
                          <span className="text-sm">{link.icon}</span>
                          <span className="flex-1">{link.label}</span>
                          <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">→</span>
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
