import type { GeoConfig } from '../types/lot';

export const DEFAULT_GEO: GeoConfig = {
  adjacent: {
    Bohicon: ['Allada', 'Abomey-Calavi'],
    Allada: ['Bohicon', 'Abomey-Calavi'],
    'Abomey-Calavi': ['Allada', 'Bohicon', 'Porto-Novo'],
    'Porto-Novo': ['Abomey-Calavi'],
    Parakou: [],
  },
  nearbyDestinations: {
    Cotonou: ['Abomey-Calavi', 'Porto-Novo'],
    'Abomey-Calavi': ['Cotonou', 'Porto-Novo'],
    'Porto-Novo': ['Cotonou', 'Abomey-Calavi'],
  },
};
