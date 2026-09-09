import type { AppState } from '../types/lot';
import { buildSeed } from './seed';

export const STORAGE_KEY = 'agroflow_state_v1';

function isAppState(value: unknown): value is AppState {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record.lots) &&
    Array.isArray(record.operations) &&
    Array.isArray(record.evenements)
  );
}

export function loadState(now = new Date()): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return buildSeed(now);
    const parsed: unknown = JSON.parse(raw);
    if (!isAppState(parsed)) {
      console.warn('AgroFlow: état localStorage invalide, reseed.');
      return buildSeed(now);
    }
    return parsed;
  } catch {
    console.warn('AgroFlow: JSON localStorage illisible, reseed.');
    return buildSeed(now);
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(now = new Date()): AppState {
  const seeded = buildSeed(now);
  saveState(seeded);
  return seeded;
}
