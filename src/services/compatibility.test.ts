import { describe, expect, it } from 'vitest';
import { buildSeed } from './seed';
import {
  calculateCompatibilityScore,
  hasMajorIncompatibility,
  scoreBadgeLabel,
} from './compatibility';

describe('compatibility', () => {
  const seed = buildSeed(new Date(2026, 8, 9));
  const byId = (id: string) => {
    const lot = seed.lots.find((item) => item.id === id);
    if (!lot) throw new Error(id);
    return lot;
  };

  it('scores AF-001 vs AF-002 at 90', () => {
    expect(calculateCompatibilityScore(byId('AF-001'), byId('AF-002'))).toBe(90);
  });

  it('scores AF-001 vs AF-003 and AF-002 vs AF-003 at 90', () => {
    expect(calculateCompatibilityScore(byId('AF-001'), byId('AF-003'))).toBe(90);
    expect(calculateCompatibilityScore(byId('AF-002'), byId('AF-003'))).toBe(90);
  });

  it('includes a medium pair (50–74) and a weak pair (<50)', () => {
    const medium = calculateCompatibilityScore(byId('AF-001'), byId('AF-004'));
    const weak = calculateCompatibilityScore(byId('AF-001'), byId('AF-005'));
    expect(medium).toBeGreaterThanOrEqual(50);
    expect(medium).toBeLessThan(75);
    expect(weak).toBeLessThan(50);
  });

  it('detects sans_contact + different product as major incompatibility', () => {
    expect(hasMajorIncompatibility(byId('AF-001'), byId('AF-006'))).toBe(true);
  });

  it('maps badge thresholds', () => {
    expect(scoreBadgeLabel(90)).toBe('haute');
    expect(scoreBadgeLabel(60)).toBe('moyenne');
    expect(scoreBadgeLabel(40)).toBe('faible');
  });
});
