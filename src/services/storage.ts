import type { AppState } from '../types/lot';
import { buildSeed } from './seed';

/** Préfixe : `agroflow_state_v1__<userId>` */
export const STORAGE_KEY_PREFIX = 'agroflow_state_v1';

export function storageKeyForUser(userId: string): string {
  return `${STORAGE_KEY_PREFIX}__${userId}`;
}

/** @deprecated clé globale legacy — migrée / ignorée au profit du scope user */
export const STORAGE_KEY = STORAGE_KEY_PREFIX;

export function emptyState(): AppState {
  return { lots: [], operations: [], evenements: [] };
}

function isAppState(value: unknown): value is AppState {
  if (typeof value !== 'object' || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    Array.isArray(record.lots) &&
    Array.isArray(record.operations) &&
    Array.isArray(record.evenements)
  );
}

export function loadState(userId: string | null, _now = new Date()): AppState {
  if (!userId) return emptyState();
  try {
    const raw = localStorage.getItem(storageKeyForUser(userId));
    if (!raw) return emptyState();
    const parsed: unknown = JSON.parse(raw);
    if (!isAppState(parsed)) {
      console.warn('AgroFlow: état localStorage invalide, workspace vide.');
      return emptyState();
    }
    return parsed;
  } catch {
    console.warn('AgroFlow: JSON localStorage illisible, workspace vide.');
    return emptyState();
  }
}

export function saveState(userId: string | null, state: AppState): void {
  if (!userId) return;
  localStorage.setItem(storageKeyForUser(userId), JSON.stringify(state));
}

/** Charge le scénario démo (AF-001…) dans le workspace du compte. */
export function loadDemoSeed(userId: string, now = new Date()): AppState {
  const seeded = buildSeed(now);
  saveState(userId, seeded);
  return seeded;
}

/** Vide le workspace du compte (sans supprimer le compte). */
export function clearWorkspace(userId: string): AppState {
  const empty = emptyState();
  saveState(userId, empty);
  return empty;
}

/** Alias pitch : recharge le seed démo. */
export function resetState(userId: string, now = new Date()): AppState {
  return loadDemoSeed(userId, now);
}
