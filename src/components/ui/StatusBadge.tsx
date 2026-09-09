import type { StatutLot } from '../../types/lot'

const statutStyles: Record<StatutLot, string> = {
  disponible: 'bg-mint-wash text-emerald',
  en_groupement: 'bg-zinc-100 text-cobalt',
  planifie: 'bg-saffron-wash/40 text-coral',
  en_transit: 'bg-zinc-100 text-iris',
  arrive: 'bg-zinc-100 text-zinc-500',
}

type StatusBadgeProps = {
  statut: StatutLot
}

export function StatusBadge({ statut }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-medium tracking-[0.04em] ${statutStyles[statut]}`}
    >
      {statut.replaceAll('_', ' ')}
    </span>
  )
}
