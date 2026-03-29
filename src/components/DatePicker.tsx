import { useState, useRef, useEffect } from 'react'

interface Props {
  date: Date
  onChange: (d: Date) => void
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

const DAYS_PL = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd']
const MONTHS_PL = [
  'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
  'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień',
]

export function DatePicker({ date, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(date.getFullYear())
  const [viewMonth, setViewMonth] = useState(date.getMonth())
  const ref = useRef<HTMLDivElement>(null)
  const today = startOfDay(new Date())

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Sync view when date changes externally (arrow nav)
  useEffect(() => {
    setViewYear(date.getFullYear())
    setViewMonth(date.getMonth())
  }, [date])

  function shift(days: number) {
    const d = startOfDay(date)
    d.setDate(d.getDate() + days)
    onChange(d)
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function selectDay(d: Date) {
    onChange(startOfDay(d))
    setOpen(false)
  }

  // Build calendar grid (Mon-first)
  const firstDay = new Date(viewYear, viewMonth, 1)
  const lastDay = new Date(viewYear, viewMonth + 1, 0)
  // Monday=0 offset
  const startOffset = (firstDay.getDay() + 6) % 7
  const cells: (Date | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: lastDay.getDate() }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ]
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null)

  const isToday = isSameDay(date, today)
  const label = date.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' })

  return (
    <div ref={ref} className="relative flex items-center gap-1">
      {/* Prev day */}
      <button
        onClick={() => shift(-1)}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        aria-label="Poprzedni dzień"
      >
        ‹
      </button>

      {/* Date button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
          isToday
            ? 'bg-orange-500 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <span>📅</span>
        <span className="capitalize">{isToday ? 'Dziś' : label}</span>
      </button>

      {/* Next day */}
      <button
        onClick={() => shift(1)}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
        aria-label="Następny dzień"
      >
        ›
      </button>

      {/* Calendar popup */}
      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-50 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-72">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={prevMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 font-bold"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-gray-800">
              {MONTHS_PL[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 font-bold"
            >
              ›
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAYS_PL.map(d => (
              <div key={d} className="text-center text-[10px] font-semibold text-gray-400 py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((cell, i) => {
              if (!cell) return <div key={i} />
              const isSelected = isSameDay(cell, date)
              const isTodayCell = isSameDay(cell, today)
              return (
                <button
                  key={i}
                  onClick={() => selectDay(cell)}
                  className={`h-8 w-8 mx-auto flex items-center justify-center rounded-full text-sm transition-colors
                    ${isSelected ? 'bg-orange-500 text-white font-bold' : ''}
                    ${!isSelected && isTodayCell ? 'border border-orange-400 text-orange-500 font-semibold' : ''}
                    ${!isSelected && !isTodayCell ? 'text-gray-700 hover:bg-gray-100' : ''}
                  `}
                >
                  {cell.getDate()}
                </button>
              )
            })}
          </div>

          {/* Jump to today */}
          {!isToday && (
            <button
              onClick={() => selectDay(today)}
              className="mt-3 w-full text-xs text-orange-500 font-semibold hover:underline"
            >
              Wróć do dziś
            </button>
          )}
        </div>
      )}
    </div>
  )
}
