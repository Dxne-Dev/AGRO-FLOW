import { AppHeader } from '../components/AppHeader';
import { Surface } from '../components/Surface';
import { SESSION_PRODUCER } from '../session';
import { useAppState } from '../state/useAppState';

export function ProfilePage() {
  const { resetDemo } = useAppState();

  return (
    <div className="space-y-4">
      <AppHeader title="Profil" subtitle="Session producteur." />
      <Surface>
        <p className="text-[11px] font-bold tracking-wide text-af-muted uppercase">
          Connecté en tant que
        </p>
        <p className="mt-2 text-lg font-bold text-af-ink">{SESSION_PRODUCER}</p>
        <p className="mt-3 text-sm text-af-muted">
          Les lots créés depuis cette session sont automatiquement rattachés à
          cette exploitation. Pas d’authentification réelle au MVP.
        </p>
        <button
          type="button"
          onClick={resetDemo}
          className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-af-green text-sm font-bold text-white uppercase hover:bg-af-green-dark"
        >
          Réinitialiser la démo
        </button>
      </Surface>
    </div>
  );
}
