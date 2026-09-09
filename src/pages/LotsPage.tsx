import { Link } from 'react-router-dom'
import { PageHeader } from '../components/ui/PageHeader'
import { StatusBadge } from '../components/ui/StatusBadge'
import { loadState } from '../services/storage'
import { formatDate, formatKg } from '../utils/format'

export function LotsPage() {
  const { lots } = loadState()

  return (
    <div className="space-y-10">
      <PageHeader
        eyebrow="Catalogue"
        eyebrowTone="cobalt"
        title="Lots"
        description={`${lots.length} lots en seed LocalStorage — filtres à venir.`}
        actions={
          <Link to="/lots/nouveau" className="af-btn af-btn-primary">
            Nouveau lot
          </Link>
        }
      />

      {lots.length === 0 ? (
        <EmptyLots />
      ) : (
        <div className="af-card af-enter overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <Th>ID</Th>
                  <Th>Produit</Th>
                  <Th>Qté</Th>
                  <Th>Trajet</Th>
                  <Th>Dispo</Th>
                  <Th>Statut</Th>
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr
                    key={lot.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/80"
                  >
                    <td className="px-4 py-3.5">
                      <Link
                        to={`/passport/${lot.id}`}
                        className="font-mono text-[13px] font-medium text-iris hover:underline"
                      >
                        {lot.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-zinc-800">{lot.produit}</p>
                      <p className="text-xs text-zinc-500">{lot.producteur}</p>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[13px] tabular-nums text-zinc-700">
                      {formatKg(lot.quantiteKg)}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-700">
                      <span className="text-zinc-500">{lot.localisation}</span>
                      <span className="mx-1.5 text-zinc-300">→</span>
                      {lot.destination}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-[12px] text-zinc-500">
                      {formatDate(lot.dateDisponibilite)}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge statut={lot.statut} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function Th({ children }: { children: string }) {
  return (
    <th className="af-eyebrow px-4 py-3 text-left text-zinc-400">{children}</th>
  )
}

function EmptyLots() {
  return (
    <div className="af-card px-8 py-16 text-center">
      <p className="af-eyebrow text-sprout">Vide</p>
      <p className="mt-3 text-xl font-semibold text-zinc-800">Aucun lot pour le moment</p>
      <p className="mt-2 text-zinc-500">Créez un lot pour démarrer le matching.</p>
      <Link to="/lots/nouveau" className="af-btn af-btn-primary mt-6">
        Créer un lot
      </Link>
    </div>
  )
}
