import { describe, expect, it } from 'vitest';
import {
  countOpportunityDestinations,
  createOperationInput,
  groupingCriteria,
  groupingScore,
  isGroupEligible,
  largestEligibleCluster,
  proposalsForReference,
} from './grouping';
import { buildSeed } from './seed';

describe('grouping', () => {
  const seed = buildSeed(new Date(2026, 8, 9));
  const trio = ['AF-001', 'AF-002', 'AF-003'].map((id) => {
    const lot = seed.lots.find((item) => item.id === id);
    if (!lot) throw new Error(id);
    return lot;
  });

  it('scores the demo trio at 90 with 955 kg from Bohicon', () => {
    expect(groupingScore(trio)).toBe(90);
    const input = createOperationInput(trio);
    expect(input.poidsTotalKg).toBe(955);
    expect(input.depart).toBe('Bohicon');
    expect(input.destination).toBe('Cotonou');
    expect(input.dateDepart).toBeNull();
    expect(isGroupEligible(trio)).toBe(true);
  });

  it('rejects mixed destinations and major incompatibility', () => {
    const piment = seed.lots.find((l) => l.id === 'AF-006');
    const ananas = seed.lots.find((l) => l.id === 'AF-005');
    if (!piment || !ananas) throw new Error('seed');
    expect(isGroupEligible([trio[0]!, piment])).toBe(false);
    expect(isGroupEligible([trio[0]!, ananas])).toBe(false);
  });

  it('counts at least one Cotonou opportunity on the seed', () => {
    expect(countOpportunityDestinations(seed.lots)).toBeGreaterThanOrEqual(1);
  });

  it('finds the maize demo cluster as the largest eligible grouping', () => {
    const cluster = largestEligibleCluster(seed.lots);
    expect(cluster?.map((lot) => lot.id).sort()).toEqual(['AF-001', 'AF-002', 'AF-003']);
    expect(cluster?.reduce((sum, lot) => sum + lot.quantiteKg, 0)).toBe(955);
  });

  it('proposes the maize trio for AF-001 with matching criteria', () => {
    const proposals = proposalsForReference(seed.lots, 'AF-001');
    expect(proposals).toHaveLength(1);
    const first = proposals[0];
    expect(first?.lots.map((lot) => lot.id).sort()).toEqual(['AF-001', 'AF-002', 'AF-003']);
    expect(first?.score).toBe(90);
    expect(groupingCriteria(first?.lots ?? [])).toEqual({
      sameProduct: true,
      sameDestination: true,
      datesCompatible: true,
      zoneCompatible: true,
    });
  });
});
