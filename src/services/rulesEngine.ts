import type { Alerte, Evenement, Lot, Operation } from '../types/lot';
import { hasMajorIncompatibility } from './compatibility';

const MS_HOUR = 60 * 60 * 1000;

function hoursBetween(later: Date, earlier: Date): number {
  return (later.getTime() - earlier.getTime()) / MS_HOUR;
}

export function checkAlerts(input: {
  operation: Operation;
  lots: Lot[];
  evenements: Evenement[];
  now: Date;
  capaciteKg?: number;
}): Alerte[] {
  const { operation, lots, evenements, now } = input;
  const capaciteKg = input.capaciteKg ?? 1000;
  const alerts: Alerte[] = [];
  const opEvents = evenements.filter(
    (event) => event.operationId === operation.id || operation.evenementIds.includes(event.id),
  );

  const lateEvent = opEvents.find(
    (event) => event.type === 'retard' && (event.retardHeures ?? 0) > 24,
  );
  const plannedLate =
    (operation.statut === 'planifiee' || operation.statut === 'en_transit') &&
    operation.dateDepart !== null &&
    hoursBetween(now, new Date(operation.dateDepart)) > 24;
  if (lateEvent || plannedLate) {
    alerts.push({
      id: `R1-${operation.id}`,
      severite: 'critique',
      message: 'Vigilance élevée : retard de transport détecté',
      ruleId: 'R1',
      sourceId: operation.id,
    });
  }

  const grouped = lots.filter((lot) => operation.lotIds.includes(lot.id));
  let incompatible = false;
  for (let i = 0; i < grouped.length; i += 1) {
    for (let j = i + 1; j < grouped.length; j += 1) {
      const a = grouped[i];
      const b = grouped[j];
      if (a && b && hasMajorIncompatibility(a, b)) incompatible = true;
    }
  }
  if (incompatible) {
    alerts.push({
      id: `R2-${operation.id}`,
      severite: 'critique',
      message: 'Regroupement refusé : contraintes produit incompatibles',
      ruleId: 'R2',
      sourceId: operation.id,
    });
  }

  if (operation.poidsTotalKg > capaciteKg) {
    alerts.push({
      id: `R3-${operation.id}`,
      severite: 'vigilance',
      message: 'Volume proche de la capacité maximale',
      ruleId: 'R3',
      sourceId: operation.id,
    });
  }

  const openIncident = opEvents.find(
    (event) =>
      event.type === 'incident' &&
      !event.resolvedAt &&
      hoursBetween(now, new Date(event.date)) > 6,
  );
  if (openIncident) {
    alerts.push({
      id: `R4-${operation.id}`,
      severite: 'vigilance',
      message: 'Incident signalé en attente de traitement',
      ruleId: 'R4',
      sourceId: operation.id,
    });
  }

  return alerts;
}
