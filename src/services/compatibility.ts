import type { Lot } from '../types/lot'

/** Stub — pondération §5.2 à implémenter. */
export function calculateCompatibilityScore(_lotA: Lot, _lotB: Lot): number {
  return 0
}

export function calculateGroupScore(lots: Lot[]): number {
  if (lots.length < 2) return 0
  let total = 0
  let pairs = 0
  for (let i = 0; i < lots.length; i += 1) {
    for (let j = i + 1; j < lots.length; j += 1) {
      total += calculateCompatibilityScore(lots[i], lots[j])
      pairs += 1
    }
  }
  return Math.round(total / pairs)
}
