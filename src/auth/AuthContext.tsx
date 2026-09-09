import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { clearSession, createSessionFromUser, loadSession, saveSession } from './session';
import {
  authenticate,
  loadUsers,
  registerUser,
  type UserAccount,
} from './users';
import type { Role, Session } from './types';

type AuthResult = { ok: true } | { ok: false; error: string };

type AuthStore = {
  session: Session | null;
  loginWithCredentials: (
    email: string,
    password: string,
    role: Role,
  ) => AuthResult;
  register: (input: {
    email: string;
    password: string;
    displayName: string;
    role: Role;
  }) => AuthResult;
  logout: () => void;
};

const AuthContext = createContext<AuthStore | null>(null);

function applyUser(user: UserAccount, setSession: (s: Session | null) => void) {
  const next = createSessionFromUser(user);
  saveSession(next);
  setSession(next);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(() => {
    loadUsers();
    return loadSession();
  });

  const loginWithCredentials = useCallback(
    (email: string, password: string, role: Role): AuthResult => {
      const result = authenticate(email, password, role);
      if (!result.ok) return result;
      applyUser(result.user, setSession);
      return { ok: true };
    },
    [],
  );

  const register = useCallback(
    (input: {
      email: string;
      password: string;
      displayName: string;
      role: Role;
    }): AuthResult => {
      const result = registerUser(input);
      if (!result.ok) return result;
      applyUser(result.user, setSession);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({ session, loginWithCredentials, register, logout }),
    [session, loginWithCredentials, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthStore {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
