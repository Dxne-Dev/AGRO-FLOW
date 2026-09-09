import { createContext, useContext } from 'react';
import type { AppState } from '../types/lot';
import type { Action } from './reducer';

export type Store = {
  state: AppState;
  dispatch: (action: Action) => void;
  /** Injecte le scénario AF-001… dans le workspace du compte. */
  loadDemo: () => void;
  /** Vide lots / opérations / événements. */
  clearWorkspace: () => void;
  /** Alias de loadDemo (compat profil). */
  resetDemo: () => void;
};

export const AppStateContext = createContext<Store | null>(null);

export function useAppState(): Store {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
