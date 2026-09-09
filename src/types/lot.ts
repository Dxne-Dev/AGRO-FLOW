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

export interface Lot {
  id: string
  produit: string
  categorie: string
  quantiteKg: number
  producteur: string
  localisation: string
  destination: string
  dateDisponibilite: string
  contraintes: Contrainte[]
  statut: StatutLot
}

export interface Evenement {
  id: string
  lotId: string
  type: 'changement_statut' | 'retard' | 'incident' | 'note'
  message: string
  date: string
}

export type StatutOperation =
  | 'proposee'
  | 'validee'
  | 'planifiee'
  | 'en_transit'
  | 'arrivee'

export interface Operation {
  id: string
  lots: Lot[]
  scoreCompatibilite: number
  statut: StatutOperation
  poidsTotalKg: number
  depart: string
  destination: string
  dateDepart: string
  evenements: Evenement[]
}

export type SeveriteAlerte = 'info' | 'vigilance' | 'critique'

export interface Alerte {
  severite: SeveriteAlerte
  message: string
  sourceId: string
}

export interface AgroFlowState {
  lots: Lot[]
  operations: Operation[]
  evenements: Evenement[]
}

export const LOCALISATIONS = [
  'Bohicon',
  'Allada',
  'Abomey-Calavi',
  'Porto-Novo',
  'Parakou',
] as const

export const DESTINATIONS = [
  'Cotonou',
  'Abomey-Calavi',
  'Porto-Novo',
] as const

export const STORAGE_KEY = 'agroflow_state_v1'
