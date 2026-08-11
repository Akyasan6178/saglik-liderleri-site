import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Iletisim() {
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
        <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600 text-white rounded-3xl p-8 sm:p-12 shadow-soft space-y-4">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-sm border border-white/20">
            Bize Ulaşın
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">İletişim</h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            Program, başvurular veya iş birlikleri hakkında sorularınız için bizimle iletişime geçin.
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Program Hakkında İletişim */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-xl">
              ✉️
            </div>
            <h2 className="text-lg font-bold text-slate-900">Program Hakkında İletişim</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Başvuru koşulları, değerlendirme süreçleri ve program takvimi ile ilgili sorularınız için destek ekibimizle iletişime geçebilirsiniz.
            </p>
            {/* TODO: Buraya e-posta adresi eklenecek. */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 italic">
              📌 <strong>Not:</strong> [Buraya e-posta adresi eklenecek.]
            </div>
          </div>

          {/* Card 2: Marka Mutfağı İletişim Alanı */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center font-bold text-xl">
              👨‍🍳
            </div>
            <h2 className="text-lg font-bold text-slate-900">Marka Mutfağı İletişim Alanı</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Program kurucusu Marka Mutfağı kurumsal iletişim ve sponsorluk talepleri için doğrudan ulaşabilirsiniz.
            </p>
            <a
              href="https://markamutfagi.co"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline"
            >
              <span>markamutfagi.co web sitesini ziyaret et ↗</span>
            </a>
          </div>

          {/* Card 3: Sosyal Medya Linkleri */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-4 md:col-span-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center font-bold text-xl">
              🌐
            </div>
            <h2 className="text-lg font-bold text-slate-900">Sosyal Medya Kanallarımız</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Duyurular, güncel program haberleri ve içerik liderlerimizin paylaşımları için bizi sosyal medyada takip edin.
            </p>
            
            {/* Placeholder Sosyal Medya Rozetleri */}
            <div className="flex flex-wrap gap-3 pt-2">
              {/* TODO: Gerçek sosyal medya linki eklenecek. */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-orange-500 hover:text-white text-slate-700 text-xs font-bold transition-all duration-200"
              >
                Instagram
              </a>
              {/* TODO: Gerçek sosyal medya linki eklenecek. */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-sky-500 hover:text-white text-slate-700 text-xs font-bold transition-all duration-200"
              >
                LinkedIn
              </a>
              {/* TODO: Gerçek sosyal medya linki eklenecek. */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-500 hover:text-white text-slate-700 text-xs font-bold transition-all duration-200"
              >
                YouTube
              </a>
              {/* TODO: Gerçek sosyal medya linki eklenecek. */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-pink-500 hover:text-white text-slate-700 text-xs font-bold transition-all duration-200"
              >
                TikTok
              </a>
            </div>

            {/* TODO: Buraya sosyal medya linkleri eklenecek. */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 italic mt-2">
              📌 <strong>Not:</strong> [Buraya sosyal medya linkleri eklenecek.] <br />
              📌 <strong>Not:</strong> [Buraya iletişim formu veya yönlendirme eklenecek.]
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
