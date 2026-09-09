import { DEFAULT_GEO } from '../data/geo';
import type { GeoConfig, Lot, Operation } from '../types/lot';
import { normalizeLabel } from '../types/lot';
import {
  calculateCompatibilityScore,
  hasMajorIncompatibility,
  isPairEligible,
  scoreAvailability,
  scoreZone,
} from './compatibility';

function pairs<T>(items: T[]): [T, T][] {
  const result: [T, T][] = [];
  for (let i = 0; i < items.length; i += 1) {
    for (let j = i + 1; j < items.length; j += 1) {
      result.push([items[i] as T, items[j] as T]);
    }
  }
  return result;
}

export function groupingScore(lots: Lot[], geo: GeoConfig = DEFAULT_GEO): number {
  const allPairs = pairs(lots);
  if (allPairs.length === 0) return 0;
  const total = allPairs.reduce(
    (sum, [a, b]) => sum + calculateCompatibilityScore(a, b, geo),
    0,
  );
  return Math.round(total / allPairs.length);
}

export function isGroupEligible(lots: Lot[], geo: GeoConfig = DEFAULT_GEO): boolean {
  if (lots.length < 2) return false;
  const destination = lots[0]?.destination;
  if (!destination || lots.some((lot) => lot.destination !== destination)) return false;
  return pairs(lots).every(([a, b]) => {
    const score = calculateCompatibilityScore(a, b, geo);
    return isPairEligible(score) && !hasMajorIncompatibility(a, b);
  });
}

export function createOperationInput(
  lots: Lot[],
  geo: GeoConfig = DEFAULT_GEO,
): Omit<Operation, 'id' | 'evenementIds'> {
  const first = lots[0];
  if (!first) {
    throw new Error('Au moins un lot est requis');
  }
  return {
    lotIds: lots.map((lot) => lot.id),
    scoreCompatibilite: groupingScore(lots, geo),
    statut: 'validee',
    poidsTotalKg: lots.reduce((sum, lot) => sum + lot.quantiteKg, 0),
    depart: first.localisation,
    destination: first.destination,
    dateDepart: null,
  };
}

export function countOpportunityDestinations(
  lots: Lot[],
  geo: GeoConfig = DEFAULT_GEO,
): number {
  const disponible = lots.filter((lot) => lot.statut === 'disponible');
  const destinations = [...new Set(disponible.map((lot) => lot.destination))];
  return destinations.filter((dest) => {
    const group = disponible.filter((lot) => lot.destination === dest);
    return pairs(group).some(([a, b]) => isGroupEligible([a, b], geo));
  }).length;
}

/** Largest pairwise-eligible cluster of `disponible` lots (same destination). */
export function largestEligibleCluster(
  lots: Lot[],
  geo: GeoConfig = DEFAULT_GEO,
): Lot[] | null {
  const disponible = lots.filter((lot) => lot.statut === 'disponible');
  let best: Lot[] = [];

  for (const dest of new Set(disponible.map((lot) => lot.destination))) {
    const group = disponible.filter((lot) => lot.destination === dest);
    if (isGroupEligible(group, geo) && group.length > best.length) {
      best = group;
      continue;
    }
    const products = [...new Set(group.map((lot) => lot.produit.trim().toLowerCase()))];
    for (const product of products) {
      const same = group.filter((lot) => lot.produit.trim().toLowerCase() === product);
      if (isGroupEligible(same, geo) && same.length > best.length) {
        best = same;
      }
    }
    for (const [a, b] of pairs(group)) {
      const candidate = [a, b];
      if (isGroupEligible(candidate, geo) && candidate.length > best.length) {
        best = candidate;
      }
    }
  }

  return best.length >= 2 ? best : null;
}

export interface GroupingProposal {
  lots: Lot[];
  score: number;
}

export function groupingCriteria(lots: Lot[], geo: GeoConfig = DEFAULT_GEO) {
  const first = lots[0];
  const allPairs = pairs(lots);
  return {
    sameProduct: Boolean(
      first && lots.every((lot) => normalizeLabel(lot.produit) === normalizeLabel(first.produit)),
    ),
    sameDestination: Boolean(
      first && lots.every((lot) => lot.destination === first.destination),
    ),
    datesCompatible:
      allPairs.length === 0 || allPairs.every(([a, b]) => scoreAvailability(a, b) > 0),
    zoneCompatible:
      allPairs.length === 0 || allPairs.every(([a, b]) => scoreZone(a, b, geo) > 0),
  };
}

/** Eligible grouping proposals that include the reference lot, largest-first. */
export function proposalsForReference(
  lots: Lot[],
  referenceId: string,
  geo: GeoConfig = DEFAULT_GEO,
): GroupingProposal[] {
  const disponible = lots.filter((lot) => lot.statut === 'disponible');
  const reference = disponible.find((lot) => lot.id === referenceId);
  if (!reference) return [];

  let remaining = disponible.filter(
    (lot) => lot.id !== referenceId && isGroupEligible([reference, lot], geo),
  );
  const proposals: GroupingProposal[] = [];

  while (remaining.length > 0) {
    const ranked = [...remaining].sort(
      (a, b) =>
        calculateCompatibilityScore(reference, b, geo) -
        calculateCompatibilityScore(reference, a, geo),
    );
    const cluster = [reference];
    const usedIds = new Set<string>();
    for (const lot of ranked) {
      if (isGroupEligible([...cluster, lot], geo)) {
        cluster.push(lot);
        usedIds.add(lot.id);
      }
    }
    if (cluster.length < 2) break;
    proposals.push({ lots: cluster, score: groupingScore(cluster, geo) });
    remaining = remaining.filter((lot) => !usedIds.has(lot.id));
  }

  return proposals;
}
