import { useMemo, useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { Surface } from '../components/Surface';
import { nextLotId } from '../services/ids';
import { useAppState } from '../state/useAppState';
import {
  DESTINATIONS,
  ORIGINES,
  PRODUCT_CATEGORY,
  inferCategory,
  type Contrainte,
} from '../types/lot';
import { addDaysIso, formatDateRange, todayIso } from '../utils/formatDate';
import { formatKg } from '../utils/formatKg';
import { SESSION_PRODUCER } from '../session';
import { FieldLabel, PrimaryButton, SelectControl } from './new-lot/fields';

const PRODUCTS = Object.keys(PRODUCT_CATEGORY).map(
  (key) => key.charAt(0).toUpperCase() + key.slice(1),
);

const WIZARD_CONSTRAINTS: { id: Contrainte | 'aucune'; label: string }[] = [
  { id: 'fragile', label: 'Fragile' },
  { id: 'temperature_ambiante', label: 'Température particulière' },
  { id: 'hauteur_interdite', label: 'Manipulation particulière' },
  { id: 'aucune', label: 'Aucune' },
];

export function NewLotPage() {
  const { state, dispatch } = useAppState();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [produit, setProduit] = useState('Maïs');
  const [quantiteKg, setQuantiteKg] = useState('500');
  const [localisation, setLocalisation] = useState<string>(ORIGINES[0] ?? 'Bohicon');
  const [destination, setDestination] = useState<string>(DESTINATIONS[0] ?? 'Cotonou');
  const [dateFrom, setDateFrom] = useState(todayIso());
  const [dateTo, setDateTo] = useState(addDaysIso(todayIso(), 2));
  const [contraintes, setContraintes] = useState<Contrainte[]>([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const aucune = contraintes.length === 0;
  const summaryRange = useMemo(
    () => formatDateRange(dateFrom, dateTo),
    [dateFrom, dateTo],
  );

  function toggleConstraint(id: Contrainte) {
    setContraintes((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function goNextFromStep1() {
    setError('');
    const qty = Number(quantiteKg);
    if (!Number.isFinite(qty) || qty <= 0 || qty > 1000) {
      setError('La quantité doit être un nombre entre 1 et 1 000 kg.');
      return;
    }
    if (!produit.trim()) {
      setError('Choisissez un produit.');
      return;
    }
    setStep(2);
  }

  function goNextFromStep2() {
    setError('');
    if (dateFrom < todayIso()) {
      setError('La date de début ne peut pas être dans le passé.');
      return;
    }
    if (dateTo < dateFrom) {
      setError('La fin de période doit être après le début.');
      return;
    }
    setStep(3);
  }

  function createLot() {
    setError('');
    const qty = Number(quantiteKg);
    const resolvedCategory = inferCategory(produit);
    if (!resolvedCategory) {
      setError('Produit hors catalogue : impossible de déduire la catégorie.');
      return;
    }
    setSubmitting(true);
    const nextId = nextLotId(state.lots);
    dispatch({
      type: 'addLot',
      lot: {
        produit: produit.trim(),
        categorie: resolvedCategory,
        quantiteKg: qty,
        producteur: SESSION_PRODUCER,
        localisation,
        destination,
        dateDisponibilite: dateFrom,
        contraintes,
      },
    });
    navigate(`/matching?ref=${nextId}`);
  }

  return (
    <div className="flex min-h-[70vh] flex-col">
      <AppHeader title="Créer un lot" subtitle={`Étape ${step} sur 3`} />

      {step === 1 ? (
        <div className="flex flex-1 flex-col gap-5">
          <div>
            <FieldLabel>Quel produit souhaitez-vous transporter ?</FieldLabel>
            <div className="relative">
              <SelectControl
                aria-label="Produit"
                value={produit}
                onChange={(e) => setProduit(e.target.value)}
              >
                {PRODUCTS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </SelectControl>
              <ChevronDown
                className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-af-muted"
                aria-hidden
              />
            </div>
          </div>
          <div>
            <FieldLabel>Quantité</FieldLabel>
            <div className="flex gap-3">
              <input
                type="number"
                min={1}
                max={1000}
                aria-label="Quantité en kilogrammes"
                value={quantiteKg}
                onChange={(e) => setQuantiteKg(e.target.value)}
                className="h-14 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-sm text-af-ink"
              />
              <div className="flex h-14 w-28 items-center justify-center rounded-2xl border border-black/10 bg-white text-sm text-af-ink">
                kg
              </div>
            </div>
          </div>
          <div>
            <p className="text-[13px] text-af-muted">
              Votre produit est-il soumis à une contrainte particulière ?
            </p>
            <button
              type="button"
              onClick={() => setContraintes([])}
              className={`mt-3 rounded-full px-4 py-1.5 text-xs font-bold ${
                aucune
                  ? 'bg-af-green-soft text-af-green-dark'
                  : 'bg-white text-af-muted ring-1 ring-black/10'
              }`}
            >
              Aucune
            </button>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <PrimaryButton type="button" className="mt-auto" onClick={goNextFromStep1}>
            Suivant →
          </PrimaryButton>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="flex flex-1 flex-col gap-5">
          <div>
            <FieldLabel>Lieu de départ</FieldLabel>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-red-500"
                aria-hidden
              />
              <SelectControl
                aria-label="Lieu de départ"
                className="pl-10"
                value={localisation}
                onChange={(e) => setLocalisation(e.target.value)}
              >
                {ORIGINES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </SelectControl>
            </div>
          </div>
          <div>
            <FieldLabel>Destination</FieldLabel>
            <div className="relative">
              <MapPin
                className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-red-500"
                aria-hidden
              />
              <SelectControl
                aria-label="Destination"
                className="pl-10"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              >
                {DESTINATIONS.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </SelectControl>
            </div>
          </div>
          <div>
            <FieldLabel>Période de disponibilité</FieldLabel>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                min={todayIso()}
                aria-label="Début de disponibilité"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="h-14 rounded-2xl border border-black/10 bg-white px-3 text-sm text-af-ink"
              />
              <input
                type="date"
                min={dateFrom}
                aria-label="Fin de disponibilité"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="h-14 rounded-2xl border border-black/10 bg-white px-3 text-sm text-af-ink"
              />
            </div>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="mt-auto space-y-2">
            <PrimaryButton type="button" onClick={goNextFromStep2}>
              Suivant →
            </PrimaryButton>
            <button
              type="button"
              className="w-full py-2 text-sm font-bold text-af-muted"
              onClick={() => setStep(1)}
            >
              Retour
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex flex-1 flex-col gap-5">
          <div>
            <FieldLabel>Contraintes de transport</FieldLabel>
            <ul className="space-y-2">
              {WIZARD_CONSTRAINTS.map((item) => {
                const checked =
                  item.id === 'aucune' ? aucune : contraintes.includes(item.id);
                return (
                  <li key={item.id}>
                    <label className="flex h-12 cursor-pointer items-center gap-3 rounded-2xl border border-black/10 bg-white px-4 text-[13px] text-af-ink">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          if (item.id === 'aucune') setContraintes([]);
                          else toggleConstraint(item.id);
                        }}
                        className="h-4 w-4 rounded border-black/20 text-af-green"
                      />
                      {item.label}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <FieldLabel>Résumé</FieldLabel>
            <Surface>
              <p className="text-sm font-bold text-af-ink">{produit}</p>
              <p className="mt-2 text-[13px] text-af-muted">
                {formatKg(Number(quantiteKg) || 0)}
              </p>
              <p className="mt-2 text-[13px] text-af-muted">
                {localisation} → {destination}
              </p>
              <p className="mt-2 text-[13px] text-af-muted">{summaryRange}</p>
            </Surface>
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <div className="mt-auto space-y-2">
            <PrimaryButton type="button" disabled={submitting} onClick={createLot}>
              Créer le lot
            </PrimaryButton>
            <button
              type="button"
              className="w-full py-2 text-sm font-bold text-af-muted"
              onClick={() => setStep(2)}
            >
              Retour
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
