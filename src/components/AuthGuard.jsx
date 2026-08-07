import { Navigate, useLocation } from 'react-router-dom'

export default function AuthGuard({ children, allowedRoles }) {
  const token = localStorage.getItem('access')
  const role = localStorage.getItem('role')
  const location = useLocation()

  // Token yoksa doğrudan login'e yönlendir
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Eğer sayfa belirli rollere özgüyse ve kullanıcının rolü uymuyorsa erişimi engelle
  if (allowedRoles && !allowedRoles.includes(role)) {
    // İzinsiz erişim denemesinde kendi ana sayfasına veya login'e atabiliriz
    if (role === 'Admin') return <Navigate to="/admin" replace />
    if (role === 'Mentor') return <Navigate to="/mentor" replace />
    if (role === 'Katilimci' || role === 'Katılımcı') return <Navigate to="/katilimci" replace />
    return <Navigate to="/login" replace />
  }

  return children
}
