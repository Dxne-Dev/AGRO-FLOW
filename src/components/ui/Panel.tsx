import type { ReactNode } from 'react'

type PanelProps = {
  children: ReactNode
  className?: string
  padded?: boolean
  quiet?: boolean
  dark?: boolean
}

export function Panel({
  children,
  className = '',
  padded = true,
  quiet = false,
  dark = false,
}: PanelProps) {
  const base = dark
    ? 'rounded-xl border border-zinc-700 bg-zinc-800 text-white'
    : quiet
      ? 'af-card-quiet'
      : 'af-card'

  return (
    <div className={`${base} ${padded ? 'p-6' : ''} ${className}`.trim()}>
      {children}
    </div>
  )
}
