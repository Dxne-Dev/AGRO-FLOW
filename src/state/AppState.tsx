import { useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { loadState, resetState, saveState } from '../services/storage';
import { reduce } from './reducer';
import { AppStateContext, type Store } from './useAppState';

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reduce, undefined, () => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo<Store>(
    () => ({
      state,
      dispatch,
      resetDemo: () => dispatch({ type: 'reset', state: resetState() }),
    }),
    [state],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}
