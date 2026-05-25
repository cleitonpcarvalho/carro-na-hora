import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import AdminViaturas from './pages/AdminViaturas'
import AdminContent from './pages/AdminContent'
import AdminMedia from './pages/AdminMedia'
import AdminSettings from './pages/AdminSettings'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/admin/viaturas" element={
            <ProtectedRoute><AdminViaturas /></ProtectedRoute>
          } />
          <Route path="/admin/content" element={
            <ProtectedRoute><AdminContent /></ProtectedRoute>
          } />
          <Route path="/admin/media" element={
            <ProtectedRoute><AdminMedia /></ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute><AdminSettings /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
