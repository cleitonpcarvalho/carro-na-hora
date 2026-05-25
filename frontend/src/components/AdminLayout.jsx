import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const NAV = [
  {
    label: 'Dashboard',
    to: '/admin/dashboard',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  },
  {
    label: 'Viaturas',
    to: '/admin/viaturas',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />,
  },
  {
    label: 'Conteúdo',
    to: '/admin/content',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />,
  },
  {
    label: 'Media',
    to: '/admin/media',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />,
  },
  {
    label: 'Configurações',
    to: '/admin/settings',
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
  },
]

export default function AdminLayout({ children, title }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [publishing, setPublishing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handlePublish = async () => {
    setPublishing(true)
    try {
      await api.publishSettings()
      alert('Alterações publicadas com sucesso!')
    } catch {
      alert('Erro ao publicar. Tente novamente.')
    } finally {
      setPublishing(false)
    }
  }

  const siteUrl = import.meta.env.VITE_SITE_URL || '/'

  return (
    <div className="min-h-screen flex bg-light-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-brand-blue z-30 flex flex-col
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10">
          <img
            src="/assets/logo-dark.png"
            alt="Carro da Hora"
            className="h-10 w-auto object-contain mb-1"
          />
          <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mt-2">
            Painel Admin
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`sidebar-item ${location.pathname === item.to ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {item.icon}
              </svg>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="px-4 py-3 mb-2">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-white/40 text-xs truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="sidebar-item w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-brand-blue"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-lg font-black text-brand-blue">{title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs px-4 py-2"
            >
              Ver Site
            </a>
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="btn-primary text-xs px-4 py-2 disabled:opacity-60"
            >
              {publishing ? 'A publicar...' : 'Publicar Alterações'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
