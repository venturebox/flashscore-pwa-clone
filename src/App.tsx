import { useState, useMemo } from 'react'
import { useMatches } from './hooks/useMatches'
import { Header } from './components/Header'
import { LeagueSection } from './components/LeagueSection'
import type { MatchStatus } from './types'

const FINISHED: MatchStatus[] = ['FT', 'AET', 'PEN']

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isToday(d: Date) {
  const t = new Date()
  return d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
}

function isPast(d: Date) {
  return startOfDay(d).getTime() < startOfDay(new Date()).getTime()
}

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Ładowanie wyników...</p>
    </div>
  )
}

function EmptyState({ date }: { date: Date }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 px-8 text-center">
      <span className="text-5xl">⚽</span>
      <p className="text-gray-700 font-semibold">Brak meczów</p>
      <p className="text-gray-400 text-sm">
        {isToday(date)
          ? 'Brak trwających i nadchodzących meczów.'
          : 'Brak meczów w wybranym dniu.'}
      </p>
    </div>
  )
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()))

  const { groups, loading, error, lastUpdated, totalLive, refresh } = useMatches(selectedDate)

  function handleDateChange(d: Date) {
    setSelectedDate(d)
  }

  // For today: hide finished matches (show only LIVE + upcoming).
  // For past days: show all matches (FT results).
  // For future days: show all matches (NS scheduled).
  const activeGroups = useMemo(() => {
    if (!isToday(selectedDate)) return groups
    return groups
      .map((g) => ({ ...g, matches: g.matches.filter((m) => !FINISHED.includes(m.status)) }))
      .filter((g) => g.matches.length > 0)
  }, [groups, selectedDate])


  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 max-w-lg mx-auto">
      <Header liveCount={totalLive} date={selectedDate} onDateChange={handleDateChange} />

      <main>
        {loading && <Spinner />}

        {!loading && error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && activeGroups.length === 0 && <EmptyState date={selectedDate} />}

        {!loading && activeGroups.map((group) => (
          <LeagueSection key={group.leagueId} group={group} />
        ))}
      </main>

      {lastUpdated && (
        <footer className="py-6 px-4 text-center">
          <button
            onClick={refresh}
            className="text-gray-400 text-xs hover:text-gray-600 transition-colors active:scale-95"
          >
            Odświeżono {lastUpdated.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            {isPast(selectedDate) ? '' : ' · dotknij aby odświeżyć'}
          </button>
        </footer>
      )}
    </div>
  )
}
