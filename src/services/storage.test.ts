import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildSeed } from './seed';
import {
  clearWorkspace,
  emptyState,
  loadDemoSeed,
  loadState,
  saveState,
  storageKeyForUser,
} from './storage';

const memory = new Map<string, string>();
const USER = 'user-test';

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

describe('storage (per-user)', () => {
  const now = new Date(2026, 8, 9);

  afterEach(() => {
    memory.clear();
  });

  it('returns empty workspace when no key', () => {
    const state = loadState(USER, now);
    expect(state).toEqual(emptyState());
  });

  it('returns empty when userId is null', () => {
    expect(loadState(null)).toEqual(emptyState());
  });

  it('persists and reloads without reseed', () => {
    const seeded = buildSeed(now);
    saveState(USER, seeded);
    const loaded = loadState(USER, new Date(2026, 10, 1));
    expect(loaded.lots[0]?.id).toBe('AF-001');
    expect(loaded.lots.find((l) => l.id === 'AF-001')?.dateDisponibilite).toBe(
      seeded.lots[0]?.dateDisponibilite,
    );
  });

  it('loadDemoSeed writes AF lots', () => {
    const demo = loadDemoSeed(USER, now);
    expect(demo.lots.length).toBeGreaterThan(0);
    expect(JSON.parse(memory.get(storageKeyForUser(USER)) ?? '{}').lots[0].id).toBe(
      'AF-001',
    );
  });

  it('clearWorkspace empties data', () => {
    loadDemoSeed(USER, now);
    const cleared = clearWorkspace(USER);
    expect(cleared.lots).toHaveLength(0);
  });
});
