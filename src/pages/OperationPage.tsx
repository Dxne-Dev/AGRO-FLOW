import { useState, type FormEvent } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertBadge } from '../components/AlertBadge';
import { EmptyState } from '../components/EmptyState';
import { OperationTimeline } from '../components/OperationTimeline';
import { checkAlerts } from '../services/rulesEngine';
import { useAppState } from '../state/useAppState';
import { formatKg } from '../utils/formatKg';
import type { TypeEvenement } from '../types/lot';

export function OperationPage() {
  const { id } = useParams();
  const { state, dispatch } = useAppState();
  const operation = state.operations.find((op) => op.id === id);
  const [eventType, setEventType] = useState<TypeEvenement>('note');
  const [message, setMessage] = useState('');
  const [retardHeures, setRetardHeures] = useState('30');

  const now = new Date();
  const events = operation
    ? state.evenements.filter(
        (event) => event.operationId === operation.id || operation.evenementIds.includes(event.id),
      )
    : [];
  const alerts = operation
    ? checkAlerts({
        operation,
        lots: state.lots,
        evenements: state.evenements,
        now,
      })
    : [];

  if (!operation || !id) {
    return (
      <EmptyState
        title="Opération introuvable"
        body="Cette opération n’existe pas dans l’état courant."
        to="/grouping"
        cta="Voir les groupements"
      />
    );
  }

  const current = operation;

  function advance() {
    dispatch({ type: 'advanceOperation', operationId: current.id, now: new Date() });
  }

  function onEvent(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    dispatch({
      type: 'addEvent',
      operationId: current.id,
      eventType,
      message: message.trim(),
      retardHeures: eventType === 'retard' ? Number(retardHeures) : undefined,
      now: new Date(),
    });
    setMessage('');
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Opération {operation.id}</h1>
          <p className="text-sm text-stone-600">
            {operation.depart} → {operation.destination} · {formatKg(operation.poidsTotalKg)} ·
            score {operation.scoreCompatibilite}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {operation.lotIds.map((lotId) => (
            <Link key={lotId} className="text-emerald-700 hover:underline" to={`/passport/${lotId}`}>
              {lotId}
            </Link>
          ))}
        </div>
        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <OperationTimeline operation={operation} evenements={events} onAdvance={advance} />
        </div>
      </div>
      <aside className="space-y-4">
        <h2 className="text-lg font-semibold">Alertes</h2>
        {alerts.length === 0 ? (
          <p className="text-sm text-stone-500">Aucune alerte sur cette opération.</p>
        ) : (
          alerts.map((alerte) => <AlertBadge key={alerte.id} alerte={alerte} />)
        )}
        <button
          type="button"
          onClick={() =>
            dispatch({ type: 'simulateDelay30h', operationId: current.id, now: new Date() })
          }
          className="w-full rounded-md bg-orange-600 px-4 py-2 text-sm font-medium text-white hover:bg-orange-700"
        >
          Simuler un retard de 30 h
        </button>
        <form onSubmit={onEvent} className="space-y-3 rounded-lg border border-stone-200 bg-white p-4">
          <h3 className="text-sm font-semibold">Nouvel événement</h3>
          <select
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            value={eventType}
            onChange={(e) => setEventType(e.target.value as TypeEvenement)}
          >
            <option value="note">Note</option>
            <option value="retard">Retard</option>
            <option value="incident">Incident</option>
            <option value="changement_statut">Changement de statut</option>
          </select>
          {eventType === 'retard' ? (
            <input
              type="number"
              min={1}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
              value={retardHeures}
              onChange={(e) => setRetardHeures(e.target.value)}
              aria-label="Heures de retard"
            />
          ) : null}
          <textarea
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
          />
          <button
            type="submit"
            className="rounded-md border border-stone-300 px-3 py-2 text-sm hover:bg-stone-50"
          >
            Enregistrer
          </button>
        </form>
        {events
          .filter((event) => event.type === 'incident' && !event.resolvedAt)
          .map((event) => (
            <button
              key={event.id}
              type="button"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
              onClick={() =>
                dispatch({ type: 'resolveEvent', eventId: event.id, now: new Date() })
              }
            >
              Marquer résolu ({event.id})
            </button>
          ))}
      </aside>
    </div>
  );
}
