import { describe, expect, it } from 'vitest';
import { buildSeed } from '../services/seed';
import { reduce } from './reducer';

describe('reducer', () => {
  const now = new Date('2026-09-09T10:00:00.000Z');

  it('creates an eligible operation and marks lots en_groupement', () => {
    const state = buildSeed(now);
    const next = reduce(state, {
      type: 'createOperation',
      lotIds: ['AF-001', 'AF-002', 'AF-003'],
    });
    expect(next.operations).toHaveLength(1);
    expect(next.operations[0]).toMatchObject({
      id: 'OP-001',
      statut: 'validee',
      poidsTotalKg: 955,
      dateDepart: null,
    });
    expect(
      next.lots.filter((l) => ['AF-001', 'AF-002', 'AF-003'].includes(l.id)).every(
        (l) => l.statut === 'en_groupement',
      ),
    ).toBe(true);
  });

  it('refuses an incompatible grouping', () => {
    const state = buildSeed(now);
    const next = reduce(state, { type: 'createOperation', lotIds: ['AF-001', 'AF-006'] });
    expect(next.operations).toHaveLength(0);
  });

  it('advances timeline strictly and sets dateDepart', () => {
    let state = reduce(buildSeed(now), {
      type: 'createOperation',
      lotIds: ['AF-001', 'AF-002', 'AF-003'],
    });
    state = reduce(state, { type: 'advanceOperation', operationId: 'OP-001', now });
    expect(state.operations[0]?.statut).toBe('planifiee');
    expect(state.operations[0]?.dateDepart).toBe(now.toISOString());
    expect(state.lots.find((l) => l.id === 'AF-001')?.statut).toBe('planifie');
  });
});
