export type Role =
  | 'producteur'
  | 'transporteur'
  | 'acheteur'
  | 'operateur';

export interface Session {
  userId: string;
  email: string;
  role: Role;
  displayName: string;
  loggedAt: string;
}

export interface RoleProfile {
  role: Role;
  label: string;
  description: string;
  displayName: string;
}

/** Routes autorisées par rôle (hors `/passport/:lotId` public, `/login`, `/auth`). */
export const ROLE_ROUTES: Record<Role, readonly string[]> = {
  producteur: ['/', '/lots', '/lots/nouveau', '/matching', '/profil'],
  transporteur: ['/', '/operations', '/operations/:id', '/profil'],
  acheteur: ['/', '/profil'],
  operateur: [
    '/',
    '/lots',
    '/lots/nouveau',
    '/matching',
    '/grouping',
    '/operations',
    '/operations/:id',
    '/profil',
  ],
} as const;

export const DEMO_PROFILES: readonly RoleProfile[] = [
  {
    role: 'producteur',
    label: 'Producteur',
    description:
      'Déclarez vos volumes et trouvez des opportunités de regroupement.',
    displayName: 'Coop. Zagnanado',
  },
  {
    role: 'transporteur',
    label: 'Transporteur',
    description:
      'Consultez les opérations, volumes et trajets à prendre en charge.',
    displayName: 'Transport Atlantique',
  },
  {
    role: 'acheteur',
    label: 'Acheteur',
    description: 'Vérifiez l’origine et le parcours d’un lot via son passeport.',
    displayName: 'Marché Dantokpa',
  },
  {
    role: 'operateur',
    label: 'Opérateur logistique',
    description: 'Validez les regroupements, planifiez et suivez les alertes.',
    displayName: 'Ops AgroFlow',
  },
] as const;

export const AUTH_STORAGE_KEY = 'agroflow_session_v1';

function patternToRegex(pattern: string): RegExp {
  const escaped = pattern
    .split('/')
    .map((segment) => {
      if (segment.startsWith(':')) return '[^/]+';
      return segment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    })
    .join('/');
  return new RegExp(`^${escaped}$`);
}

export function canAccess(role: Role, pathname: string): boolean {
  const path = pathname.split('?')[0] ?? pathname;
  if (path === '/login' || path === '/auth') return true;
  if (path.startsWith('/passport/')) return true;

  return ROLE_ROUTES[role].some((pattern) => patternToRegex(pattern).test(path));
}

export function homeForRole(role: Role): string {
  const routes = ROLE_ROUTES[role];
  return routes.includes('/') ? '/' : (routes[0] ?? '/login');
}

export function profileForRole(role: Role): RoleProfile {
  const found = DEMO_PROFILES.find((p) => p.role === role);
  if (!found) {
    throw new Error(`Unknown role: ${role}`);
  }
  return found;
}

export function isRole(value: string): value is Role {
  return DEMO_PROFILES.some((p) => p.role === value);
}
