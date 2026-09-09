import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildSeed } from './seed';
import { loadState, resetState, saveState, STORAGE_KEY } from './storage';

const memory = new Map<string, string>();

vi.stubGlobal('localStorage', {
  getItem: (key: string) => memory.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memory.set(key, value);
  },
  removeItem: (key: string) => {
    memory.delete(key);
  },
  clear: () => memory.clear(),
  key: () => null,
  length: 0,
});

describe('storage', () => {
  const now = new Date(2026, 8, 9);

  afterEach(() => {
    memory.clear();
  });

  it('seeds when the key is missing', () => {
    const state = loadState(now);
    expect(state.lots[0]?.id).toBe('AF-001');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('returns persisted state without re-applying offsets', () => {
    const seeded = buildSeed(now);
    const mutated = {
      ...seeded,
      lots: seeded.lots.map((lot) =>
        lot.id === 'AF-001' ? { ...lot, statut: 'en_transit' as const } : lot,
      ),
    };
    saveState(mutated);
    const loaded = loadState(new Date(2026, 10, 1));
    expect(loaded.lots.find((l) => l.id === 'AF-001')?.statut).toBe('en_transit');
    expect(loaded.lots.find((l) => l.id === 'AF-001')?.dateDisponibilite).toBe(
      mutated.lots[0]?.dateDisponibilite,
    );
  });

  it('reseeds on invalid JSON', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    memory.set(STORAGE_KEY, '{not-json');
    const state = loadState(now);
    expect(state.lots).toHaveLength(buildSeed(now).lots.length);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('reset writes a fresh seed', () => {
    saveState({ lots: [], operations: [], evenements: [] });
    const reset = resetState(now);
    expect(reset.lots.length).toBeGreaterThan(0);
    expect(JSON.parse(memory.get(STORAGE_KEY) ?? '{}').lots[0].id).toBe('AF-001');
  });
});
