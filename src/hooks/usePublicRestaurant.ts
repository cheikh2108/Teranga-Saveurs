import { useCallback, useEffect, useState } from 'react'
import { fetchPublicRestaurant, trackVisit } from '../lib/api'
import type { PublicRestaurant } from '../types/restaurant'

export function usePublicRestaurant() {
  const [data, setData] = useState<PublicRestaurant | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetchPublicRestaurant()
      .then((d) => {
        setData(d)
        setError(null)
      })
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!data) return
    if (sessionStorage.getItem('tacko_tracked')) return
    sessionStorage.setItem('tacko_tracked', '1')
    void trackVisit()
  }, [data])

  return { data, error, loading, reload: load }
}
