import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Panel } from '../components/ui/Panel'

export function NewLotPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <PageHeader
        eyebrow="Création"
        eyebrowTone="coral"
        title="Nouveau lot"
        description="Formulaire complet §8 — validation, id AF-XXX, redirection matching."
      />
      <Panel className="af-enter">
        <p className="af-eyebrow text-zinc-400">Placeholder</p>
        <p className="mt-3 text-zinc-500">
          Champs : produit, kg, producteur, localisation, destination, disponibilité,
          contraintes optionnelles.
        </p>
      </Panel>
      <Link to="/lots" className="text-sm font-medium text-cobalt hover:underline">
        ← Retour au catalogue
      </Link>
    </div>
  )
}
