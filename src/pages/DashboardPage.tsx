import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Package, GitMerge, AlertTriangle, Truck } from 'lucide-react'
import { PageHeader } from '../components/ui/PageHeader'
import { Panel } from '../components/ui/Panel'
import { Eyebrow } from '../components/ui/MetaLabel'
import { AlertBadge } from '../components/ui/AlertBadge'
import { loadState } from '../services/storage'
import { formatKg } from '../utils/format'

export function DashboardPage() {
  const { lots, operations, evenements } = loadState()
  const disponibles = lots.filter((l) => l.statut === 'disponible').length
  const demoLots = lots.filter((l) =>
    ['AF-001', 'AF-002', 'AF-003'].includes(l.id),
  )
  const demoKg = demoLots.reduce((sum, lot) => sum + lot.quantiteKg, 0)

  return (
    <div className="space-y-16">
      <PageHeader
        eyebrow="Ops overview"
        title="Flux consolidés"
        description="Lots, opportunités de regroupement et vigilance sur le corridor Bénin."
        actions={
          <Link to="/matching" className="af-btn af-btn-primary">
            Lancer le matching
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Kpi
          className="af-enter"
          icon={<Package className="size-5 text-cobalt" strokeWidth={1.75} />}
          label="Lots"
          value={lots.length}
          hint={`${disponibles} disponibles`}
        />
        <Kpi
          className="af-enter af-enter-delay-1"
          icon={<Truck className="size-5 text-coral" strokeWidth={1.75} />}
          label="Opérations"
          value={operations.length}
          hint="Créées localement"
        />
        <Kpi
          className="af-enter af-enter-delay-2"
          icon={<GitMerge className="size-5 text-sprout" strokeWidth={1.75} />}
          label="Opportunité"
          value={demoLots.length}
          hint={formatKg(demoKg)}
        />
        <Kpi
          className="af-enter af-enter-delay-3"
          icon={<AlertTriangle className="size-5 text-iris" strokeWidth={1.75} />}
          label="Alertes"
          value={0}
          hint="Règles R1–R4"
        />
      </div>

      <section className="grid gap-4 lg:grid-cols-5">
        <Panel className="af-enter lg:col-span-3">
          <Eyebrow tone="cobalt">Opportunité</Eyebrow>
          <h2 className="mt-3 text-xl font-semibold text-zinc-800">
            Corridor maïs → Cotonou
          </h2>
          <p className="mt-2 text-zinc-500">
            Scénario démo AF-001 / 002 / 003 · volume estimé{' '}
            <span className="font-medium text-zinc-800">{formatKg(demoKg)}</span>
          </p>
          <Link
            to="/grouping"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cobalt hover:underline"
          >
            Préparer le regroupement
            <ArrowRight className="size-4" strokeWidth={1.75} aria-hidden />
          </Link>
        </Panel>

        <Panel className="af-enter af-enter-delay-1 lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <Eyebrow tone="coral">Activité</Eyebrow>
            <AlertBadge severite="info">Seed</AlertBadge>
          </div>
          <ul className="mt-4 space-y-4">
            {evenements.slice(0, 3).map((evt) => (
              <li key={evt.id} className="border-t border-zinc-200 pt-4 first:border-0 first:pt-0">
                <p className="text-sm text-zinc-800">{evt.message}</p>
                <p className="mt-1 font-mono text-[12px] tracking-wide text-zinc-400 uppercase">
                  {evt.lotId} · {evt.type}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </section>

      {/* Dark band — once per page, DESIGN.md rhythm device */}
      <section className="rounded-2xl bg-zinc-900 px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto max-w-3xl text-center">
          <Eyebrow tone="lime">Corridor</Eyebrow>
          <h2 className="mt-4 text-[36px] leading-[1.2] font-bold text-white">
            Bohicon → Cotonou
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-zinc-400">
            Chaîne logistique de référence pour la démo live.
          </p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { city: 'Bohicon', accent: 'text-cobalt' },
            { city: 'Allada', accent: 'text-sprout' },
            { city: 'Abomey-Calavi', accent: 'text-coral' },
            { city: 'Cotonou', accent: 'text-lime' },
          ].map((node, i) => (
            <div
              key={node.city}
              className="rounded-xl border border-zinc-700 bg-zinc-800 p-5 text-left"
            >
              <p className={`af-eyebrow ${node.accent}`}>Nœud 0{i + 1}</p>
              <p className="mt-2 text-lg font-semibold text-white">{node.city}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function Kpi({
  icon,
  label,
  value,
  hint,
  className = '',
}: {
  icon: ReactNode
  label: string
  value: number
  hint: string
  className?: string
}) {
  return (
    <Panel className={className}>
      <div className="flex items-center justify-between">
        {icon}
        <span className="af-eyebrow text-zinc-400">{label}</span>
      </div>
      <p className="mt-4 text-3xl font-bold tracking-tight text-zinc-800 tabular-nums">
        {value.toString().padStart(2, '0')}
      </p>
      <p className="mt-1 text-sm text-zinc-500">{hint}</p>
    </Panel>
  )
}
