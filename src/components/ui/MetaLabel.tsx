type EyebrowProps = {
  children: string
  tone?: 'sprout' | 'cobalt' | 'coral' | 'muted' | 'lime'
}

const tones: Record<NonNullable<EyebrowProps['tone']>, string> = {
  sprout: 'text-sprout',
  cobalt: 'text-cobalt',
  coral: 'text-coral',
  muted: 'text-zinc-500',
  lime: 'text-lime',
}

/** DM Mono uppercase section eyebrow — DESIGN.md signature */
export function Eyebrow({ children, tone = 'sprout' }: EyebrowProps) {
  return <p className={`af-eyebrow ${tones[tone]}`}>{children}</p>
}
