import { DEFAULT_GEO } from '../data/geo';
import type { GeoConfig, Lot } from '../types/lot';
import { normalizeLabel } from '../types/lot';

export function calendarDayDiff(a: string, b: string): number {
  const da = new Date(`${a}T00:00:00`);
  const db = new Date(`${b}T00:00:00`);
  return Math.abs(Math.round((da.getTime() - db.getTime()) / 86_400_000));
}

export function hasMajorIncompatibility(lotA: Lot, lotB: Lot): boolean {
  const differentProduct = normalizeLabel(lotA.produit) !== normalizeLabel(lotB.produit);
  if (
    (lotA.contraintes.includes('sans_contact') || lotB.contraintes.includes('sans_contact')) &&
    differentProduct
  ) {
    return true;
  }
  const heightA = lotA.contraintes.includes('hauteur_interdite');
  const heightB = lotB.contraintes.includes('hauteur_interdite');
  return heightA !== heightB;
}

function isAdjacent(geo: GeoConfig, a: string, b: string): boolean {
  return geo.adjacent[a]?.includes(b) === true;
}

function isNearbyDest(geo: GeoConfig, a: string, b: string): boolean {
  return geo.nearbyDestinations[a]?.includes(b) === true;
}

export function scoreProduct(lotA: Lot, lotB: Lot): number {
  if (normalizeLabel(lotA.produit) === normalizeLabel(lotB.produit)) return 30;
  if (normalizeLabel(lotA.categorie) === normalizeLabel(lotB.categorie)) return 20;
  return 0;
}

export function scoreDestination(lotA: Lot, lotB: Lot, geo: GeoConfig): number {
  if (lotA.destination === lotB.destination) return 25;
  if (isNearbyDest(geo, lotA.destination, lotB.destination)) return 12;
  return 0;
}

export function scoreZone(lotA: Lot, lotB: Lot, geo: GeoConfig): number {
  if (lotA.localisation === lotB.localisation) return 20;
  if (isAdjacent(geo, lotA.localisation, lotB.localisation)) return 10;
  return 0;
}

export function scoreAvailability(lotA: Lot, lotB: Lot): number {
  const delta = calendarDayDiff(lotA.dateDisponibilite, lotB.dateDisponibilite);
  if (delta <= 3) return 15;
  if (delta <= 7) return 8;
  return 0;
}

export function scoreConstraints(lotA: Lot, lotB: Lot): number {
  return hasMajorIncompatibility(lotA, lotB) ? 0 : 10;
}

export function calculateCompatibilityScore(
  lotA: Lot,
  lotB: Lot,
  geo: GeoConfig = DEFAULT_GEO,
): number {
  return (
    scoreProduct(lotA, lotB) +
    scoreDestination(lotA, lotB, geo) +
    scoreZone(lotA, lotB, geo) +
    scoreAvailability(lotA, lotB) +
    scoreConstraints(lotA, lotB)
  );
}

export function isPairEligible(score: number): boolean {
  return score >= 75;
}

export function scoreBadgeLabel(score: number): 'haute' | 'moyenne' | 'faible' {
  if (score >= 75) return 'haute';
  if (score >= 50) return 'moyenne';
  return 'faible';
}
