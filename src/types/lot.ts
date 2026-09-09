export type StatutLot =
  | 'disponible'
  | 'en_groupement'
  | 'planifie'
  | 'en_transit'
  | 'arrive';

export type Contrainte =
  | 'fragile'
  | 'temperature_ambiante'
  | 'hauteur_interdite'
  | 'urgent'
  | 'sans_contact';

export type StatutOperation =
  | 'validee'
  | 'planifiee'
  | 'en_transit'
  | 'arrivee';

export type TypeEvenement =
  | 'changement_statut'
  | 'retard'
  | 'incident'
  | 'note';

export interface Lot {
  id: string;
  produit: string;
  categorie: string;
  quantiteKg: number;
  producteur: string;
  localisation: string;
  destination: string;
  dateDisponibilite: string;
  contraintes: Contrainte[];
  statut: StatutLot;
}

export interface Evenement {
  id: string;
  lotId?: string;
  operationId?: string;
  type: TypeEvenement;
  message: string;
  date: string;
  retardHeures?: number;
  resolvedAt?: string;
}

export interface Operation {
  id: string;
  lotIds: string[];
  scoreCompatibilite: number;
  statut: StatutOperation;
  poidsTotalKg: number;
  depart: string;
  destination: string;
  dateDepart: string | null;
  evenementIds: string[];
}

export interface Alerte {
  id: string;
  severite: 'info' | 'vigilance' | 'critique';
  message: string;
  ruleId: 'R1' | 'R2' | 'R3' | 'R4';
  sourceId: string;
}

export interface AppState {
  lots: Lot[];
  operations: Operation[];
  evenements: Evenement[];
}

export interface GeoConfig {
  adjacent: Record<string, string[]>;
  nearbyDestinations: Record<string, string[]>;
}

export const ORIGINES = [
  'Bohicon',
  'Allada',
  'Abomey-Calavi',
  'Porto-Novo',
  'Parakou',
] as const;

export const DESTINATIONS = [
  'Cotonou',
  'Abomey-Calavi',
  'Porto-Novo',
] as const;

export const PRODUCT_CATEGORY: Record<string, string> = {
  maïs: 'céréale',
  mil: 'céréale',
  riz: 'céréale',
  sorgho: 'céréale',
  soja: 'légumineuse',
  niébé: 'légumineuse',
  arachide: 'légumineuse',
  ananas: 'fruit',
  mangue: 'fruit',
  orange: 'fruit',
  piment: 'légume',
  gombo: 'légume',
  tomate: 'légume',
};

export function normalizeLabel(value: string): string {
  return value.trim().toLowerCase();
}

export function inferCategory(produit: string): string | undefined {
  return PRODUCT_CATEGORY[normalizeLabel(produit)];
}
