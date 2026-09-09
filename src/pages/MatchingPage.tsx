import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Panel } from '../components/ui/Panel'

export function MatchingPage() {
  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Workflow"
        title="Matching"
        description="Scores 0–100 selon pondération §5.2 — seuils haute / moyenne / faible."
        actions={
          <Link to="/grouping" className="af-btn af-btn-outlined">
            Vers regroupement
          </Link>
        }
      />
      <Panel className="af-enter">
        <p className="af-eyebrow text-cobalt">Moteur</p>
        <p className="mt-3 text-zinc-500">
          Cartes vs lot de référence · badge ≥75 / 50–74 / &lt;50 non proposé.
        </p>
      </Panel>
    </div>
  )
}
