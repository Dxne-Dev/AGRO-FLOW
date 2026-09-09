import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';

type AuthHeaderProps = {
  /** Show “Retour aux profils” on the right (auth page). */
  showBackToProfiles?: boolean;
  /** Show public passport link on desktop (login page). */
  showPassportLink?: boolean;
};

export function AuthHeader({
  showBackToProfiles = false,
  showPassportLink = false,
}: AuthHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-5 md:h-16 md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/login"
            className="flex shrink-0 items-center gap-2.5 text-af-ink no-underline"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-af-green text-white shadow-sm shadow-af-green/25">
              <Leaf className="size-4" strokeWidth={2} aria-hidden />
            </span>
            <span className="text-base font-bold tracking-tight">AgroFlow</span>
          </Link>
          <span
            className="hidden truncate text-xs text-af-muted lg:inline"
            aria-hidden
          >
            Mutualiser les volumes · Organiser les flux
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {showPassportLink ? (
            <Link
              to="/passport/AF-001"
              className="hidden text-sm font-medium text-af-muted no-underline hover:text-af-ink md:inline"
            >
              Traçabilité
            </Link>
          ) : null}
          {showBackToProfiles ? (
            <Link
              to="/login"
              className="text-sm font-medium text-af-muted no-underline hover:text-af-ink"
            >
              Retour aux profils
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}
