import { createContext, useContext } from 'react';
import type { AppState } from '../types/lot';
import type { Action } from './reducer';

export type Store = {
  state: AppState;
  dispatch: (action: Action) => void;
  resetDemo: () => void;
};

export const AppStateContext = createContext<Store | null>(null);

export function useAppState(): Store {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
}
