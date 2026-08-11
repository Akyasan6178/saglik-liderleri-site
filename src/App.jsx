import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AnaSayfa from './pages/AnaSayfa'
import Login from './pages/Login'
import AdminPanel from './pages/AdminPanel'
import MentorPanel from './pages/MentorPanel'
import KatilimciPanel from './pages/KatilimciPanel'
import Hakkinda from './pages/Hakkinda'
import Gizlilik from './pages/Gizlilik'
import Iletisim from './pages/Iletisim'
import AuthGuard from './components/AuthGuard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hakkinda" element={<Hakkinda />} />
        <Route path="/gizlilik" element={<Gizlilik />} />
        <Route path="/iletisim" element={<Iletisim />} />
        
        {/* Protected Routes */}
        <Route path="/admin" element={
          <AuthGuard allowedRoles={['Admin']}>
            <AdminPanel />
          </AuthGuard>
        } />
        <Route path="/mentor" element={
          <AuthGuard allowedRoles={['Mentor']}>
            <MentorPanel />
          </AuthGuard>
        } />
        <Route path="/katilimci" element={
          <AuthGuard allowedRoles={['Katılımcı', 'Katilimci']}>
            <KatilimciPanel />
          </AuthGuard>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default App
