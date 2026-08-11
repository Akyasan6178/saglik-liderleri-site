import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Hakkinda() {
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
            Kurumsal
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Hakkında</h1>
          <p className="text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed">
            Sağlık profesyonellerini dijital dünyanın güvenilir ve bilimsel sesine dönüştüren lider gelişim programı.
          </p>
        </div>

        {/* Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-soft space-y-8 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              Geleceğin Dijital Sağlık Liderleri Nedir?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Geleceğin Dijital Sağlık Liderleri, tıp, eczacılık, hemşirelik ve tüm sağlık disiplinlerinden gelen genç yetenekleri dijital içerik üretimi, bilimsel iletişim ve toplumsal farkındalık alanında güçlendirmeyi amaçlayan kapsamlı bir gelişim programıdır.
            </p>
            {/* TODO: Buraya programın detaylı hikayesi eklenecek. */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 italic">
              📌 <strong>Not:</strong> [Buraya programın detaylı hikayesi eklenecek.]
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              Programın Amacı
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Dijital mecralarda hızla yayılan sağlık bilgi kirliliğinin önüne geçmek; bilimsel doğruluğu kanıtlanmış bilgiyi samimi, anlaşılır ve etkili bir dille kamuoyuna sunabilecek dijital sağlık liderleri yetiştirmektir.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              Kimler İçin Tasarlandı?
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Tıp Fakültesi, Eczacılık Fakültesi, Hemşirelik ve Sağlık Bilimleri Fakültesi öğrencileri ile mezun sağlık profesyonelleri için özel olarak kurgulanmıştır.
            </p>
            {/* TODO: Buraya program kapsamı eklenecek. */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 italic">
              📌 <strong>Not:</strong> [Buraya program kapsamı eklenecek.]
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              Marka Mutfağı’nın Rolü
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Program, iletişim ve içerik stratejisi alanında uzman **Marka Mutfağı** tarafından kurgulanmış ve yürütülmektedir. Müfredat, mentorluk desteği ve bootcamp organizasyonu Marka Mutfağı ekibi tarafından yönetilmektedir.
            </p>
            {/* TODO: Buraya ekip/kurucu açıklaması eklenecek. */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-500 italic">
              📌 <strong>Not:</strong> [Buraya ekip/kurucu açıklaması eklenecek.]
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-2">
              Program Yaklaşımı
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Çevrimiçi temel eğitimler, İstanbul yüz yüze bootcamp çalıştayları, birebir mentorluk ve haftalık görev uygulamaları ile teoriyi pratik dijital üretime dönüştüren adım adım bir metodoloji uygulanır.
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  )
}
