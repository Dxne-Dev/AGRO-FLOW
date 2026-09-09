import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Panel } from '../components/ui/Panel'

export function OperationPage() {
  const { id } = useParams()

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Opération"
        eyebrowTone="cobalt"
        title={id ?? '—'}
        description="Timeline : lots → regroupement → planifié → transit → arrivé."
      />
      <Panel className="af-enter">
        <p className="af-eyebrow text-zinc-400">Timeline</p>
        <p className="mt-3 text-zinc-500">
          Événements + alertes R1–R4 à brancher sur la fiche.
        </p>
      </Panel>
      <Link to="/" className="text-sm font-medium text-cobalt hover:underline">
        ← Dashboard
      </Link>
    </div>
  )
}
