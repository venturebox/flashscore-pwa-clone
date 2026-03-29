import type { LeagueGroup } from '../types'

interface Props {
  groups: LeagueGroup[]
  selectedId: number | null
  onChange: (id: number | null) => void
}

export function LeagueFilter({ groups, selectedId, onChange }: Props) {
  if (groups.length <= 1) return null

  return (
    <div className="flex gap-2 px-4 py-2.5 overflow-x-auto bg-white border-b border-gray-200 scrollbar-hide">
      <button
        onClick={() => onChange(null)}
        className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
          selectedId === null
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Wszystkie
      </button>
      {groups.map((g) => {
        const liveCount = g.matches.filter((m) => m.isLive).length
        return (
          <button
            key={g.leagueId}
            onClick={() => onChange(g.leagueId)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              selectedId === g.leagueId
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{g.flag}</span>
            <span>{g.leagueName}</span>
            {liveCount > 0 && (
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${selectedId === g.leagueId ? 'bg-white' : 'bg-red-500'}`} />
            )}
          </button>
        )
      })}
    </div>
  )
}
