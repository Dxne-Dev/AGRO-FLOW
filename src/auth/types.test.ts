import { describe, expect, it } from 'vitest';
import { canAccess, homeForRole } from './types';

describe('canAccess', () => {
  it('allows public passport without session role check', () => {
    expect(canAccess('acheteur', '/passport/AF-001')).toBe(true);
    expect(canAccess('producteur', '/passport/AF-003')).toBe(true);
  });

  it('allows login and auth for every role', () => {
    expect(canAccess('producteur', '/login')).toBe(true);
    expect(canAccess('operateur', '/auth')).toBe(true);
  });

  it('restricts producteur to lot and matching routes', () => {
    expect(canAccess('producteur', '/')).toBe(true);
    expect(canAccess('producteur', '/lots/nouveau')).toBe(true);
    expect(canAccess('producteur', '/matching')).toBe(true);
    expect(canAccess('producteur', '/grouping')).toBe(false);
    expect(canAccess('producteur', '/operations')).toBe(false);
  });

  it('restricts transporteur to operations', () => {
    expect(canAccess('transporteur', '/operations')).toBe(true);
    expect(canAccess('transporteur', '/operations/OP-001')).toBe(true);
    expect(canAccess('transporteur', '/lots')).toBe(false);
    expect(canAccess('transporteur', '/matching')).toBe(false);
  });

  it('allows operateur on grouping and operations', () => {
    expect(canAccess('operateur', '/grouping')).toBe(true);
    expect(canAccess('operateur', '/operations/OP-001')).toBe(true);
    expect(canAccess('operateur', '/lots/nouveau')).toBe(true);
  });

  it('limits acheteur to dashboard and profile', () => {
    expect(canAccess('acheteur', '/')).toBe(true);
    expect(canAccess('acheteur', '/profil')).toBe(true);
    expect(canAccess('acheteur', '/lots')).toBe(false);
  });
});

describe('homeForRole', () => {
  it('returns dashboard for all demo roles', () => {
    expect(homeForRole('producteur')).toBe('/');
    expect(homeForRole('transporteur')).toBe('/');
    expect(homeForRole('acheteur')).toBe('/');
    expect(homeForRole('operateur')).toBe('/');
  });
});
