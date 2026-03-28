interface Props {
  form: string  // e.g. "WWDLWWDLWW" — left=oldest, right=newest
}

const styles: Record<string, string> = {
  W: 'bg-green-500',
  D: 'bg-gray-400',
  L: 'bg-red-500',
}

export function FormGuide({ form }: Props) {
  if (!form) return null

  const chars = form.slice(-10).split('')

  return (
    <div className="flex items-center gap-0.5 mt-0.5">
      {chars.map((c, i) => (
        <span
          key={i}
          title={c === 'W' ? 'Wygrana' : c === 'D' ? 'Remis' : 'Przegrana'}
          className={`w-3 h-3 rounded-sm text-[7px] font-bold text-white flex items-center justify-center flex-shrink-0 ${styles[c] ?? 'bg-gray-300'}`}
        >
          {c}
        </span>
      ))}
    </div>
  )
}
