import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { DEMO_PROFILES, homeForRole, type Role } from '../auth/types';
import { AuthHeader } from '../components/AuthHeader';
import { RoleCard } from '../components/RoleCard';

export function LoginPage() {
  const { session } = useAuth();
  const navigate = useNavigate();

  if (session) {
    return <Navigate to={homeForRole(session.role)} replace />;
  }

  function choose(role: Role) {
    navigate(`/auth?role=${role}`);
  }

  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-af-canvas text-af-ink">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,138,90,0.08),_transparent_55%),radial-gradient(ellipse_at_bottom_right,_rgba(33,97,196,0.06),_transparent_50%)]"
        aria-hidden
      />

      <AuthHeader showPassportLink />

      <div className="relative mx-auto flex w-full max-w-6xl flex-col px-5 py-10 pb-20 md:px-8 md:py-14 md:pb-24">
        <header className="mb-10 max-w-2xl md:mb-14">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Accéder à AgroFlow
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-af-muted md:text-base">
            Choisissez le profil correspondant à votre activité, puis
            connectez-vous.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-x-5 gap-y-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-16">
          {DEMO_PROFILES.map((profile, index) => (
            <RoleCard
              key={profile.role}
              role={profile.role}
              label={profile.label}
              displayName={profile.displayName}
              description={profile.description}
              index={index}
              onSelect={() => choose(profile.role)}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}
