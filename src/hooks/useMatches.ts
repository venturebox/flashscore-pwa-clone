import { useState, useEffect, useCallback } from 'react'
import type { LeagueGroup } from '../types'
import { fetchTodayMatches } from '../services/api'

const REFRESH_INTERVAL = 60_000 // 60s

export function useMatches() {
  const [groups, setGroups] = useState<LeagueGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await fetchTodayMatches()
      setGroups(data)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      setError('Nie udało się pobrać danych')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
    const interval = setInterval(load, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [load])

  const totalLive = groups.reduce((acc, g) => acc + g.matches.filter((m) => m.isLive).length, 0)

  return { groups, loading, error, lastUpdated, totalLive, refresh: load }
}
