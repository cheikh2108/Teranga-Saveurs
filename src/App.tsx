import { Navigate, Route, Routes } from 'react-router-dom'
import { ADMIN_ROUTE_BASE } from './lib/adminRoutes'
import { HomePage } from './pages/HomePage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path={ADMIN_ROUTE_BASE} element={<AdminLoginPage />} />
      <Route path={`${ADMIN_ROUTE_BASE}/dashboard`} element={<AdminDashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
