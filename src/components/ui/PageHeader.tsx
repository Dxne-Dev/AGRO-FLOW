import type { ReactNode } from 'react'
import { Eyebrow } from './MetaLabel'

type PageHeaderProps = {
  eyebrow: string
  eyebrowTone?: 'sprout' | 'cobalt' | 'coral' | 'muted'
  title: string
  description?: string
  actions?: ReactNode
  align?: 'left' | 'center'
}

export function PageHeader({
  eyebrow,
  eyebrowTone = 'sprout',
  title,
  description,
  actions,
  align = 'left',
}: PageHeaderProps) {
  const centered = align === 'center'

  return (
    <div
      className={`flex flex-wrap gap-6 ${
        centered ? 'flex-col items-center text-center' : 'items-end justify-between'
      }`}
    >
      <div className={`min-w-0 space-y-3 ${centered ? 'max-w-2xl' : ''}`}>
        <Eyebrow tone={eyebrowTone}>{eyebrow}</Eyebrow>
        <h1 className="text-[36px] leading-[1.2] font-bold tracking-tight text-zinc-800">
          {title}
        </h1>
        {description ? (
          <p
            className={`text-lg leading-[1.5] text-zinc-500 ${centered ? 'mx-auto max-w-xl' : 'max-w-2xl'}`}
          >
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  )
}
