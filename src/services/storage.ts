import evenementsSeed from '../data/evenements.json'
import lotsSeed from '../data/lots.json'
import type { AgroFlowState, Evenement, Lot } from '../types/lot'
import { STORAGE_KEY } from '../types/lot'

function createSeedState(): AgroFlowState {
  return {
    lots: lotsSeed as Lot[],
    operations: [],
    evenements: evenementsSeed as Evenement[],
  }
}

export function loadState(): AgroFlowState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createSeedState()
    const parsed = JSON.parse(raw) as AgroFlowState
    if (!Array.isArray(parsed.lots) || !Array.isArray(parsed.operations)) {
      return createSeedState()
    }
    return {
      lots: parsed.lots,
      operations: parsed.operations,
      evenements: Array.isArray(parsed.evenements) ? parsed.evenements : [],
    }
  } catch {
    return createSeedState()
  }
}

export function saveState(state: AgroFlowState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): AgroFlowState {
  const seed = createSeedState()
  saveState(seed)
  return seed
}
