import { describe, expect, it } from 'vitest';
import { buildSeed, toIsoDate } from './seed';

describe('buildSeed', () => {
  const now = new Date(2026, 8, 9);

  it('materializes AF-001 with offset +1 and 320 kg from Bohicon', () => {
    const state = buildSeed(now);
    const lot = state.lots.find((item) => item.id === 'AF-001');
    expect(lot).toMatchObject({
      quantiteKg: 320,
      localisation: 'Bohicon',
      destination: 'Cotonou',
      dateDisponibilite: toIsoDate(now, 1),
      contraintes: [],
    });
  });

  it('contains 12–15 lots and demo trio', () => {
    const state = buildSeed(now);
    expect(state.lots.length).toBeGreaterThanOrEqual(12);
    expect(state.lots.length).toBeLessThanOrEqual(15);
    expect(state.lots.map((l) => l.id)).toEqual(
      expect.arrayContaining(['AF-001', 'AF-002', 'AF-003']),
    );
  });

  it('keeps history on two lots outside the demo trio', () => {
    const state = buildSeed(now);
    const lotIds = new Set(
      state.evenements.map((e) => e.lotId).filter((id): id is string => Boolean(id)),
    );
    expect(lotIds.has('AF-010')).toBe(true);
    expect(lotIds.has('AF-011')).toBe(true);
    expect(lotIds.has('AF-001')).toBe(false);
  });
});
