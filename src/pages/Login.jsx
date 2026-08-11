import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser, logoutUser } from '../services/supabaseService'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await loginUser(email, password)

      // Legacy uyumluluğu için geçici localStorage kaydı
      const roleDisplayName = data.role === 'admin' ? 'Admin' : data.role === 'mentor' ? 'Mentor' : 'Katılımcı'
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      localStorage.setItem('role', roleDisplayName)
      localStorage.setItem('username', data.username)
      localStorage.setItem('user_email', data.email)

      // Role göre yönlendir
      const userRole = data.role?.toLowerCase()
      if (userRole === 'admin') {
        navigate('/admin', { replace: true })
      } else if (userRole === 'mentor') {
        navigate('/mentor', { replace: true })
      } else if (userRole === 'katilimci') {
        navigate('/katilimci', { replace: true })
      } else {
        setError('Hesabınıza tanımlı geçerli bir rol bulunamadı.')
        await logoutUser()
      }

    } catch (err) {
      setError(err.message || 'Giriş yapılamadı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-sky-50/40 p-4 overflow-x-hidden font-sans">
      {/* Soft background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-orange-100/50 blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-sky-100/50 blur-[80px]" />
      </div>

      <div className="relative bg-white rounded-3xl p-6 sm:p-10 md:p-12 text-center max-w-md w-full shadow-2xl ring-1 ring-slate-100 my-4">
        {/* Logo */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
          <span className="text-white font-black text-lg sm:text-xl">GD</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 sm:mb-3">Giriş</h1>
        <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8 leading-relaxed">
          Geleceğin Dijital Sağlık Liderleri<br />
          Yönetim Paneli
        </p>

        {error && (
          <div className="mb-5 sm:mb-6 bg-red-50 text-red-600 text-xs sm:text-sm py-2.5 sm:py-3 px-3.5 sm:px-4 rounded-xl border border-red-100 text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="bg-slate-50 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-left space-y-4 shadow-inner">
          <div>
            <label className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-10 sm:h-11 px-3.5 sm:px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all text-xs sm:text-sm"
              placeholder="E-posta adresiniz"
            />
          </div>
          <div>
            <label className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-10 sm:h-11 px-3.5 sm:px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all text-xs sm:text-sm"
              placeholder="Şifreniz"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-xs sm:text-sm hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="space-y-3">
          <a
            href="/"
            className="w-full py-2.5 sm:py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-xs sm:text-sm hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 inline-flex items-center justify-center gap-2"
          >
            ← Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  )
}
