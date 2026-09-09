type Severity = 'info' | 'vigilance' | 'critique'

const styles: Record<Severity, string> = {
  info: 'bg-zinc-100 text-cobalt',
  vigilance: 'bg-saffron-wash/50 text-coral',
  critique: 'bg-crimson/10 text-crimson',
}

type AlertBadgeProps = {
  severite: Severity
  children: string
}

export function AlertBadge({ severite, children }: AlertBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium ${styles[severite]}`}
    >
      <span
        className={`size-1.5 rounded-full ${
          severite === 'critique'
            ? 'bg-crimson'
            : severite === 'vigilance'
              ? 'bg-coral'
              : 'bg-cobalt'
        }`}
        aria-hidden
      />
      {children}
    </span>
  )
}
