import type { Match, MatchStatus } from '../types'

function dayStart(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

function todayStart() {
  return dayStart(new Date())
}

type RawMatch = Omit<Match, 'status' | 'minute' | 'score' | 'isLive'>

const LIVE_STATUSES: MatchStatus[] = ['1H', 'HT', '2H']

/** Adjust match status/score depending on which day is selected. */
function adapt(
  raw: RawMatch,
  todayStatus: MatchStatus,
  todayMinute: number | null,
  todayScore: { home: number | null; away: number | null },
  pastScore: { home: number; away: number },
  day: Date,
): Match {
  const ts = dayStart(day)
  const today = todayStart()

  if (ts < today) {
    // Past day — show finished result
    return { ...raw, status: 'FT', minute: 90, score: pastScore, isLive: false }
  }
  if (ts > today) {
    // Future day — scheduled only
    return { ...raw, status: 'NS', minute: null, score: { home: null, away: null }, isLive: false }
  }
  // Today — show live/scheduled mix
  return {
    ...raw,
    status: todayStatus,
    minute: todayMinute,
    score: todayScore,
    isLive: LIVE_STATUSES.includes(todayStatus),
  }
}

export function getMockMatchesForDate(day: Date): Match[] {
  const fmt = (h: number, m: number) => {
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m, 0, 0).toISOString()
  }

  const base = (
    id: number,
    leagueId: number, leagueName: string, country: string, flag: string,
    homeId: number, homeName: string, homeForm: string,
    awayId: number, awayName: string, awayForm: string,
    hour: number, min: number,
  ): RawMatch => ({
    id,
    league: { id: leagueId, name: leagueName, country, logo: '', flag },
    homeTeam: { id: homeId, name: homeName, shortName: homeName.slice(0, 3).toUpperCase(), logo: '', form: homeForm },
    awayTeam: { id: awayId, name: awayName, shortName: awayName.slice(0, 3).toUpperCase(), logo: '', form: awayForm },
    startTime: fmt(hour, min),
  })

  return [
    // ── PREMIER LEAGUE ────────────────────────────────────
    adapt(
      base(1001, 39, 'Premier League', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 40, 'Liverpool', 'WWWDWWWLWW', 42, 'Arsenal', 'WDWWLWWDWW', 15, 0),
      '2H', 67, { home: 2, away: 1 }, { home: 2, away: 1 }, day,
    ),
    adapt(
      base(1002, 39, 'Premier League', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 50, 'Manchester City', 'WLWWDWWWLW', 49, 'Chelsea', 'DWLDWWDLWW', 15, 0),
      'HT', 45, { home: 1, away: 1 }, { home: 1, away: 1 }, day,
    ),
    adapt(
      base(1003, 39, 'Premier League', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 33, 'Manchester Utd', 'LLDWLLWLLD', 47, 'Tottenham', 'WDLLWWDLWL', 17, 30),
      'NS', null, { home: null, away: null }, { home: 0, away: 2 }, day,
    ),
    adapt(
      base(1004, 39, 'Premier League', 'England', '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 34, 'Newcastle', 'WWDWWLWWDW', 51, 'Brighton', 'DWWLDWDWWL', 13, 0),
      'FT', 90, { home: 3, away: 0 }, { home: 3, away: 0 }, day,
    ),

    // ── LA LIGA ───────────────────────────────────────────
    adapt(
      base(2001, 140, 'La Liga', 'Spain', '🇪🇸', 541, 'Real Madrid', 'WWWLWWWDWW', 529, 'Barcelona', 'WWDWWWLWWW', 16, 0),
      '1H', 23, { home: 0, away: 0 }, { home: 1, away: 3 }, day,
    ),
    adapt(
      base(2002, 140, 'La Liga', 'Spain', '🇪🇸', 536, 'Sevilla', 'LDWLLWDLWL', 530, 'Atletico Madrid', 'WDWWLWWDDW', 20, 0),
      'NS', null, { home: null, away: null }, { home: 0, away: 1 }, day,
    ),
    adapt(
      base(2003, 140, 'La Liga', 'Spain', '🇪🇸', 532, 'Valencia', 'LLDWLLDWLL', 538, 'Celta Vigo', 'WLWDWLWWDL', 14, 0),
      'FT', 90, { home: 1, away: 2 }, { home: 1, away: 2 }, day,
    ),

    // ── BUNDESLIGA ────────────────────────────────────────
    adapt(
      base(3001, 78, 'Bundesliga', 'Germany', '🇩🇪', 157, 'Bayern Munich', 'WWWWLWWWWW', 165, 'Borussia Dortmund', 'WDWLWWDWLW', 15, 30),
      '2H', 78, { home: 3, away: 2 }, { home: 3, away: 2 }, day,
    ),
    adapt(
      base(3002, 78, 'Bundesliga', 'Germany', '🇩🇪', 173, 'RB Leipzig', 'WWLDWWWLDW', 168, 'Bayer Leverkusen', 'WWWDWWWWDW', 18, 30),
      'NS', null, { home: null, away: null }, { home: 2, away: 0 }, day,
    ),

    // ── SERIE A ───────────────────────────────────────────
    adapt(
      base(4001, 135, 'Serie A', 'Italy', '🇮🇹', 489, 'AC Milan', 'WDWWLWDWWL', 505, 'Inter', 'WWWDWWWLWW', 18, 0),
      '1H', 38, { home: 1, away: 0 }, { home: 1, away: 2 }, day,
    ),
    adapt(
      base(4002, 135, 'Serie A', 'Italy', '🇮🇹', 496, 'Juventus', 'DWWLDWWLDD', 497, 'AS Roma', 'WLDWWLWDLW', 12, 30),
      'FT', 90, { home: 2, away: 2 }, { home: 2, away: 2 }, day,
    ),

    // ── EKSTRAKLASA ───────────────────────────────────────
    adapt(
      base(5001, 106, 'Ekstraklasa', 'Poland', '🇵🇱', 600, 'Legia Warszawa', 'WWDWWLWWDW', 601, 'Lech Poznań', 'WDLWWWDWLW', 17, 0),
      '2H', 55, { home: 1, away: 1 }, { home: 2, away: 0 }, day,
    ),
    adapt(
      base(5002, 106, 'Ekstraklasa', 'Poland', '🇵🇱', 602, 'Wisła Kraków', 'LLDWLWLLDW', 603, 'Górnik Zabrze', 'DWLWDLWWLD', 19, 30),
      'NS', null, { home: null, away: null }, { home: 1, away: 1 }, day,
    ),
  ]
}
