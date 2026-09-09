import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { QRPassport } from '../components/QRPassport';
import { useAppState } from '../state/useAppState';
import { formatDate, formatDateTime } from '../utils/formatDate';
import { formatKg } from '../utils/formatKg';

export function PassportPage() {
  const { lotId } = useParams();
  const { state } = useAppState();
  const lot = state.lots.find((item) => item.id === lotId);
  const operations = state.operations.filter((op) => lot && op.lotIds.includes(lot.id));
  const events = state.evenements.filter(
    (event) =>
      event.lotId === lotId || operations.some((op) => op.evenementIds.includes(event.id)),
  );
  const url = useMemo(() => {
    if (!lotId) return '';
    return `${window.location.origin}/passport/${lotId}`;
  }, [lotId]);

  if (!lot) {
    return (
      <EmptyState
        title="Passeport introuvable"
        body="Ce lot n’existe pas dans l’état courant."
        to="/lots"
        cta="Retour aux lots"
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Passeport {lot.id}</h1>
        <dl className="grid grid-cols-2 gap-3 rounded-lg border border-stone-200 bg-white p-5 text-sm">
          <Item label="Produit" value={lot.produit} />
          <Item label="Catégorie" value={lot.categorie} />
          <Item label="Producteur" value={lot.producteur} />
          <Item label="Quantité" value={formatKg(lot.quantiteKg)} />
          <Item label="Origine" value={lot.localisation} />
          <Item label="Destination" value={lot.destination} />
          <Item label="Disponibilité" value={formatDate(lot.dateDisponibilite)} />
          <Item label="Statut" value={lot.statut.replaceAll('_', ' ')} />
        </dl>
        <section>
          <h2 className="text-lg font-semibold">Historique</h2>
          {events.length === 0 ? (
            <p className="mt-2 text-sm text-stone-500">Pas encore d’événement tracé.</p>
          ) : (
            <ol className="mt-3 space-y-2">
              {events.map((event) => (
                <li key={event.id} className="rounded-md border border-stone-200 bg-white p-3 text-sm">
                  <p className="font-medium">{event.message}</p>
                  <p className="text-xs text-stone-500">{formatDateTime(event.date)}</p>
                </li>
              ))}
            </ol>
          )}
        </section>
        {operations[0] ? (
          <Link className="text-sm text-emerald-700 hover:underline" to={`/operations/${operations[0].id}`}>
            Voir l’opération {operations[0].id}
          </Link>
        ) : null}
      </div>
      <QRPassport url={url} />
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-stone-500">{label}</dt>
      <dd className="font-medium text-stone-900">{value}</dd>
    </div>
  );
}
