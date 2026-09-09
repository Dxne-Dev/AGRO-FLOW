import type { Alerte, Operation } from '../types/lot'

/** Capacité véhicule standard (kg) — spec §6 R3 */
export const CAPACITE_VEHICULE_KG = 1000

/** Stub — règles R1–R4 §6 à implémenter. */
export function checkAlerts(_operation: Operation): Alerte[] {
  return []
}
