import axios from 'axios'
import type { Match, LeagueGroup } from '../types'
import { mockMatches } from '../data/mockMatches'

const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY as string | undefined
const BASE_URL = 'https://v3.football.api-sports.io'

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
  // Sort: live first, then by league name
  return Array.from(map.values()).sort((a, b) => {
    const aLive = a.matches.some((m) => m.isLive) ? 0 : 1
    const bLive = b.matches.some((m) => m.isLive) ? 0 : 1
    return aLive - bLive || a.leagueName.localeCompare(b.leagueName)
  })
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
    score: {
      home: f.goals.home,
      away: f.goals.away,
    },
    isLive: liveStatuses.includes(status),
  }
}

export async function fetchTodayMatches(): Promise<LeagueGroup[]> {
  if (!API_KEY) {
    return groupByLeague(mockMatches)
  }

  const dateStr = new Date().toISOString().split('T')[0]
  try {
    const { data } = await axios.get(`${BASE_URL}/fixtures`, {
      headers: {
        'x-apisports-key': API_KEY,
      },
      params: { date: dateStr },
      timeout: 8000,
    })
    const matches: Match[] = (data.response ?? []).map(mapApiMatch)
    return groupByLeague(matches.length ? matches : mockMatches)
  } catch {
    return groupByLeague(mockMatches)
  }
}
