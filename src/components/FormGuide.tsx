interface Props {
  form: string  // e.g. "WWDLWWDLWW" — left=oldest, right=newest
}

const squareStyles: Record<string, string> = {
  W: 'bg-green-500',
  D: 'bg-gray-400',
  L: 'bg-red-500',
}

const labels: Record<string, string> = { W: 'Wygrana', D: 'Remis', L: 'Przegrana' }

export function FormGuide({ form }: Props) {
  if (!form) return null

  const chars = form.slice(-10).split('')
  const w = chars.filter((c) => c === 'W').length
  const d = chars.filter((c) => c === 'D').length
  const l = chars.filter((c) => c === 'L').length

  return (
    <div className="flex items-center gap-2 mt-0.5">
      {/* Coloured squares */}
      <div className="flex items-center gap-0.5">
        {chars.map((c, i) => (
          <span
            key={i}
            title={labels[c]}
            className={`w-3 h-3 rounded-sm text-[7px] font-bold text-white flex items-center justify-center flex-shrink-0 ${squareStyles[c] ?? 'bg-gray-300'}`}
          >
            {c}
          </span>
        ))}
      </div>

      {/* W / D / L summary */}
      <div className="flex items-center gap-1 text-[10px] font-semibold tabular-nums">
        <span className="text-green-600">{w}W</span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-500">{d}R</span>
        <span className="text-gray-400">·</span>
        <span className="text-red-500">{l}P</span>
      </div>
    </div>
  )
}
