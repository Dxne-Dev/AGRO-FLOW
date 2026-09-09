import { useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';
import {
  clearWorkspace,
  loadDemoSeed,
  loadState,
  saveState,
} from '../services/storage';
import { reduce } from './reducer';
import { AppStateContext, type Store } from './useAppState';

export function AppStateProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const userId = session?.userId ?? null;
  const [state, dispatch] = useReducer(reduce, undefined, () =>
    loadState(userId),
  );

  useEffect(() => {
    dispatch({ type: 'reset', state: loadState(userId) });
  }, [userId]);

  useEffect(() => {
    saveState(userId, state);
  }, [state, userId]);

  const value = useMemo<Store>(
    () => ({
      state,
      dispatch,
      loadDemo: () => {
        if (!userId) return;
        dispatch({ type: 'reset', state: loadDemoSeed(userId) });
      },
      clearWorkspace: () => {
        if (!userId) return;
        dispatch({ type: 'reset', state: clearWorkspace(userId) });
      },
      resetDemo: () => {
        if (!userId) return;
        dispatch({ type: 'reset', state: loadDemoSeed(userId) });
      },
    }),
    [state, userId],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
