import type { Contrainte, Evenement, Lot, StatutLot, TypeEvenement } from '../types/lot';
import evenementsSeed from '../data/evenements.seed.json';
import lotsSeed from '../data/lots.seed.json';

export interface LotSeed {
  id: string;
  produit: string;
  categorie: string;
  quantiteKg: number;
  producteur: string;
  localisation: string;
  destination: string;
  dateDisponibiliteOffsetDays: number;
  contraintes: Contrainte[];
  statut: StatutLot;
}

export interface EvenementSeed {
  id: string;
  lotId?: string;
  operationId?: string;
  type: TypeEvenement;
  message: string;
  offsetHours: number;
  retardHeures?: number;
}

function padDatePart(value: number): string {
  return String(value).padStart(2, '0');
}

export function toIsoDate(now: Date, offsetDays: number): string {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays);
  return `${d.getFullYear()}-${padDatePart(d.getMonth() + 1)}-${padDatePart(d.getDate())}`;
}

export function shiftHours(now: Date, offsetHours: number): string {
  return new Date(now.getTime() + offsetHours * 60 * 60 * 1000).toISOString();
}

export function buildSeed(now: Date) {
  const lots: Lot[] = (lotsSeed as LotSeed[]).map((row) => ({
    id: row.id,
    produit: row.produit,
    categorie: row.categorie,
    quantiteKg: row.quantiteKg,
    producteur: row.producteur,
    localisation: row.localisation,
    destination: row.destination,
    dateDisponibilite: toIsoDate(now, row.dateDisponibiliteOffsetDays),
    contraintes: row.contraintes,
    statut: row.statut,
  }));

  const evenements: Evenement[] = (evenementsSeed as EvenementSeed[]).map((row) => ({
    id: row.id,
    lotId: row.lotId,
    operationId: row.operationId,
    type: row.type,
    message: row.message,
    date: shiftHours(now, row.offsetHours),
    retardHeures: row.retardHeures,
  }));

  return {
    lots,
    operations: [],
    evenements,
  };
}
