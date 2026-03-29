import type { Match, Team } from '../types'
import { FormGuide } from './FormGuide'

interface Props {
  match: Match
}

function StatusBadge({ match }: { match: Match }) {
  if (match.status === 'FT') {
    return <span className="text-gray-400 text-xs font-medium">Koniec</span>
  }
  if (match.status === 'HT') {
    return <span className="text-yellow-600 text-xs font-bold">Przerwa</span>
  }
  if (match.status === 'CANC') {
    return <span className="text-gray-400 text-xs">Odwołany</span>
  }
  if (match.status === 'PST') {
    return <span className="text-gray-400 text-xs">Przełożony</span>
  }
  if (match.isLive && match.minute !== null) {
    return (
      <span className="text-red-500 text-xs font-bold tabular-nums">
        {match.minute}&apos;
      </span>
    )
  }
  const time = new Date(match.startTime).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
  })
  return <span className="text-gray-400 text-xs tabular-nums">{time}</span>
}

function ScoreDisplay({ match }: { match: Match }) {
  const { score, isLive, status } = match
  const hasScore = score.home !== null && score.away !== null

  if (!hasScore) {
    return <span className="text-gray-300 text-lg">-:-</span>
  }

  const scoreClass =
    status === 'FT'
      ? 'text-gray-400'
      : isLive
        ? 'text-gray-900 font-bold'
        : 'text-gray-700'

  return (
    <div className="flex items-center gap-1.5">
      {isLive && (
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
      )}
      <span className={`text-lg tabular-nums ${scoreClass}`}>
        {score.home}&nbsp;:&nbsp;{score.away}
      </span>
    </div>
  )
}

function TeamRow({ team, isWinner }: { team: Team; isWinner: boolean }) {
  return (
    <div className="flex items-start gap-2 py-0.5">
      {team.logo ? (
        <img src={team.logo} alt={team.name} className="w-4 h-4 object-contain flex-shrink-0 mt-0.5" />
      ) : (
        <div className="w-4 h-4 rounded-full bg-gray-300 flex-shrink-0 mt-0.5" />
      )}
      <div className="min-w-0">
        <span className={`text-sm truncate block ${isWinner ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>
          {team.name}
        </span>
        {team.form && <FormGuide form={team.form} />}
      </div>
    </div>
  )
}

export function MatchCard({ match }: Props) {
  const ftHome =
    match.status === 'FT' &&
    match.score.home !== null &&
    match.score.away !== null &&
    match.score.home > match.score.away

  const ftAway =
    match.status === 'FT' &&
    match.score.home !== null &&
    match.score.away !== null &&
    match.score.away > match.score.home

  return (
    <div
      className={`flex items-center px-4 py-3 border-b border-gray-100 transition-colors active:bg-gray-50 ${
        match.isLive ? 'bg-red-50/40' : 'bg-white'
      }`}
    >
      {/* Status column */}
      <div className="w-14 flex-shrink-0 flex flex-col items-center">
        <StatusBadge match={match} />
      </div>

      {/* Teams column */}
      <div className="flex-1 min-w-0 px-3">
        <TeamRow team={match.homeTeam} isWinner={ftHome} />
        <TeamRow team={match.awayTeam} isWinner={ftAway} />
      </div>

      {/* Score column */}
      <div className="w-20 flex-shrink-0 flex justify-end">
        <ScoreDisplay match={match} />
      </div>
    </div>
  )
}
