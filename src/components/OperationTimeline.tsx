import type { Evenement, Operation } from '../types/lot';
import { formatDateTime } from '../utils/formatDate';

const STEPS: Operation['statut'][] = ['validee', 'planifiee', 'en_transit', 'arrivee'];

const labels: Record<Operation['statut'], string> = {
  validee: 'Regroupement validé',
  planifiee: 'Transport planifié',
  en_transit: 'En transit',
  arrivee: 'Arrivé',
};

export function OperationTimeline({
  operation,
  evenements,
  onAdvance,
}: {
  operation: Operation;
  evenements: Evenement[];
  onAdvance?: () => void;
}) {
  const currentIndex = STEPS.indexOf(operation.statut);
  const canAdvance = currentIndex >= 0 && currentIndex < STEPS.length - 1;

  return (
    <div className="space-y-6">
      <ol className="space-y-3">
        {STEPS.map((step, index) => {
          const done = index <= currentIndex;
          return (
            <li key={step} className="flex items-start gap-3">
              <span
                className={`mt-0.5 h-3 w-3 rounded-full ${done ? 'bg-emerald-600' : 'bg-stone-300'}`}
              />
              <div>
                <p className={`text-sm font-medium ${done ? 'text-stone-900' : 'text-stone-400'}`}>
                  {labels[step]}
                </p>
                {step === 'planifiee' && operation.dateDepart ? (
                  <p className="text-xs text-stone-500">
                    Départ : {formatDateTime(operation.dateDepart)}
                  </p>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      {canAdvance && onAdvance ? (
        <button
          type="button"
          onClick={onAdvance}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
        >
          Avancer à l’étape suivante
        </button>
      ) : null}
      <div>
        <h3 className="text-sm font-semibold text-stone-800">Événements</h3>
        {evenements.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">Aucun événement pour le moment.</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {evenements.map((event) => (
              <li key={event.id} className="rounded-md border border-stone-200 bg-white p-3 text-sm">
                <p className="font-medium">{event.message}</p>
                <p className="text-xs text-stone-500">
                  {event.type} · {formatDateTime(event.date)}
                  {event.resolvedAt ? ` · résolu ${formatDateTime(event.resolvedAt)}` : ''}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
