import { useState, useEffect } from 'react'
import AdminLayout from '../components/AdminLayout'
import api from '../services/api'

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getVehicles(), api.getSettings()])
      .then(([v, s]) => { setVehicles(v); setSettings(s) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Total de Viaturas', value: vehicles.length },
    { label: 'Viaturas em Destaque', value: vehicles.filter(v => v.is_featured).length },
    { label: 'Viaturas Activas', value: vehicles.filter(v => v.is_active).length },
    {
      label: 'Última Publicação',
      value: settings.last_published
        ? new Date(settings.last_published).toLocaleDateString('pt-PT')
        : 'Nunca',
    },
  ]

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(s => (
            <div key={s.label} className="admin-card">
              <p className="text-xs text-muted font-semibold uppercase tracking-wide mb-1">{s.label}</p>
              <p className="text-3xl font-black text-brand-blue">{loading ? '—' : s.value}</p>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h2 className="text-lg font-black text-brand-blue mb-4">Viaturas Recentes</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="h-12 bg-light-bg rounded-xl animate-pulse" />)}
            </div>
          ) : vehicles.length === 0 ? (
            <p className="text-muted text-sm">Nenhuma viatura adicionada ainda.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-3 px-2 text-xs text-muted font-bold uppercase tracking-wide">Nome</th>
                    <th className="text-left py-3 px-2 text-xs text-muted font-bold uppercase tracking-wide">Marca</th>
                    <th className="text-left py-3 px-2 text-xs text-muted font-bold uppercase tracking-wide">Ano</th>
                    <th className="text-left py-3 px-2 text-xs text-muted font-bold uppercase tracking-wide">Preço</th>
                    <th className="text-left py-3 px-2 text-xs text-muted font-bold uppercase tracking-wide">Destaque</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.slice(0, 8).map(v => (
                    <tr key={v.id} className="border-b border-gray-50 hover:bg-light-bg transition-colors">
                      <td className="py-3 px-2 font-semibold text-brand-blue">{v.name}</td>
                      <td className="py-3 px-2 text-muted">{v.brand}</td>
                      <td className="py-3 px-2 text-muted">{v.year}</td>
                      <td className="py-3 px-2 text-muted">
                        {v.price
                          ? new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v.price)
                          : 'Consultar'}
                      </td>
                      <td className="py-3 px-2">
                        {v.is_featured
                          ? <span className="bg-brand-gold/15 text-brand-gold text-xs font-bold px-2 py-1 rounded-full">Sim</span>
                          : <span className="bg-gray-100 text-muted text-xs font-bold px-2 py-1 rounded-full">Não</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
