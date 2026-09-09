import { PageHeader } from '../components/ui/PageHeader'
import { Panel } from '../components/ui/Panel'

export function GroupingPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Grouping"
        eyebrowTone="coral"
        title="Regroupement"
        description="Lots compatibles, volume total, création d’opération (capacité 1000 kg)."
      />
      <Panel className="af-enter">
        <p className="af-eyebrow text-zinc-400">Placeholder</p>
        <p className="mt-3 text-zinc-500">
          Score de groupement = moyenne des paires. Capacité véhicule standard 1000 kg.
        </p>
        <button type="button" className="af-btn af-btn-primary mt-6" disabled>
          Créer l&apos;opération
        </button>
      </Panel>
    </div>
  )
}
