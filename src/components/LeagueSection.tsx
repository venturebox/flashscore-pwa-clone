import type { LeagueGroup } from '../types'
import { MatchCard } from './MatchCard'

interface Props {
  group: LeagueGroup
}

export function LeagueSection({ group }: Props) {
  const liveCount = group.matches.filter((m) => m.isLive).length

  return (
    <section className="mb-1">
      {/* League header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 border-b border-gray-700/40">
        <span className="text-base leading-none">{group.flag}</span>
        {group.logo && (
          <img src={group.logo} alt={group.leagueName} className="w-4 h-4 object-contain" />
        )}
        <span className="text-gray-200 text-sm font-semibold flex-1 truncate">
          {group.leagueName}
        </span>
        <span className="text-gray-500 text-xs">{group.country}</span>
        {liveCount > 0 && (
          <span className="flex items-center gap-1 text-red-500 text-xs font-bold ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {liveCount}
          </span>
        )}
      </div>

      {/* Matches */}
      {group.matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </section>
  )
}
