import { describe, expect, it } from 'vitest';
import { nextEventId, nextLotId, nextOperationId } from './ids';

describe('ids', () => {
  it('starts at 001 when empty', () => {
    expect(nextLotId([])).toBe('AF-001');
    expect(nextOperationId([])).toBe('OP-001');
    expect(nextEventId([])).toBe('EV-001');
  });

  it('increments from the max numeric suffix', () => {
    const lots = Array.from({ length: 15 }, (_, i) => ({
      id: `AF-${String(i + 1).padStart(3, '0')}`,
    }));
    expect(nextLotId(lots)).toBe('AF-016');
  });
});
