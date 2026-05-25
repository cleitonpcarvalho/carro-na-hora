import { useState, useEffect } from 'react'
import api from '../services/api'

export function useSettings() {
  const [settings, setSettings] = useState({})
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    api.getSettings()
      .then(setSettings)
      .catch(() => setSettings({}))
      .finally(() => setLoading(false))
  }, [])

  return { settings, loading }
}
