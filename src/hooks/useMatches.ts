import { useState, useEffect, useCallback, useRef } from 'react'
import type { LeagueGroup } from '../types'
import { fetchTodayMatches } from '../services/api'

const REFRESH_INTERVAL = 60_000

function isToday(d: Date) {
  const t = new Date()
  return d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
}

export function useMatches(date: Date) {
  const [groups, setGroups] = useState<LeagueGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const dateKey = date.toLocaleDateString('sv-SE')
  const prevKey = useRef<string | null>(null)

  const load = useCallback(async () => {
    try {
      const data = await fetchTodayMatches(date)
      setGroups(data)
      setLastUpdated(new Date())
      setError(null)
    } catch {
      setError('Nie udało się pobrać danych')
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey])

  useEffect(() => {
    if (prevKey.current !== dateKey) {
      setLoading(true)
      setGroups([])
      prevKey.current = dateKey
    }
    load()
    // Auto-refresh only for today
    if (!isToday(date)) return
    const interval = setInterval(load, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [load])

  const totalLive = groups.reduce((acc, g) => acc + g.matches.filter((m) => m.isLive).length, 0)

  return { groups, loading, error, lastUpdated, totalLive, refresh: load }
}
