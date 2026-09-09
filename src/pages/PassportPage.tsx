import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { Panel } from '../components/ui/Panel'
import { StatusBadge } from '../components/ui/StatusBadge'
import { Eyebrow } from '../components/ui/MetaLabel'
import { loadState } from '../services/storage'
import { formatDate, formatKg } from '../utils/format'

export function PassportPage() {
  const { lotId } = useParams()
  const { lots, evenements } = loadState()
  const lot = lots.find((l) => l.id === lotId)
  const history = evenements.filter((e) => e.lotId === lotId)

  if (!lot) {
    return (
      <div className="space-y-10">
        <PageHeader eyebrow="Passeport" title="Introuvable" />
        <Panel>
          <p className="text-zinc-500">Lot {lotId} absent du catalogue.</p>
          <Link to="/lots" className="af-btn af-btn-outlined mt-5">
            Retour aux lots
          </Link>
        </Panel>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <PageHeader
        eyebrow="Passeport"
        eyebrowTone="sprout"
        title={lot.id}
        description="Traceability: verified journey — QR niveau 3 à brancher."
        actions={<StatusBadge statut={lot.statut} />}
      />

      <Panel className="af-enter">
        <Eyebrow tone="cobalt">Identité lot</Eyebrow>
        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          <Field label="Produit" value={lot.produit} />
          <Field label="Quantité" value={formatKg(lot.quantiteKg)} mono />
          <Field label="Producteur" value={lot.producteur} />
          <Field label="Catégorie" value={lot.categorie} />
          <Field label="Origine" value={lot.localisation} />
          <Field label="Destination" value={lot.destination} />
          <Field label="Disponibilité" value={formatDate(lot.dateDisponibilite)} mono />
          <Field
            label="Contraintes"
            value={lot.contraintes.length ? lot.contraintes.join(' · ') : 'Aucune'}
          />
        </dl>
      </Panel>

      <Panel className="af-enter af-enter-delay-1">
        <Eyebrow tone="coral">Historique</Eyebrow>
        {history.length === 0 ? (
          <p className="mt-4 text-zinc-500">Aucun événement.</p>
        ) : (
          <ul className="mt-4">
            {history.map((evt) => (
              <li
                key={evt.id}
                className="border-t border-zinc-200 py-4 first:border-0 first:pt-0"
              >
                <p className="text-sm text-zinc-800">{evt.message}</p>
                <p className="mt-1 font-mono text-[12px] tracking-wide text-zinc-400 uppercase">
                  {evt.type} · {formatDate(evt.date)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  )
}

function Field({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div>
      <dt className="af-eyebrow text-zinc-400">{label}</dt>
      <dd
        className={`mt-1.5 text-sm font-medium text-zinc-800 ${mono ? 'font-mono text-[13px]' : ''}`}
      >
        {value}
      </dd>
    </div>
  )
}
