import type { UserAccount } from './users';
import { AUTH_STORAGE_KEY, profileForRole, type Session } from './types';

export function loadSession(): Session | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed.userId || !parsed.role || !parsed.displayName || !parsed.email) {
      return null;
    }
    profileForRole(parsed.role);
    return parsed;
  } catch {
    return null;
  }
}

export function saveSession(session: Session): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function createSessionFromUser(user: UserAccount): Session {
  return {
    userId: user.id,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
    loggedAt: new Date().toISOString(),
  };
}
