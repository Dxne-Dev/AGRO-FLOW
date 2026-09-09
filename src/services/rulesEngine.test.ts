import { describe, expect, it } from 'vitest';
import { checkAlerts } from './rulesEngine';
import type { Evenement, Lot, Operation } from '../types/lot';

const lot = (overrides: Partial<Lot> & Pick<Lot, 'id'>): Lot => ({
  produit: 'Maïs',
  categorie: 'céréale',
  quantiteKg: 300,
  producteur: 'Test',
  localisation: 'Bohicon',
  destination: 'Cotonou',
  dateDisponibilite: '2026-09-10',
  contraintes: [],
  statut: 'en_groupement',
  ...overrides,
});

const operation = (overrides: Partial<Operation> = {}): Operation => ({
  id: 'OP-001',
  lotIds: ['AF-001', 'AF-002', 'AF-003'],
  scoreCompatibilite: 90,
  statut: 'en_transit',
  poidsTotalKg: 955,
  depart: 'Bohicon',
  destination: 'Cotonou',
  dateDepart: '2026-09-09T08:00:00.000Z',
  evenementIds: [],
  ...overrides,
});

describe('checkAlerts', () => {
  const lots: Lot[] = [
    lot({ id: 'AF-001' }),
    lot({ id: 'AF-002', localisation: 'Allada' }),
    lot({ id: 'AF-003', localisation: 'Abomey-Calavi' }),
  ];
  const now = new Date('2026-09-09T12:00:00.000Z');

  it('does not raise R3 at 955 kg', () => {
    const alerts = checkAlerts({ operation: operation(), lots, evenements: [], now });
    expect(alerts.some((a) => a.ruleId === 'R3')).toBe(false);
  });

  it('raises R3 above 1000 kg', () => {
    const alerts = checkAlerts({
      operation: operation({ poidsTotalKg: 1001 }),
      lots,
      evenements: [],
      now,
    });
    expect(alerts.some((a) => a.ruleId === 'R3' && a.id === 'R3-OP-001')).toBe(true);
  });

  it('raises R1 for a 30h delay event', () => {
    const events: Evenement[] = [
      {
        id: 'EV-010',
        operationId: 'OP-001',
        type: 'retard',
        message: 'Retard de 30 h simulé',
        date: now.toISOString(),
        retardHeures: 30,
      },
    ];
    const alerts = checkAlerts({
      operation: operation({ evenementIds: ['EV-010'] }),
      lots,
      evenements: events,
      now,
    });
    expect(alerts.some((a) => a.ruleId === 'R1')).toBe(true);
  });

  it('raises R4 for an incident older than 6h', () => {
    const events: Evenement[] = [
      {
        id: 'EV-011',
        operationId: 'OP-001',
        type: 'incident',
        message: 'Crévaison',
        date: '2026-09-09T04:00:00.000Z',
      },
    ];
    const alerts = checkAlerts({
      operation: operation({ evenementIds: ['EV-011'] }),
      lots,
      evenements: events,
      now,
    });
    expect(alerts.some((a) => a.ruleId === 'R4')).toBe(true);
  });

  it('raises R2 when grouped lots are incompatible', () => {
    const mixed = [
      lot({ id: 'AF-001' }),
      lot({
        id: 'AF-006',
        produit: 'Piment',
        categorie: 'légume',
        contraintes: ['sans_contact'],
      }),
    ];
    const alerts = checkAlerts({
      operation: operation({ lotIds: ['AF-001', 'AF-006'] }),
      lots: mixed,
      evenements: [],
      now,
    });
    expect(alerts.some((a) => a.ruleId === 'R2')).toBe(true);
  });
});
