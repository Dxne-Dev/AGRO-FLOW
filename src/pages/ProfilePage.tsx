import { Link, useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { Surface } from '../components/Surface';
import { useAuth } from '../auth/AuthContext';
import { profileForRole } from '../auth/types';
import { useAppState } from '../state/useAppState';

export function ProfilePage() {
  const { loadDemo, clearWorkspace, state } = useAppState();
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  if (!session) return null;

  const profile = profileForRole(session.role);
  const hasData =
    state.lots.length > 0 ||
    state.operations.length > 0 ||
    state.evenements.length > 0;

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="space-y-4">
      <AppHeader title="Profil" subtitle="Compte local par rôle." />
      <Surface>
        <p className="text-[11px] font-bold tracking-wide text-af-muted uppercase">
          Connecté en tant que
        </p>
        <p className="mt-2 text-lg font-bold text-af-ink">{session.displayName}</p>
        <p className="mt-1 text-sm font-bold text-af-green">{profile.label}</p>
        <p className="mt-1 font-mono text-[12px] text-af-muted">{session.email}</p>
        <p className="mt-3 text-sm text-af-muted">{profile.description}</p>
        {session.role === 'producteur' ? (
          <p className="mt-3 text-sm text-af-muted">
            Les lots créés depuis cette session sont rattachés à cette exploitation.
          </p>
        ) : null}
        {session.role === 'acheteur' ? (
          <Link
            to="/passport/AF-001"
            className="mt-4 inline-flex text-sm font-bold text-af-blue hover:underline"
          >
            Ouvrir le passeport AF-001 →
          </Link>
        ) : null}

        <div className="mt-5 space-y-2 border-t border-black/5 pt-4">
          <p className="text-[11px] font-bold tracking-wide text-af-muted uppercase">
            Workspace · {state.lots.length} lot(s)
          </p>
          <button
            type="button"
            onClick={loadDemo}
            className="flex h-12 w-full items-center justify-center rounded-2xl bg-af-green text-sm font-bold text-white uppercase hover:bg-af-green-dark"
          >
            Charger les données de démonstration
          </button>
          {hasData ? (
            <button
              type="button"
              onClick={clearWorkspace}
              className="flex h-12 w-full items-center justify-center rounded-2xl border border-black/10 bg-white text-sm font-bold text-af-ink uppercase hover:bg-af-canvas"
            >
              Vider le workspace
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-2xl border border-black/10 bg-white text-sm font-bold text-af-ink uppercase hover:bg-af-canvas"
        >
          Se déconnecter
        </button>
      </Surface>
    </div>
  );
}
