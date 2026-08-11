import { Link } from 'react-router-dom'

/* ─── Inline SVG Social Icons ─── */
const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
)

const IconFacebook = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const SOCIAL_LINKS = [
  { id: 'instagram', label: 'Instagram', icon: <IconInstagram />, hoverBg: 'hover:bg-gradient-to-br hover:from-purple-500 hover:via-pink-500 hover:to-orange-400', hoverText: 'hover:text-white', hoverBorder: 'hover:border-pink-300' },
  { id: 'linkedin',  label: 'LinkedIn',  icon: <IconLinkedIn />,  hoverBg: 'hover:bg-sky-500',  hoverText: 'hover:text-white', hoverBorder: 'hover:border-sky-300' },
  { id: 'youtube',   label: 'YouTube',   icon: <IconYouTube />,   hoverBg: 'hover:bg-red-500',  hoverText: 'hover:text-white', hoverBorder: 'hover:border-red-300' },
  { id: 'tiktok',    label: 'TikTok',    icon: <IconTikTok />,    hoverBg: 'hover:bg-slate-800', hoverText: 'hover:text-white', hoverBorder: 'hover:border-slate-400' },
  { id: 'facebook',  label: 'Facebook',  icon: <IconFacebook />,  hoverBg: 'hover:bg-blue-600', hoverText: 'hover:text-white', hoverBorder: 'hover:border-blue-300' },
]

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 text-slate-600 overflow-x-hidden">
      {/* Top soft gradient strip */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-400 via-pink-400 to-violet-500 opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 sm:pb-10">

        {/* ─── Main grid ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-8 sm:pb-10 border-b border-slate-100">

          {/* Col: Brand — 5 cols */}
          <div className="md:col-span-5 space-y-4 sm:space-y-5">
            {/* Logo row */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md shadow-orange-200/50 flex-shrink-0">
                <span className="text-white font-black text-xs tracking-tight">GD</span>
              </div>
              <div>
                <div className="text-slate-900 font-bold text-sm sm:text-base leading-tight">Geleceğin Dijital Sağlık Liderleri</div>
                <div className="text-slate-400 text-xs mt-0.5">Marka Mutfağı programı</div>
              </div>
            </div>

            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed max-w-sm">
              Sağlık profesyonellerinin dijital dünyadaki sesini güçlendiren, içerik üretimi ve görünürlük odaklı kapsamlı gelişim programı.
            </p>

            {/* Marka Mutfağı badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-orange-200 bg-orange-50 text-xs font-semibold text-orange-600">
              <span className="text-sm leading-none">👨‍🍳</span>
              <span>Bir Marka Mutfağı programıdır</span>
            </div>

            {/* Social icons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.id}
                  href="#"
                  aria-label={s.label}
                  title={s.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                    text-slate-400 border border-slate-200 bg-slate-50
                    transition-all duration-200
                    ${s.hoverBg} ${s.hoverText} ${s.hoverBorder}
                    hover:shadow-md hover:-translate-y-0.5
                  `}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col: Nav links — 3 cols */}
          <div className="md:col-span-3 space-y-3 sm:space-y-4">
            <h4 className="text-slate-400 font-bold text-xs tracking-widest uppercase">Sayfalar</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { to: '/hakkinda', label: 'Hakkında' },
                { to: '/gizlilik', label: 'Gizlilik Politikası' },
                { to: '/iletisim', label: 'İletişim' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-500 hover:text-orange-500 transition-colors duration-200 inline-flex items-center gap-1.5 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-300 group-hover:bg-orange-400 transition-colors duration-200 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col: Program highlights — 4 cols */}
          <div className="md:col-span-4 space-y-3 sm:space-y-4">
            <h4 className="text-slate-400 font-bold text-xs tracking-widest uppercase">Program</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                'İçerik DNA Analizi',
                'Mentor Geri Bildirimi',
                'Haftalık Görevler',
                'İstanbul Bootcampı',
                'Sertifikasyon',
              ].map(item => (
                <li key={item} className="text-slate-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-slate-200 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="https://markamutfagi.co/saglikliderleri/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200 group mt-1"
            >
              Başvuru sayfasına git
              <span className="group-hover:translate-x-1 transition-transform duration-200">↗</span>
            </a>
          </div>
        </div>

        {/* ─── Bottom bar ─── */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-slate-400">
          <p>© 2026 Marka Mutfağı. Tüm hakları saklıdır.</p>
          <p className="text-slate-400 text-xs">
            Geleceğin Dijital Sağlık Liderleri — Bir Marka Mutfağı programı
          </p>
        </div>

      </div>
    </footer>
  )
}
