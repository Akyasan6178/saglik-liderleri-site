import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer id="iletişim" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Marka & Açıklama */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center shadow-md">
                <span className="text-white font-black text-xs">GD</span>
              </div>
              <span className="text-white font-bold text-lg tracking-tight">Geleceğin Dijital Sağlık Liderleri</span>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Marka Mutfağı tarafından geliştirilen, sağlık profesyonelleri için dijital içerik ve görünürlük odaklı gelişim programı.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700/80 text-xs font-semibold text-orange-400">
              <span>👨‍🍳</span>
              <span>Bir Marka Mutfağı programıdır.</span>
            </div>
          </div>

          {/* Col 2: Bağlantılar */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/hakkinda" className="text-slate-400 hover:text-orange-400 transition-colors duration-200">
                  Hakkında
                </Link>
              </li>
              <li>
                <Link to="/gizlilik" className="text-slate-400 hover:text-orange-400 transition-colors duration-200">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link to="/iletisim" className="text-slate-400 hover:text-orange-400 transition-colors duration-200">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sosyal Medya */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">Sosyal medyada bizi takip edin</h4>
            <div className="flex flex-wrap gap-2.5 pt-1">
              {/* TODO: Gerçek sosyal medya linki eklenecek. */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-orange-500 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700 transition-all duration-200"
                title="Instagram (TODO: Link eklenecek)"
              >
                Instagram
              </a>
              {/* TODO: Gerçek sosyal medya linki eklenecek. */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-sky-500 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700 transition-all duration-200"
                title="LinkedIn (TODO: Link eklenecek)"
              >
                LinkedIn
              </a>
              {/* TODO: Gerçek sosyal medya linki eklenecek. */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-500 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700 transition-all duration-200"
                title="YouTube (TODO: Link eklenecek)"
              >
                YouTube
              </a>
              {/* TODO: Gerçek sosyal medya linki eklenecek. */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-pink-500 hover:text-white text-slate-300 text-xs font-semibold border border-slate-700 transition-all duration-200"
                title="TikTok (TODO: Link eklenecek)"
              >
                TikTok
              </a>
            </div>
          </div>

        </div>

        {/* Telif Hakları */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Marka Mutfağı. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-4">
            <Link to="/hakkinda" className="hover:text-slate-300 transition-colors">Hakkında</Link>
            <Link to="/gizlilik" className="hover:text-slate-300 transition-colors">Gizlilik</Link>
            <Link to="/iletisim" className="hover:text-slate-300 transition-colors">İletişim</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}
