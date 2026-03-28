import { useMatches } from './hooks/useMatches'
import { Header } from './components/Header'
import { LeagueSection } from './components/LeagueSection'

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Ładowanie wyników...</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 px-8 text-center">
      <span className="text-5xl">⚽</span>
      <p className="text-gray-700 font-semibold">Brak meczów na dziś</p>
      <p className="text-gray-400 text-sm">Zajrzyj jutro lub sprawdź inne daty.</p>
    </div>
  )
}

export default function App() {
  const { groups, loading, error, lastUpdated, totalLive, refresh } = useMatches()

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 max-w-lg mx-auto">
      <Header liveCount={totalLive} />

      <main>
        {loading && <Spinner />}

        {!loading && error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {!loading && !error && groups.length === 0 && <EmptyState />}

        {!loading && groups.map((group) => (
          <LeagueSection key={group.leagueId} group={group} />
        ))}
      </main>

      {lastUpdated && (
        <footer className="py-6 px-4 text-center">
          <button
            onClick={refresh}
            className="text-gray-400 text-xs hover:text-gray-600 transition-colors active:scale-95"
          >
            Odświeżono {lastUpdated.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} · dotknij aby odświeżyć
          </button>
        </footer>
      )}
    </div>
  )
}
