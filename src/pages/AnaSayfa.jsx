import { useNavigate, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'

/* ─── SVG Icon Components ─── */
const IconHeart = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
  </svg>
)

const IconCpu = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M16.5 7.5h-9v9h9v-9z" />
    <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" clipRule="evenodd" />
  </svg>
)

const IconUsers = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
  </svg>
)

const IconRocket = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 019.75 22.5a.75.75 0 01-.75-.75v-4.131A15.838 15.838 0 016.382 15H2.25a.75.75 0 01-.75-.75 6.75 6.75 0 017.815-6.666zM15 6.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clipRule="evenodd" />
    <path d="M5.26 17.242a.75.75 0 10-.897-1.203 5.243 5.243 0 00-2.05 5.022.75.75 0 00.625.627 5.243 5.243 0 005.022-2.051.75.75 0 10-1.202-.897 3.744 3.744 0 01-3.008 1.51c0-1.23.592-2.323 1.51-3.008z" />
  </svg>
)

const IconClipboard = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
  </svg>
)

const IconChartBar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 01-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 013 19.875v-6.75z" />
  </svg>
)

const IconGlobe = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
  </svg>
)

const IconCheck = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
  </svg>
)

const IconArrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
)

/* ─── Animated Counter ─── */
function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0
        const end = parseInt(value)
        const step = Math.ceil(end / (2000 / 16))
        const timer = setInterval(() => {
          start += step
          if (start >= end) { setCount(end); clearInterval(timer) }
          else setCount(start)
        }, 16)
        observer.disconnect()
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return <span ref={ref}>{count}{suffix}</span>
}

/* ─── Stat Card ─── */
function StatCard({ value, suffix, label, accent = 'coral' }) {
  const accents = {
    coral:  { icon: '🔥', bg: 'bg-orange-50', ring: 'ring-orange-100' },
    mint:   { icon: '🌿', bg: 'bg-emerald-50', ring: 'ring-emerald-100' },
    sky:    { icon: '💡', bg: 'bg-sky-50', ring: 'ring-sky-100' },
    violet: { icon: '⚡', bg: 'bg-violet-50', ring: 'ring-violet-100' },
  }
  const a = accents[accent]
  return (
    <div className={`text-center p-8 bg-white rounded-2xl card-hover shadow-md ring-1 ${a.ring}`}>
      <div className="text-3xl mb-3">{a.icon}</div>
      <div className="text-5xl font-black gradient-text mb-3">
        <AnimatedCounter value={value} suffix={suffix} />
      </div>
      <div className="text-slate-500 text-sm font-medium tracking-wide">{label}</div>
    </div>
  )
}

/* ─── Feature Card ─── */
function FeatureCard({ icon, title, desc, iconBg, iconColor, delay = 0 }) {
  return (
    <div
      className="bg-white rounded-2xl p-8 card-hover shadow-md ring-1 ring-slate-100 group cursor-default"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center ${iconColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-slate-900 font-bold text-xl mb-3">{title}</h3>
      <p className="text-slate-500 text-sm leading-loose">{desc}</p>
    </div>
  )
}

/* ─── Timeline Step ─── */
function TimelineStep({ number, icon, title, desc, tags, isLast = false, color = 'coral' }) {
  const colors = {
    coral:  { dot: 'bg-gradient-to-br from-orange-400 to-pink-500', ring: 'ring-orange-200', text: 'text-orange-500', badge: 'bg-orange-50 text-orange-600 border-orange-200' },
    violet: { dot: 'bg-gradient-to-br from-violet-500 to-purple-600', ring: 'ring-violet-200', text: 'text-violet-600', badge: 'bg-violet-50 text-violet-600 border-violet-200' },
    mint:   { dot: 'bg-gradient-to-br from-emerald-400 to-teal-500', ring: 'ring-emerald-200', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    amber:  { dot: 'bg-gradient-to-br from-amber-400 to-orange-500', ring: 'ring-amber-200', text: 'text-amber-600', badge: 'bg-amber-50 text-amber-600 border-amber-200' },
  }
  const c = colors[color]

  return (
    <div className="flex gap-8 md:gap-10 group">
      {/* Left: icon + connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-16 h-16 rounded-2xl ${c.dot} flex items-center justify-center text-white shadow-lg ring-4 ${c.ring} group-hover:scale-110 transition-transform duration-300 z-10`}>
          {icon}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 mt-4 bg-gradient-to-b from-slate-200 to-transparent min-h-[80px]" />
        )}
      </div>

      {/* Right: content */}
      <div className="pb-14 flex-1 min-w-0">
        <div className="bg-white rounded-2xl p-8 card-hover shadow-md ring-1 ring-slate-100">
          <div className="mb-5">
            <span className={`text-xs font-bold uppercase tracking-widest ${c.text} mb-2 block`}>Aşama {number}</span>
            <h3 className="text-slate-900 font-bold text-2xl">{title}</h3>
          </div>
          <p className="text-slate-500 text-base leading-loose mb-6">{desc}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map(tag => (
              <span key={tag} className={`px-4 py-1.5 rounded-full text-xs font-semibold border ${c.badge}`}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Section Badge ─── */
function SectionBadge({ children, variant = 'coral' }) {
  const variants = {
    coral:  'bg-orange-50 text-orange-600 border border-orange-200',
    mint:   'bg-emerald-50 text-emerald-600 border border-emerald-200',
    violet: 'bg-violet-50 text-violet-600 border border-violet-200',
  }
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 ${variants[variant]}`}>
      {children}
    </div>
  )
}

/* ─── Navbar ─── */
function Navbar({ onLoginClick }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-white font-black text-sm">GD</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-slate-800 font-bold text-sm leading-tight">Geleceğin Dijital</div>
              <div className="gradient-text font-semibold text-xs">Sağlık Liderleri</div>
            </div>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#program"
              className="text-slate-500 hover:text-orange-500 text-sm font-medium transition-colors duration-200"
            >
              Program
            </a>
            <a
              href="#süreç"
              className="text-slate-500 hover:text-orange-500 text-sm font-medium transition-colors duration-200"
            >
              Süreç
            </a>
            <Link
              to="/hakkinda"
              className="text-slate-500 hover:text-orange-500 text-sm font-medium transition-colors duration-200"
            >
              Hakkında
            </Link>
            <Link
              to="/iletisim"
              className="text-slate-500 hover:text-orange-500 text-sm font-medium transition-colors duration-200"
            >
              İletişim
            </Link>
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <button
              id="sisteme-giris-btn"
              onClick={onLoginClick}
              className="hidden md:flex text-slate-600 hover:text-slate-900 font-semibold px-4 py-2.5 rounded-xl text-sm items-center gap-2 cursor-pointer transition-colors"
            >
              <span>Giriş</span>
            </button>
            <a
              href="https://markamutfagi.co/saglikliderleri/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              <span>Başvuru Yap</span>
              <IconArrow />
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

/* ─── Hero Section ─── */
function HeroSection({ onLoginClick }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-orange-50/30 to-sky-50/40 grid-bg">

      {/* Soft light blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-orange-100/60 blur-[90px]" />
        <div className="absolute -bottom-32 -left-32 w-[450px] h-[450px] rounded-full bg-sky-100/60 blur-[90px]" />
        <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-pink-100/50 blur-[70px]" />
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute top-28 left-[12%] w-10 h-10 rounded-2xl bg-orange-200/60 rotate-12 animate-float pointer-events-none" style={{ animationDelay: '0s' }} />
      <div className="absolute top-[42%] right-[8%] w-7 h-7 rounded-xl bg-sky-200/70 -rotate-12 animate-float pointer-events-none" style={{ animationDelay: '1.2s' }} />
      <div className="absolute bottom-32 left-[28%] w-6 h-6 rounded-lg bg-emerald-200/70 rotate-45 animate-float pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="absolute top-[65%] left-[6%] w-5 h-5 rounded-full bg-pink-200/80 animate-float pointer-events-none" style={{ animationDelay: '0.7s' }} />
      <div className="absolute top-[20%] right-[22%] w-4 h-4 rounded-full bg-violet-200/70 animate-float pointer-events-none" style={{ animationDelay: '1.8s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Left content */}
          <div className="animate-slide-up">
            <SectionBadge variant="mint">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-medium">Ağustos 2026 — Başvurular Açık</span>
            </SectionBadge>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.08] mb-8">
              Sağlığın<br />
              <span className="gradient-text">Dijital Sesi</span><br />
              <span className="text-slate-400">Sen misin?</span>
            </h1>

            <p className="text-slate-500 text-lg leading-loose mb-10 max-w-xl">
              Sosyal medya her gün milyonlarca yanlış sağlık bilgisiyle dolup taşıyor. Peki bilimin sesi nerede? İşte tam burada: geleceğin sağlık profesyonellerini dijital dünyanın güvenilir sesi olmaya davet ediyoruz.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://markamutfagi.co/saglikliderleri/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary text-white font-bold px-10 py-4 rounded-2xl text-base flex items-center gap-3 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <span>Hemen Başvur</span>
                <IconArrow />
              </a>
              <a
                href="#program"
                className="btn-outline font-semibold px-10 py-4 rounded-2xl text-base flex items-center gap-2 cursor-pointer"
              >
                Daha Fazla Bilgi
              </a>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-8 mt-14 pt-10 border-t border-slate-200">
              {[
                { label: 'Program Aşaması', val: '5' },
                { label: 'Kamp Şehri', val: 'İstanbul' },
                { label: 'Burs Desteği', val: '%100' },
              ].map(s => (
                <div key={s.label} className="flex flex-col gap-1">
                  <span className="text-slate-900 font-black text-2xl">{s.val}</span>
                  <span className="text-slate-400 text-xs uppercase tracking-wider">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: visual card */}
          <div className="hidden lg:flex justify-end animate-fade-in">
            <div className="relative w-full max-w-md">

              {/* Main card */}
              <div className="bg-white rounded-3xl p-8 relative z-10 animate-float shadow-2xl ring-1 ring-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white shadow-md">
                    <IconHeart />
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold">Sağlık + Teknoloji</div>
                    <div className="text-slate-400 text-sm">Geleceği birlikte şekillendir</div>
                  </div>
                </div>

                {/* Progress bars */}
                {[
                  { label: 'Girişimcilik', w: '85%', color: 'bg-gradient-to-r from-orange-400 to-pink-500' },
                  { label: 'Dijital Sağlık', w: '92%', color: 'bg-gradient-to-r from-sky-400 to-violet-500' },
                  { label: 'Liderlik',       w: '78%', color: 'bg-gradient-to-r from-emerald-400 to-teal-500' },
                ].map(bar => (
                  <div key={bar.label} className="mb-5">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-600 font-medium">{bar.label}</span>
                      <span className="text-orange-500 font-bold">{bar.w}</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color} rounded-full transition-all duration-1000`} style={{ width: bar.w }} />
                    </div>
                  </div>
                ))}

                {/* Kart içi bilgiler */}
                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 border border-orange-100">
                    <span className="text-lg">🏥</span>
                    <div>
                      <p className="text-slate-800 text-xs font-bold">Sağlık Profesyonelleri İçin</p>
                      <p className="text-slate-400 text-xs mt-0.5">Tıp, Eczacılık, Hemşirelik ve tüm sağlık bölümleri</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <span className="text-lg">📍</span>
                    <div>
                      <p className="text-slate-800 text-xs font-bold">Tüm Türkiye'den</p>
                      <p className="text-slate-400 text-xs mt-0.5">Uzaktan katılımcıların kamp giderleri karşılanır</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-violet-50 border border-violet-100">
                    <span className="text-lg">🏆</span>
                    <div>
                      <p className="text-slate-800 text-xs font-bold">Sertifika Garantisi</p>
                      <p className="text-slate-400 text-xs mt-0.5">Program sonu resmi "Dijital Sağlık İçerik Üreticisi" belgesi</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge top-right */}
              <div className="absolute -top-5 -right-5 bg-white rounded-2xl p-4 z-20 animate-float shadow-xl ring-1 ring-orange-100" style={{ animationDelay: '1.5s' }}>
                <div className="text-2xl font-black gradient-text">100%</div>
                <div className="text-slate-400 text-xs font-medium">Ücretsiz</div>
              </div>

              {/* Floating badge bottom-left */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 z-20 animate-float shadow-xl ring-1 ring-emerald-100" style={{ animationDelay: '0.8s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">✓</div>
                  <div>
                    <div className="text-slate-800 text-xs font-bold">Sertifika</div>
                    <div className="text-slate-400 text-xs">Dahil</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-slate-300 text-xs uppercase tracking-widest">Keşfet</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-orange-400 to-transparent animate-pulse" />
      </div>
    </section>
  )
}

/* ─── Stats Row ─── */
function StatsRow() {
  return (
    <section className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value="5"   suffix=" Adım"  label="Yapılandırılmış Yolculuk"    accent="coral"  />
          <StatCard value="10"  suffix="+"      label="Kişilik Elit Kadro"          accent="violet" />
          <StatCard value="3"   suffix=" Hafta" label="Çevrimiçi Temel Eğitim"      accent="mint"   />
          <StatCard value="100" suffix="%"      label="Kamp Masrafı Karşılanır"    accent="sky"    />
        </div>
      </div>
    </section>
  )
}

/* ─── About Section ─── */
function AboutSection() {
  return (
    <section id="program" className="py-32 relative overflow-hidden bg-slate-50">
      <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />
      {/* Decorative shapes */}
      <div className="absolute top-20 right-10 w-48 h-48 rounded-full bg-orange-100/40 blur-[60px] pointer-events-none" />
      <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-sky-100/40 blur-[60px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          {/* Left */}
          <div>
            <SectionBadge variant="coral">
              <IconGlobe />
              <span className="text-sm font-medium">Neden Bu Program?</span>
            </SectionBadge>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-10 leading-tight">
              Bilim Susuyorsa,<br />
              <span className="gradient-text">Sen Konuş</span>
            </h2>

            <p className="text-slate-500 text-lg leading-loose mb-8">
              Her gün milyonlarca insan sağlık kararını sosyal medyadan aldığı bilgilerle veriyor. "Mucizevi kür" videoları, şüphe tohumları, tablo dışı öneriler… Bilimsel bilginin sesi ise çoğunlukla susturuluyor ya da o kadar sıkıcı kalıyor ki kimse izlemiyor.
            </p>

            <p className="text-slate-500 leading-loose mb-12">
              Bu program, sağlık eğitimi alan seni bir üretici olarak görüyor. Sahip olduğun bilgiyi etkili, ilgi çekici ve bilime sadık dijital içeriğe dönüştürmeyi ─ hem tekniğini hem de kamusal sorumluluk bilincini ─ geliştirmeni hedefliyor.
            </p>

            <ul className="space-y-5">
              {[
                'Eczacılık, Tıp, Hemşirelik ve tüm sağlık bölümleri için tasarlandı',
                'Sertifikalı çık: "Dijital Sağlık İçerik Üreticisi" belgen hazır',
                'İstanbul kampında tüm giderler program tarafından karşılanır',
                'Sıfır deneyimle başlayabilirsin; merak ve sorumluluk yeter',
              ].map(item => (
                <li key={item} className="flex items-center gap-4 text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white flex-shrink-0 shadow-sm">
                    <IconCheck />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right: feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FeatureCard
              icon={<IconHeart />}
              title="Bilgi Kirliliğine Son"
              desc="Sağlık bilgisi bir ayrıcalık değil, hak. Toplumun doğru bilgiye ulaşması için sesini yükselt."
              iconBg="bg-orange-100"
              iconColor="text-orange-500"
              delay={0}
            />
            <FeatureCard
              icon={<IconCpu />}
              title="Teknik Üretim Becerisi"
              desc="Reels, Shorts, infografik… İzlenmeyi hak eden içerik yapmayı ─ kameranın karşısında, algoritmayla kavga etmeden ─ öğren."
              iconBg="bg-sky-100"
              iconColor="text-sky-500"
              delay={100}
            />
            <FeatureCard
              icon={<IconUsers />}
              title="Coğrafya Ötesi Ağ"
              desc="Türkiye'nin dört bir yanından gelecek 10 kişilik bir ekiple aynı ideali paylaş, kapılar birlikte açılır."
              iconBg="bg-emerald-100"
              iconColor="text-emerald-500"
              delay={200}
            />
            <FeatureCard
              icon={<IconRocket />}
              title="Birebir Mentorluğu"
              desc="Alanında iz bırakmış uzmanlar seninle birebir çalışır; hem içeriğini hem stratejini şekillendirirler."
              iconBg="bg-violet-100"
              iconColor="text-violet-500"
              delay={300}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Process / Timeline Section ─── */
function ProcessSection() {
  const steps = [
    {
      number: '01',
      icon: <IconClipboard />,
      title: 'Başvur ve Seçil',
      desc: 'Online başvuru formunu doldur. Kısa bir değerlendirme mülakatından geç ve Ağustos 2026\'da 10 kişilik seçkin kadronun bir parçası ol. Deneyim aranmıyor; doğru yerden çıkma motivasyonu yeter.',
      tags: ['Ağustos 2026', 'Çevrimiçi', 'Seçim Mülakatı'],
      color: 'coral',
    },
    {
      number: '02',
      icon: <IconChartBar />,
      title: 'Online Temel Eğitim (3 Hafta)',
      desc: '3 hafta boyunca algoritmayla tanış, doğru bilgi teyidini öğren ve ilk dijital sağlık içeriklerini üret. Her haftanın sonunda bir ödev, bir geri bildirim ve bir mükemmellik noktası daha.',
      tags: ['Ağustos 2026', 'Çevrimiçi Dersler', 'Haftalık Ödevler'],
      color: 'violet',
    },
    {
      number: '03',
      icon: <IconUsers />,
      title: 'İstanbul Bootcamp (2 Gün)',
      desc: 'Nerede olursan ol, programdan ayrılma. Ulaşım ve konaklama tamamen bize ait. İstanbul\'da 2 yoğun günde network kur, uzmanlarla yüz yüze çalış ve sınırlarını kır.',
      tags: ['Eylül 2026', 'Yüz Yüze', 'Gider Yok'],
      color: 'mint',
    },
    {
      number: '04',
      icon: <IconRocket />,
      title: 'İçerik Üretim Dönemi (3 Hafta)',
      desc: 'Bootcamptan dön, öğrendiklerini sahaya yansıt. Her hafta farklı bir içerik görevi, farklı bir format ve mentorla birebir değerlendirme. Gücün artık somut.',
      tags: ['Eylül - Ekim 2026', 'Çevrimiçi', 'Görev Odaklı'],
      color: 'amber',
    },
    {
      number: '05',
      icon: <IconRocket />,
      title: 'Kapanış & Sertifika Töreni',
      desc: 'Tüm çabayı bir araya getir ve İstanbul\'da büyük finali yaşa. Sertifikanı teslim al, toplulukla bağını pekiştir. Artık Dijital Sağlık İçerik Üreticisisin.',
      tags: ['Ekim 2026', 'Sertifika', 'İstanbul Buluşması'],
      color: 'coral',
    },
  ]

  return (
    <section id="süreç" className="py-32 relative bg-white">
      {/* Decorative side accent */}
      <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-orange-50/60 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <SectionBadge variant="violet">
            <span className="text-sm font-medium">Program Takvimi</span>
          </SectionBadge>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 leading-tight">
            Ağustos'tan Ekim'e<br />
            <span className="gradient-text">5 Adım, Bir Dönüşüm</span>
          </h2>
          <p className="text-slate-500 text-lg leading-loose">
            2.5 ay boyunca online eğitimden İstanbul bootcampına, oradan sertifika törenine uzanan net bir yol haritası — her adımı biliyorsun, her aşamada destek alıyorsun.
          </p>
        </div>

        {/* Timeline */}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <TimelineStep key={step.number} {...step} isLast={i === steps.length - 1} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Banner ─── */
function CTABanner({ onLoginClick }) {
  return (
    <section className="py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Energetic sunset gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600" />
          <div className="absolute inset-0 grid-bg opacity-10" />
          {/* Glowing orbs */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-[50px]" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-[50px]" />
          {/* Floating shapes */}
          <div className="absolute top-8 left-[20%] w-8 h-8 rounded-xl bg-white/10 rotate-12 animate-float" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-8 right-[20%] w-6 h-6 rounded-lg bg-white/10 -rotate-12 animate-float" style={{ animationDelay: '1s' }} />

          <div className="relative text-center px-8 py-24 md:py-28">
            <div className="w-20 h-20 rounded-2xl bg-white/15 flex items-center justify-center mx-auto mb-8 text-white backdrop-blur-sm">
              <IconRocket />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Sağlığın Sesi<br />Olmaya Hazır Mısın?
            </h2>
            <p className="text-white/80 text-xl leading-loose mb-12 max-w-xl mx-auto">
              Her gün binlerce yanlış bilgi yayılıyor. Sen bunu izleyerek mi geçireceksin, yoksa değiştirerek mi? Kontenjan dolmadan başvurunu yap.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://markamutfagi.co/saglikliderleri/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-orange-500 font-bold px-12 py-5 rounded-2xl text-lg inline-flex items-center gap-3 cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <span>Hemen Başvur</span>
                <IconArrow />
              </a>
              <button
                onClick={onLoginClick}
                className="bg-white/10 border border-white/20 text-white font-bold px-12 py-5 rounded-2xl text-lg inline-flex items-center gap-3 cursor-pointer shadow-xl hover:bg-white/20 transition-all duration-300"
              >
                <span>Giriş</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}



/* ─── Main Page ─── */
export default function AnaSayfa() {
  const navigate = useNavigate()
  const handleLogin = () => navigate('/login')

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onLoginClick={handleLogin} />
      <HeroSection onLoginClick={handleLogin} />
      <StatsRow />
      <AboutSection />
      <ProcessSection />
      <CTABanner onLoginClick={handleLogin} />
      <Footer />
    </div>
  )
}
