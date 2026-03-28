export type MatchStatus = 'NS' | '1H' | 'HT' | '2H' | 'FT' | 'AET' | 'PEN' | 'CANC' | 'PST'

export interface Team {
  id: number
  name: string
  shortName: string
  logo: string
}

export interface Score {
  home: number | null
  away: number | null
}

export interface Match {
  id: number
  league: {
    id: number
    name: string
    country: string
    logo: string
    flag: string
  }
  homeTeam: Team
  awayTeam: Team
  status: MatchStatus
  minute: number | null
  startTime: string
  score: Score
  isLive: boolean
}

export interface LeagueGroup {
  leagueId: number
  leagueName: string
  country: string
  logo: string
  flag: string
  matches: Match[]
}
