interface Props {
  liveCount: number
}

export function Header({ liveCount }: Props) {
  const now = new Date()
  const dayName = now.toLocaleDateString('pl-PL', { weekday: 'long' })
  const dateStr = now.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <header className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700/60 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight text-white">
            Score<span className="text-orange-500">Live</span>
          </span>
        </div>
        {liveCount > 0 && (
          <div className="flex items-center gap-1.5 bg-red-600/20 border border-red-500/40 rounded-full px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-bold">{liveCount} LIVE</span>
          </div>
        )}
      </div>
      <div className="px-4 pb-2">
        <p className="text-gray-400 text-xs capitalize">
          {dayName}, {dateStr}
        </p>
      </div>
    </header>
  )
}
