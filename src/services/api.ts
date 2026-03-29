import axios from 'axios'
import type { Match, LeagueGroup } from '../types'
import { getMockMatchesForDate } from '../data/mockMatches'

const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY as string | undefined
const BASE_URL = 'https://v3.football.api-sports.io'

// Form cache: teamId → form string (e.g. "WWDLW") — fetched once per session
const formCache = new Map<number, string>()

function calendarDayKey(d: Date): string {
  return d.toLocaleDateString('sv-SE')
}

function matchCalendarDayKey(match: Match): string {
  return new Date(match.startTime).toLocaleDateString('sv-SE')
}

/** Keep fixtures that fall on the same local calendar day as `day`. */
function filterMatchesForCalendarDay(matches: Match[], day: Date): Match[] {
  const key = calendarDayKey(day)
  return matches.filter((m) => matchCalendarDayKey(m) === key)
}

function groupByLeague(matches: Match[]): LeagueGroup[] {
  const map = new Map<number, LeagueGroup>()
  for (const match of matches) {
    const lg = match.league
    if (!map.has(lg.id)) {
      map.set(lg.id, {
        leagueId: lg.id,
        leagueName: lg.name,
        country: lg.country,
        logo: lg.logo,
        flag: lg.flag,
        matches: [],
      })
    }
    map.get(lg.id)!.matches.push(match)
  }
  return Array.from(map.values()).sort((a, b) => {
    const aLive = a.matches.some((m) => m.isLive) ? 0 : 1
    const bLive = b.matches.some((m) => m.isLive) ? 0 : 1
    return aLive - bLive || a.leagueName.localeCompare(b.leagueName)
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calcFormFromFixtures(fixtures: any[], teamId: number): string {
  return fixtures
    .slice(-10)
    .map((f: any) => {
      const isHome = f.teams.home.id === teamId
      const homeGoals: number = f.goals.home ?? 0
      const awayGoals: number = f.goals.away ?? 0
      const scored = isHome ? homeGoals : awayGoals
      const conceded = isHome ? awayGoals : homeGoals
      if (scored > conceded) return 'W'
      if (scored === conceded) return 'D'
      return 'L'
    })
    .join('')
}

async function fetchFormForTeam(teamId: number): Promise<string> {
  if (formCache.has(teamId)) return formCache.get(teamId)!
  try {
    const { data } = await axios.get(`${BASE_URL}/fixtures`, {
      headers: { 'x-apisports-key': API_KEY! },
      params: { team: teamId, last: 10, status: 'FT' },
      timeout: 8000,
    })
    const form = calcFormFromFixtures(data.response ?? [], teamId)
    formCache.set(teamId, form)
    return form
  } catch {
    return ''
  }
}

async function enrichMatchesWithForm(matches: Match[]): Promise<Match[]> {
  // Collect unique team IDs not yet cached
  const uncached = new Set<number>()
  for (const m of matches) {
    if (!formCache.has(m.homeTeam.id)) uncached.add(m.homeTeam.id)
    if (!formCache.has(m.awayTeam.id)) uncached.add(m.awayTeam.id)
  }

  // Fetch all in parallel (API-Football allows concurrent requests)
  await Promise.all([...uncached].map(fetchFormForTeam))

  return matches.map((m) => ({
    ...m,
    homeTeam: { ...m.homeTeam, form: formCache.get(m.homeTeam.id) ?? '' },
    awayTeam: { ...m.awayTeam, form: formCache.get(m.awayTeam.id) ?? '' },
  }))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapApiMatch(f: any): Match {
  const status = f.fixture.status.short as Match['status']
  const liveStatuses: Match['status'][] = ['1H', 'HT', '2H', 'AET']
  return {
    id: f.fixture.id,
    league: {
      id: f.league.id,
      name: f.league.name,
      country: f.league.country,
      logo: f.league.logo ?? '',
      flag: f.league.flag ?? '',
    },
    homeTeam: {
      id: f.teams.home.id,
      name: f.teams.home.name,
      shortName: f.teams.home.name.slice(0, 3).toUpperCase(),
      logo: f.teams.home.logo ?? '',
    },
    awayTeam: {
      id: f.teams.away.id,
      name: f.teams.away.name,
      shortName: f.teams.away.name.slice(0, 3).toUpperCase(),
      logo: f.teams.away.logo ?? '',
    },
    status,
    minute: f.fixture.status.elapsed ?? null,
    startTime: f.fixture.date,
    score: { home: f.goals.home, away: f.goals.away },
    isLive: liveStatuses.includes(status),
  }
}

export async function fetchTodayMatches(date: Date = new Date()): Promise<LeagueGroup[]> {
  const dateStr = calendarDayKey(date)

  if (!API_KEY) {
    return groupByLeague(getMockMatchesForDate(date))
  }

  try {
    const { data } = await axios.get(`${BASE_URL}/fixtures`, {
      headers: { 'x-apisports-key': API_KEY },
      params: { date: dateStr },
      timeout: 8000,
    })
    const raw: Match[] = (data.response ?? []).map(mapApiMatch)
    const base = raw.length
      ? filterMatchesForCalendarDay(raw, date)
      : getMockMatchesForDate(date)
    const matches = await enrichMatchesWithForm(base)
    return groupByLeague(matches)
  } catch {
    return groupByLeague(getMockMatchesForDate(date))
  }
}
