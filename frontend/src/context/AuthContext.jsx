import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { setLoading(false); return }
    api.me()
      .then(u => setUser(u))
      .catch(() => localStorage.removeItem('admin_token'))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.login(email, password)
    localStorage.setItem('admin_token', res.token)
    setUser(res.user)
    return res
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
