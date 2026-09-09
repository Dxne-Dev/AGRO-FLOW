import type { AppState, Evenement, Lot, Operation, TypeEvenement } from '../types/lot';
import { createOperationInput, isGroupEligible } from '../services/grouping';
import { nextEventId, nextLotId, nextOperationId } from '../services/ids';

export type Action =
  | { type: 'hydrate'; state: AppState }
  | { type: 'addLot'; lot: Omit<Lot, 'id' | 'statut'>; now?: Date }
  | { type: 'createOperation'; lotIds: string[] }
  | { type: 'advanceOperation'; operationId: string; now: Date }
  | {
      type: 'addEvent';
      operationId: string;
      lotId?: string;
      eventType: TypeEvenement;
      message: string;
      retardHeures?: number;
      now: Date;
    }
  | { type: 'resolveEvent'; eventId: string; now: Date }
  | { type: 'simulateDelay30h'; operationId: string; now: Date }
  | { type: 'reset'; state: AppState };

const LOT_ADVANCE: Record<Operation['statut'], Lot['statut'] | undefined> = {
  validee: 'en_groupement',
  planifiee: 'planifie',
  en_transit: 'en_transit',
  arrivee: 'arrive',
};

const OP_NEXT: Record<Operation['statut'], Operation['statut'] | undefined> = {
  validee: 'planifiee',
  planifiee: 'en_transit',
  en_transit: 'arrivee',
  arrivee: undefined,
};

function appendEvent(
  state: AppState,
  event: Omit<Evenement, 'id'>,
): { state: AppState; id: string } {
  const id = nextEventId(state.evenements);
  const evenements = [...state.evenements, { ...event, id }];
  return { state: { ...state, evenements }, id };
}

export function reduce(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'hydrate':
    case 'reset':
      return action.state;
    case 'addLot': {
      const id = nextLotId(state.lots);
      const lot: Lot = { ...action.lot, id, statut: 'disponible' };
      return { ...state, lots: [...state.lots, lot] };
    }
    case 'createOperation': {
      const selected = action.lotIds
        .map((id) => state.lots.find((lot) => lot.id === id))
        .filter((lot): lot is Lot => Boolean(lot));
      if (!isGroupEligible(selected)) return state;
      const input = createOperationInput(selected);
      const id = nextOperationId(state.operations);
      const operation: Operation = { ...input, id, evenementIds: [] };
      return {
        ...state,
        operations: [...state.operations, operation],
        lots: state.lots.map((lot) =>
          action.lotIds.includes(lot.id) ? { ...lot, statut: 'en_groupement' } : lot,
        ),
      };
    }
    case 'advanceOperation': {
      const current = state.operations.find((op) => op.id === action.operationId);
      if (!current) return state;
      const nextStatut = OP_NEXT[current.statut];
      if (!nextStatut) return state;
      const dateDepart =
        nextStatut === 'planifiee' ? action.now.toISOString() : current.dateDepart;
      const lotStatut = LOT_ADVANCE[nextStatut];
      const withEvent = appendEvent(state, {
        operationId: current.id,
        type: 'changement_statut',
        message: `Statut opération : ${nextStatut}`,
        date: action.now.toISOString(),
      });
      return {
        ...withEvent.state,
        operations: withEvent.state.operations.map((op) =>
          op.id === current.id
            ? {
                ...op,
                statut: nextStatut,
                dateDepart,
                evenementIds: [...op.evenementIds, withEvent.id],
              }
            : op,
        ),
        lots: withEvent.state.lots.map((lot) =>
          current.lotIds.includes(lot.id) && lotStatut
            ? { ...lot, statut: lotStatut }
            : lot,
        ),
      };
    }
    case 'addEvent': {
      const withEvent = appendEvent(state, {
        operationId: action.operationId,
        lotId: action.lotId,
        type: action.eventType,
        message: action.message,
        date: action.now.toISOString(),
        retardHeures: action.retardHeures,
      });
      return {
        ...withEvent.state,
        operations: withEvent.state.operations.map((op) =>
          op.id === action.operationId
            ? { ...op, evenementIds: [...op.evenementIds, withEvent.id] }
            : op,
        ),
      };
    }
    case 'resolveEvent': {
      return {
        ...state,
        evenements: state.evenements.map((event) =>
          event.id === action.eventId
            ? { ...event, resolvedAt: action.now.toISOString() }
            : event,
        ),
      };
    }
    case 'simulateDelay30h': {
      return reduce(state, {
        type: 'addEvent',
        operationId: action.operationId,
        eventType: 'retard',
        message: 'Retard de 30 h simulé',
        retardHeures: 30,
        now: action.now,
      });
    }
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}
