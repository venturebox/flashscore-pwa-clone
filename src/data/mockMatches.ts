import type { Match } from '../types'

const today = new Date()
const fmt = (h: number, m: number) => {
  const d = new Date(today)
  d.setHours(h, m, 0, 0)
  return d.toISOString()
}

export const mockMatches: Match[] = [
  // ── PREMIER LEAGUE ──────────────────────────────────────
  {
    id: 1001,
    league: { id: 39, name: 'Premier League', country: 'England', logo: '', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    homeTeam: { id: 40, name: 'Liverpool', shortName: 'LIV', logo: '' },
    awayTeam: { id: 42, name: 'Arsenal', shortName: 'ARS', logo: '' },
    status: '2H',
    minute: 67,
    startTime: fmt(15, 0),
    score: { home: 2, away: 1 },
    isLive: true,
  },
  {
    id: 1002,
    league: { id: 39, name: 'Premier League', country: 'England', logo: '', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    homeTeam: { id: 50, name: 'Manchester City', shortName: 'MCI', logo: '' },
    awayTeam: { id: 49, name: 'Chelsea', shortName: 'CHE', logo: '' },
    status: 'HT',
    minute: 45,
    startTime: fmt(15, 0),
    score: { home: 1, away: 1 },
    isLive: true,
  },
  {
    id: 1003,
    league: { id: 39, name: 'Premier League', country: 'England', logo: '', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    homeTeam: { id: 33, name: 'Manchester Utd', shortName: 'MUN', logo: '' },
    awayTeam: { id: 47, name: 'Tottenham', shortName: 'TOT', logo: '' },
    status: 'NS',
    minute: null,
    startTime: fmt(17, 30),
    score: { home: null, away: null },
    isLive: false,
  },
  {
    id: 1004,
    league: { id: 39, name: 'Premier League', country: 'England', logo: '', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
    homeTeam: { id: 34, name: 'Newcastle', shortName: 'NEW', logo: '' },
    awayTeam: { id: 51, name: 'Brighton', shortName: 'BRI', logo: '' },
    status: 'FT',
    minute: 90,
    startTime: fmt(13, 0),
    score: { home: 3, away: 0 },
    isLive: false,
  },

  // ── LA LIGA ─────────────────────────────────────────────
  {
    id: 2001,
    league: { id: 140, name: 'La Liga', country: 'Spain', logo: '', flag: '🇪🇸' },
    homeTeam: { id: 541, name: 'Real Madrid', shortName: 'RMA', logo: '' },
    awayTeam: { id: 529, name: 'Barcelona', shortName: 'BAR', logo: '' },
    status: '1H',
    minute: 23,
    startTime: fmt(16, 0),
    score: { home: 0, away: 0 },
    isLive: true,
  },
  {
    id: 2002,
    league: { id: 140, name: 'La Liga', country: 'Spain', logo: '', flag: '🇪🇸' },
    homeTeam: { id: 536, name: 'Sevilla', shortName: 'SEV', logo: '' },
    awayTeam: { id: 530, name: 'Atletico Madrid', shortName: 'ATM', logo: '' },
    status: 'NS',
    minute: null,
    startTime: fmt(20, 0),
    score: { home: null, away: null },
    isLive: false,
  },
  {
    id: 2003,
    league: { id: 140, name: 'La Liga', country: 'Spain', logo: '', flag: '🇪🇸' },
    homeTeam: { id: 532, name: 'Valencia', shortName: 'VAL', logo: '' },
    awayTeam: { id: 538, name: 'Celta Vigo', shortName: 'CEL', logo: '' },
    status: 'FT',
    minute: 90,
    startTime: fmt(14, 0),
    score: { home: 1, away: 2 },
    isLive: false,
  },

  // ── BUNDESLIGA ───────────────────────────────────────────
  {
    id: 3001,
    league: { id: 78, name: 'Bundesliga', country: 'Germany', logo: '', flag: '🇩🇪' },
    homeTeam: { id: 157, name: 'Bayern Munich', shortName: 'BAY', logo: '' },
    awayTeam: { id: 165, name: 'Borussia Dortmund', shortName: 'BVB', logo: '' },
    status: '2H',
    minute: 78,
    startTime: fmt(15, 30),
    score: { home: 3, away: 2 },
    isLive: true,
  },
  {
    id: 3002,
    league: { id: 78, name: 'Bundesliga', country: 'Germany', logo: '', flag: '🇩🇪' },
    homeTeam: { id: 173, name: 'RB Leipzig', shortName: 'RBL', logo: '' },
    awayTeam: { id: 168, name: 'Bayer Leverkusen', shortName: 'B04', logo: '' },
    status: 'NS',
    minute: null,
    startTime: fmt(18, 30),
    score: { home: null, away: null },
    isLive: false,
  },

  // ── SERIE A ──────────────────────────────────────────────
  {
    id: 4001,
    league: { id: 135, name: 'Serie A', country: 'Italy', logo: '', flag: '🇮🇹' },
    homeTeam: { id: 489, name: 'AC Milan', shortName: 'MIL', logo: '' },
    awayTeam: { id: 505, name: 'Inter', shortName: 'INT', logo: '' },
    status: '1H',
    minute: 38,
    startTime: fmt(18, 0),
    score: { home: 1, away: 0 },
    isLive: true,
  },
  {
    id: 4002,
    league: { id: 135, name: 'Serie A', country: 'Italy', logo: '', flag: '🇮🇹' },
    homeTeam: { id: 496, name: 'Juventus', shortName: 'JUV', logo: '' },
    awayTeam: { id: 497, name: 'AS Roma', shortName: 'ROM', logo: '' },
    status: 'FT',
    minute: 90,
    startTime: fmt(12, 30),
    score: { home: 2, away: 2 },
    isLive: false,
  },

  // ── EKSTRAKLASA ──────────────────────────────────────────
  {
    id: 5001,
    league: { id: 106, name: 'Ekstraklasa', country: 'Poland', logo: '', flag: '🇵🇱' },
    homeTeam: { id: 600, name: 'Legia Warszawa', shortName: 'LEG', logo: '' },
    awayTeam: { id: 601, name: 'Lech Poznań', shortName: 'LEP', logo: '' },
    status: '2H',
    minute: 55,
    startTime: fmt(17, 0),
    score: { home: 1, away: 1 },
    isLive: true,
  },
  {
    id: 5002,
    league: { id: 106, name: 'Ekstraklasa', country: 'Poland', logo: '', flag: '🇵🇱' },
    homeTeam: { id: 602, name: 'Wisła Kraków', shortName: 'WIS', logo: '' },
    awayTeam: { id: 603, name: 'Górnik Zabrze', shortName: 'GOR', logo: '' },
    status: 'NS',
    minute: null,
    startTime: fmt(19, 30),
    score: { home: null, away: null },
    isLive: false,
  },
]
