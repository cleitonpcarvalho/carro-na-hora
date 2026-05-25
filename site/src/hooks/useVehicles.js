import { useState, useEffect } from 'react'
import api from '../services/api'

export function useVehicles(featuredOnly = false) {
  const [vehicles, setVehicles] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    api.getVehicles(featuredOnly)
      .then(setVehicles)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [featuredOnly])

  return { vehicles, loading, error }
}
