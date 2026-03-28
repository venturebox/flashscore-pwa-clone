import { DatePicker } from './DatePicker'

interface Props {
  liveCount: number
  date: Date
  onDateChange: (d: Date) => void
}

export function Header({ liveCount, date, onDateChange }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <span className="text-xl font-black tracking-tight text-gray-900 flex-shrink-0">
          Score<span className="text-orange-500">Live</span>
        </span>

        {/* Date picker — center */}
        <DatePicker date={date} onChange={onDateChange} />

        {/* Live badge */}
        <div className="w-20 flex justify-end flex-shrink-0">
          {liveCount > 0 && (
            <div className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-full px-2 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-600 text-xs font-bold">{liveCount} LIVE</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
