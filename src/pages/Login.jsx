import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../services/supabaseService'

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
      
      // Token ve rolü kaydet
      localStorage.setItem('access', data.access)
      localStorage.setItem('refresh', data.refresh)
      localStorage.setItem('role', data.role)
      localStorage.setItem('username', data.username)
      localStorage.setItem('user_email', data.email)
      
      // Role göre yönlendir
      const userRole = data.role
      if (userRole === 'Admin') {
        navigate('/admin')
      } else if (userRole === 'Mentor') {
        navigate('/mentor')
      } else if (userRole === 'Katilimci' || userRole === 'Katılımcı') {
        navigate('/katilimci')
      } else {
        navigate('/')
      }
      
    } catch (err) {
      setError(err.message || 'Giriş yapılamadı')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50/30 to-sky-50/40">
      {/* Soft background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange-100/50 blur-[80px]" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-sky-100/50 blur-[80px]" />
      </div>

      <div className="relative bg-white rounded-3xl p-12 text-center max-w-md w-full mx-4 shadow-2xl ring-1 ring-slate-100">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-white font-black text-xl">GD</span>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-3">Sisteme Giriş</h1>
        <p className="text-slate-400 mb-8 leading-relaxed">
          Geleceğin Dijital Sağlık Liderleri<br />
          Yönetim Paneli
        </p>
        
        {error && (
          <div className="mb-6 bg-red-50 text-red-600 text-sm py-3 px-4 rounded-xl border border-red-100 text-left">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="bg-slate-50 rounded-2xl p-6 mb-8 text-left space-y-4 shadow-inner">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">E-posta</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all text-sm"
              placeholder="E-posta adresiniz"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Şifre</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-orange-400 transition-all text-sm"
              placeholder="Şifreniz"
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-sm hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="space-y-3">
          <a
            href="/"
            className="w-full py-3 rounded-xl border border-slate-200 text-slate-500 font-semibold text-sm hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200 inline-flex items-center justify-center gap-2"
          >
            ← Ana Sayfaya Dön
          </a>
        </div>
      </div>
    </div>
  )
}
