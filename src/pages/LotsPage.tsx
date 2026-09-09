import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { DESTINATIONS } from '../types/lot';
import type { StatutLot } from '../types/lot';
import { formatDate } from '../utils/formatDate';
import { formatKg } from '../utils/formatKg';
import { useAppState } from '../state/useAppState';

const STATUTS: StatutLot[] = [
  'disponible',
  'en_groupement',
  'planifie',
  'en_transit',
  'arrive',
];

export function LotsPage() {
  const { state } = useAppState();
  const [statut, setStatut] = useState('');
  const [produit, setProduit] = useState('');
  const [destination, setDestination] = useState('');

  const produits = useMemo(
    () => [...new Set(state.lots.map((lot) => lot.produit))].sort(),
    [state.lots],
  );

  const filtered = state.lots.filter((lot) => {
    if (statut && lot.statut !== statut) return false;
    if (produit && lot.produit !== produit) return false;
    if (destination && lot.destination !== destination) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-af-ink">Lots</h1>
          <p className="text-sm text-stone-600">Inventaire des cargaisons à mutualiser.</p>
        </div>
        <Link
          to="/lots/nouveau"
          className="rounded-md bg-af-green px-4 py-2 text-sm font-medium text-white hover:bg-af-green-dark"
        >
          Nouveau lot
        </Link>
      </div>
      <div className="flex flex-wrap gap-3">
        <select
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
          value={statut}
          onChange={(e) => setStatut(e.target.value)}
          aria-label="Filtrer par statut"
        >
          <option value="">Tous les statuts</option>
          {STATUTS.map((value) => (
            <option key={value} value={value}>
              {value.replaceAll('_', ' ')}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
          value={produit}
          onChange={(e) => setProduit(e.target.value)}
          aria-label="Filtrer par produit"
        >
          <option value="">Tous les produits</option>
          {produits.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          aria-label="Filtrer par destination"
        >
          <option value="">Toutes les destinations</option>
          {DESTINATIONS.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title="Aucun lot"
          body="Aucun lot ne correspond aux filtres. Créez une cargaison pour lancer le matching."
          to="/lots/nouveau"
          cta="Créer un lot"
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">Id</th>
                <th className="px-4 py-3 font-medium">Produit</th>
                <th className="px-4 py-3 font-medium">Quantité</th>
                <th className="px-4 py-3 font-medium">Trajet</th>
                <th className="px-4 py-3 font-medium">Dispo</th>
                <th className="px-4 py-3 font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lot) => (
                <tr key={lot.id} className="border-t border-stone-100">
                  <td className="px-4 py-3">
                    <Link className="text-emerald-700 hover:underline" to={`/passport/${lot.id}`}>
                      {lot.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{lot.produit}</td>
                  <td className="px-4 py-3">{formatKg(lot.quantiteKg)}</td>
                  <td className="px-4 py-3">
                    {lot.localisation} → {lot.destination}
                  </td>
                  <td className="px-4 py-3">{formatDate(lot.dateDisponibilite)}</td>
                  <td className="px-4 py-3">{lot.statut.replaceAll('_', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
