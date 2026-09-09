import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  authenticate,
  loadUsers,
  registerUser,
  USERS_STORAGE_KEY,
} from './users';

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

describe('users auth', () => {
  afterEach(() => {
    memory.clear();
  });

  it('bootstraps seed accounts', () => {
    const users = loadUsers();
    expect(users.some((u) => u.email === 'producteur@agroflow.demo')).toBe(true);
    expect(memory.get(USERS_STORAGE_KEY)).toBeTruthy();
  });

  it('authenticates seed producteur', () => {
    loadUsers();
    const result = authenticate(
      'producteur@agroflow.demo',
      'Producteur2026!',
      'producteur',
    );
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.user.displayName).toBe('Coop. Zagnanado');
    }
  });

  it('rejects wrong role', () => {
    loadUsers();
    const result = authenticate(
      'producteur@agroflow.demo',
      'Producteur2026!',
      'operateur',
    );
    expect(result.ok).toBe(false);
  });

  it('registers a new account', () => {
    loadUsers();
    const result = registerUser({
      email: 'nouveau@ferme.bj',
      password: 'secret12',
      displayName: 'Ferme Test',
      role: 'producteur',
    });
    expect(result.ok).toBe(true);
    const again = registerUser({
      email: 'nouveau@ferme.bj',
      password: 'secret12',
      displayName: 'Ferme Test',
      role: 'producteur',
    });
    expect(again.ok).toBe(false);
  });
});
