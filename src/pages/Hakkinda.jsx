import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

/* ─── Shared inline SVG icons ─── */
const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3h-15a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0zm12-1.5a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
  </svg>
)

const IconDna = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path fillRule="evenodd" d="M11.484 2.17a.75.75 0 011.032 0 11.209 11.209 0 007.877 3.08.75.75 0 01.722.515 12.74 12.74 0 01.635 3.985c0 5.942-4.064 10.933-9.563 12.348a.749.749 0 01-.374 0C6.314 20.683 2.25 15.692 2.25 9.75c0-1.39.223-2.73.635-3.985a.75.75 0 01.722-.516l.143.001c2.996 0 5.718-1.17 7.734-3.08zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zM12 15a.75.75 0 100 1.5.75.75 0 000-1.5z" clipRule="evenodd" />
  </svg>
)

const IconMentor = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
    <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 13.18v1.27a1.5 1.5 0 00-.14 2.508c-.09.38-.222.753-.397 1.11.452.213.901.434 1.346.661a6.729 6.729 0 00.551-1.608 1.5 1.5 0 00.14-2.67v-.645a48.549 48.549 0 013.44 1.668 2.25 2.25 0 002.12 0z" />
    <path d="M4.462 19.462c.42-.419.753-.89 1-1.394.453.213.902.434 1.347.661a6.743 6.743 0 01-1.286 1.794.75.75 0 11-1.06-1.06z" />
  </svg>
)

const IconTarget = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
)

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0" aria-hidden="true">
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
  </svg>
)

const IconArrow = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
    <path fillRule="evenodd" d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
)

/* ─── Focus card data ─── */
const FOCUS_CARDS = [
  {
    icon: <IconCamera />,
    title: 'Kamera & Anlatım',
    desc: 'Kameranın karşısında özgüvenli olmak, doğru beden dili, sesi kullanmak ve hedef kitlenin diline uygun içerik üretmek.',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    border: 'border-orange-100',
  },
  {
    icon: <IconTarget />,
    title: 'Platform & Algoritma',
    desc: 'Instagram, LinkedIn, YouTube ve TikTok\'ta içerik stratejisi; algoritma okuryazarlığı ve organik büyüme yaklaşımı.',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    border: 'border-violet-100',
  },
  {
    icon: <IconDna />,
    title: 'İçerik DNA Analizi',
    desc: 'Her katılımcıya özgü içerik kimliği, anlatım tarzı ve platform stratejisi oluşturan yapay zeka destekli analiz raporu.',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-500',
    border: 'border-pink-100',
  },
  {
    icon: <IconMentor />,
    title: 'Mentor Geri Bildirimi',
    desc: 'Haftalık görev teslimi, birebir revizyon döngüsü ve alanında deneyimli mentor eşliğinde sürekli gelişim.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-500',
    border: 'border-emerald-100',
  },
]

/* ─── Approach items ─── */
const APPROACH_ITEMS = [
  'Dijital içerik üretimi pratiği',
  'Kamera karşısında özgüven ve sunum teknikleri',
  'Platform mantığı ve algoritma okuryazarlığı',
  'Sağlık iletişimi ve etik bilim aktarımı',
  'İçerik DNA analizi ve kişisel strateji',
  'Haftalık görev, teslim, revizyon ve değerlendirme döngüsü',
  'Mentor birebir geri bildirimi',
  'İstanbul yüz yüze bootcamp çalıştayı',
]

/* ─── Timeline steps ─── */
const TIMELINE_STEPS = [
  {
    num: '01',
    phase: 'Başvuru & Seçim',
    desc: 'Başvuru formu ve içerik DNA testi tamamlanır. Değerlendirme sonucunda 10 kişilik seçkin kadro belirlenir.',
    color: 'orange',
  },
  {
    num: '02',
    phase: 'Online Eğitimler',
    desc: 'İçerik üretimi, sağlık iletişimi, platform stratejisi ve algoritma okuryazarlığı üzerine çevrimiçi modüller.',
    color: 'pink',
  },
  {
    num: '03',
    phase: 'Haftalık Görevler',
    desc: 'Gerçek üretim pratiği: haftalık görev teslimi, mentor incelemesi, revizyon ve değerlendirme döngüsü.',
    color: 'violet',
  },
  {
    num: '04',
    phase: 'İstanbul Bootcamp',
    desc: 'Yüz yüze çalıştaylar, kamera pratiği ve takım etkileşimiyle teorinin pratikle buluştuğu yoğun program haftası.',
    color: 'emerald',
  },
  {
    num: '05',
    phase: 'Sertifikasyon',
    desc: 'Program tamamlama sertifikası, portfolyo ve dijital sağlık liderliği ağına dahil olma.',
    color: 'orange',
  },
]

const TIMELINE_COLORS = {
  orange:  { dot: 'from-orange-400 to-pink-500',  line: 'bg-orange-400', text: 'text-orange-500', badge: 'bg-orange-50 border-orange-200 text-orange-600' },
  pink:    { dot: 'from-pink-500 to-rose-500',     line: 'bg-pink-400',   text: 'text-pink-500',   badge: 'bg-pink-50 border-pink-200 text-pink-600' },
  violet:  { dot: 'from-violet-500 to-purple-600', line: 'bg-violet-400', text: 'text-violet-500', badge: 'bg-violet-50 border-violet-200 text-violet-600' },
  emerald: { dot: 'from-emerald-400 to-teal-500',  line: 'bg-emerald-400',text: 'text-emerald-500',badge: 'bg-emerald-50 border-emerald-200 text-emerald-600' },
}

export default function Hakkinda() {
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
              Kurumsal
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
              Geleceğin Dijital <span className="gradient-text">Sağlık Liderleri</span>
            </h1>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl">
              Sağlık profesyonellerinin dijital dünyada daha bilinçli, etkili ve sorumlu içerik üreticilerine dönüşmesi için tasarlanmış gelişim programı.
            </p>
          </div>
        </section>

        {/* ─── What is the program? ─── */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Program Nedir?
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  Sağlık bilgisini{' '}
                  <span style={{background:'linear-gradient(135deg,#f97316,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                    doğru aktarmanın
                  </span>{' '}
                  programı.
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Geleceğin Dijital Sağlık Liderleri; tıp, eczacılık, hemşirelik ve tüm sağlık disiplinlerinden gelen profesyonelleri dijital içerik üretimi, görünürlük ve sağlık iletişimi alanında güçlendirmek için tasarlanmış gelişim programıdır.
                </p>
                <p className="text-slate-600 text-base leading-relaxed">
                  Program, sadece kamera karşısında daha iyi görünmeyi değil; bilgiyi doğru, etik ve anlaşılır şekilde aktarma becerisini geliştirmeyi hedefler.
                </p>
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { num: '10', label: 'kişilik seçkin kadro', icon: '🎯', bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-600' },
                  { num: '2.5', label: 'ay yoğun program', icon: '📅', bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-600' },
                  { num: '5', label: 'program aşaması', icon: '🏆', bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-600' },
                  { num: '1', label: 'İstanbul bootcamp', icon: '🗺️', bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' },
                ].map(s => (
                  <div key={s.label} className={`${s.bg} border ${s.border} rounded-2xl p-5 text-center space-y-1 shadow-sm`}>
                    <div className="text-2xl">{s.icon}</div>
                    <div className={`text-3xl font-black ${s.text}`}>{s.num}</div>
                    <div className="text-slate-500 text-xs leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Why does it exist? ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
              Neden Var?
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-6 leading-tight">
              Doğru bilgi hayat kurtarır —{' '}
              <span style={{background:'linear-gradient(135deg,#7c3aed,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                ama önce erişilmeli.
              </span>
            </h2>
            <p className="text-slate-600 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-12">
              Dijital platformlarda sağlık yanlış bilgisi hızla yayılıyor. Görünür olmak kadar <strong>güvenilir, anlaşılır ve sorumlu</strong> olmak da önemli. Bu program, sağlık profesyonellerinin sesini güçlendirmeyi amaçlar.
            </p>

            {/* 3-column highlight cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '🔬', title: 'Bilimsel Doğruluk', desc: 'İçerik üretiminde etik, doğruluk ve bilimsel sorumluluk ön planda.' },
                { icon: '📡', title: 'Dijital Erişim', desc: 'Doğru bilgiyi doğru formatta, doğru platformda doğru kitleye ulaştırma.' },
                { icon: '🤝', title: 'Toplumsal Sorumluluk', desc: 'Toplumun doğru bilgiye ulaşması için sesini yükseltmek.' },
              ].map(c => (
                <div key={c.title} className="bg-slate-50 border border-slate-100 rounded-2xl p-7 text-left shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="text-3xl mb-4">{c.icon}</div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{c.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Who is it for? ─── */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
                Kimler İçin?
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                Sağlık alanında ses olmak{' '}
                <span style={{background:'linear-gradient(135deg,#10b981,#0ea5e9)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                  isteyen herkes.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: '🎓',
                  title: 'Sağlık Öğrencileri',
                  desc: 'Tıp, eczacılık, hemşirelik ve tüm sağlık bilimleri alanında eğitim gören öğrenciler.',
                  bg: 'bg-white',
                  border: 'border-slate-100',
                },
                {
                  icon: '👩‍⚕️',
                  title: 'Sağlık Profesyonelleri',
                  desc: 'Mezun olmuş, pratisyen ya da uzman; dijital görünürlüğünü geliştirmek isteyen sağlık çalışanları.',
                  bg: 'bg-white',
                  border: 'border-slate-100',
                },
                {
                  icon: '📱',
                  title: 'İçerik Üretmeye Başlayanlar',
                  desc: 'Sosyal medyada içerik paylaşmak isteyen ama nereden başlayacağını bilmeyen sağlık alanı adayları.',
                  bg: 'bg-white',
                  border: 'border-slate-100',
                },
                {
                  icon: '📈',
                  title: 'Üretimini Stratejiye Dönüştürmek İsteyenler',
                  desc: 'Hâlihazırda içerik üreten ama bunu daha sistematik, etkili ve sürdürülebilir kılmak isteyen adaylar.',
                  bg: 'bg-white',
                  border: 'border-slate-100',
                },
              ].map(c => (
                <div key={c.title} className={`${c.bg} border ${c.border} rounded-2xl p-7 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex gap-5`}>
                  <div className="text-3xl flex-shrink-0">{c.icon}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1.5">{c.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Program Focus (4 cards) ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 bg-pink-50 border border-pink-200 text-pink-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
                Programın Odağı
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                Dört temel alan, bir dönüşüm.
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {FOCUS_CARDS.map(c => (
                <div
                  key={c.title}
                  className={`bg-white border ${c.border} rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group`}
                >
                  <div className={`w-14 h-14 rounded-2xl ${c.iconBg} ${c.iconColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {c.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 text-xl mb-3">{c.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Program Approach (checklist) ─── */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-5">
                <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                  Yaklaşım
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                  Teori değil,{' '}
                  <span style={{background:'linear-gradient(135deg,#f97316,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>
                    üretim.
                  </span>
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Program boyunca katılımcılar gerçek üretim pratikleriyle teorilerini hayata geçirir. Görev, teslim, revizyon ve değerlendirme döngüsü ile sürekli gelişim sağlanır.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Kısa sürede mucizevi sonuç vaat etmez. Disiplinli üretim, doğru anlatım, geri bildirim alma ve dijital dünyada daha bilinçli konumlanma pratiği kazandırır.
                </p>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-6">Program kapsamı</h3>
                <ul className="space-y-3.5">
                  {APPROACH_ITEMS.map(item => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <span className="mt-0.5 text-emerald-500"><IconCheck /></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Timeline ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider mb-6">
                Program Süreci
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                Ağustos'tan Ekim'e — <span style={{background:'linear-gradient(135deg,#7c3aed,#ec4899)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>5 Adım</span>
              </h2>
            </div>

            <div className="space-y-0">
              {TIMELINE_STEPS.map((step, idx) => {
                const c = TIMELINE_COLORS[step.color]
                const isLast = idx === TIMELINE_STEPS.length - 1
                return (
                  <div key={step.num} className="flex gap-6">
                    {/* Line + dot */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.dot} flex items-center justify-center text-white font-black text-sm shadow-md flex-shrink-0 z-10`}>
                        {step.num}
                      </div>
                      {!isLast && (
                        <div className="w-0.5 flex-1 mt-2 mb-2 bg-gradient-to-b from-slate-200 to-transparent min-h-[32px]" />
                      )}
                    </div>
                    {/* Content */}
                    <div className={`pb-8 flex-1 min-w-0`}>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-shadow duration-300">
                        <span className={`text-xs font-bold uppercase tracking-wider ${c.text} mb-1.5 block`}>{step.phase}</span>
                        <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── Marka Mutfağı vurgusu ─── */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-slate-100 rounded-3xl p-8 md:p-12 shadow-sm text-center space-y-5">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-orange-50 border border-orange-200">
                <span className="text-xl">👨‍🍳</span>
                <span className="text-orange-600 font-bold text-xs tracking-wide">Marka Mutfağı</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                Programın Arkasındaki Deneyim
              </h2>
              <p className="text-slate-600 text-base leading-relaxed max-w-2xl mx-auto">
                Programın tasarım, operasyon ve dijital içerik yaklaşımı <strong>Marka Mutfağı</strong> tarafından geliştirilmiştir. Marka Mutfağı, içerik stratejisi, marka iletişimi ve dijital görünürlük alanındaki deneyimini bu programın yapısına taşır.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xl mx-auto">
                Müfredat, mentorluk desteği ve bootcamp organizasyonu Marka Mutfağı ekibi koordinasyonunda yürütülmektedir.
              </p>
              <a
                href="https://markamutfagi.co"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors duration-200"
              >
                markamutfagi.co sitesini ziyaret et ↗
              </a>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl overflow-hidden text-center shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-pink-500 to-violet-600" />
              <div className="relative px-8 py-14 space-y-5">
                <h2 className="text-2xl md:text-3xl font-black text-white">
                  Kontenjan dolmadan başvurunu yap.
                </h2>
                <p className="text-white/85 text-base leading-relaxed max-w-xl mx-auto">
                  10 kişilik seçkin kadronun bir parçası olarak sağlığın dijital sesini güçlendir.
                </p>
                <div className="flex flex-wrap justify-center gap-4 pt-2">
                  <a
                    href="https://markamutfagi.co/saglikliderleri/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-orange-500 font-bold px-8 py-3.5 rounded-2xl text-base inline-flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Hemen Başvur
                    <IconArrow />
                  </a>
                  <Link
                    to="/"
                    className="bg-white/10 border border-white/20 text-white font-bold px-8 py-3.5 rounded-2xl text-base inline-flex items-center gap-2 hover:bg-white/20 transition-all duration-300"
                  >
                    Ana Sayfaya Dön
                  </Link>
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
