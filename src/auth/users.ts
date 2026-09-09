import accountsSeed from '../data/accounts.seed.json';
import type { Role } from './types';

export const USERS_STORAGE_KEY = 'agroflow_users_v1';

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  role: Role;
  displayName: string;
  createdAt: string;
}

export interface SeedAccount {
  id: string;
  email: string;
  password: string;
  role: Role;
  displayName: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isUserAccount(value: unknown): value is UserAccount {
  if (typeof value !== 'object' || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === 'string' &&
    typeof row.email === 'string' &&
    typeof row.password === 'string' &&
    typeof row.role === 'string' &&
    typeof row.displayName === 'string'
  );
}

export function loadUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return bootstrapSeedUsers();
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.every(isUserAccount)) {
      return bootstrapSeedUsers();
    }
    return mergeMissingSeedUsers(parsed);
  } catch {
    return bootstrapSeedUsers();
  }
}

function saveUsers(users: UserAccount[]): void {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function seedAsUsers(): UserAccount[] {
  const now = new Date().toISOString();
  return (accountsSeed as SeedAccount[]).map((row) => ({
    ...row,
    email: normalizeEmail(row.email),
    createdAt: now,
  }));
}

function bootstrapSeedUsers(): UserAccount[] {
  const users = seedAsUsers();
  saveUsers(users);
  return users;
}

/** Garantit que les 4 comptes seed existent même si l’utilisateur a déjà une liste. */
function mergeMissingSeedUsers(existing: UserAccount[]): UserAccount[] {
  const byEmail = new Map(existing.map((u) => [normalizeEmail(u.email), u]));
  let changed = false;
  for (const seed of seedAsUsers()) {
    if (!byEmail.has(seed.email)) {
      byEmail.set(seed.email, seed);
      changed = true;
    }
  }
  const merged = Array.from(byEmail.values());
  if (changed) saveUsers(merged);
  return merged;
}

export function findUserByEmail(email: string): UserAccount | undefined {
  const normalized = normalizeEmail(email);
  return loadUsers().find((u) => u.email === normalized);
}

export function authenticate(
  email: string,
  password: string,
  expectedRole?: Role,
): { ok: true; user: UserAccount } | { ok: false; error: string } {
  const user = findUserByEmail(email);
  if (!user) return { ok: false, error: 'Aucun compte pour cet email.' };
  if (user.password !== password) {
    return { ok: false, error: 'Mot de passe incorrect.' };
  }
  if (expectedRole && user.role !== expectedRole) {
    return {
      ok: false,
      error: `Ce compte est un ${user.role}, pas un ${expectedRole}.`,
    };
  }
  return { ok: true, user };
}

export function registerUser(input: {
  email: string;
  password: string;
  displayName: string;
  role: Role;
}): { ok: true; user: UserAccount } | { ok: false; error: string } {
  const email = normalizeEmail(input.email);
  if (!email.includes('@')) {
    return { ok: false, error: 'Email invalide.' };
  }
  if (input.password.trim().length < 6) {
    return { ok: false, error: 'Mot de passe : au moins 6 caractères.' };
  }
  if (!input.displayName.trim()) {
    return { ok: false, error: 'Indiquez un nom d’affichage.' };
  }
  if (findUserByEmail(email)) {
    return { ok: false, error: 'Un compte existe déjà avec cet email.' };
  }

  const user: UserAccount = {
    id: `user-${Date.now().toString(36)}`,
    email,
    password: input.password,
    role: input.role,
    displayName: input.displayName.trim(),
    createdAt: new Date().toISOString(),
  };
  const users = loadUsers();
  users.push(user);
  saveUsers(users);
  return { ok: true, user };
}
