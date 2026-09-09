import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
  homeForRole,
  isRole,
  profileForRole,
  type Role,
} from '../auth/types';
import { AuthHeader } from '../components/AuthHeader';
import { ROLE_CARD_THEME } from '../components/RoleCard';

type Mode = 'login' | 'register';

const DEMO_CREDENTIALS: Record<Role, { email: string; password: string }> = {
  producteur: {
    email: 'producteur@agroflow.demo',
    password: 'Producteur2026!',
  },
  transporteur: {
    email: 'transporteur@agroflow.demo',
    password: 'Transport2026!',
  },
  acheteur: {
    email: 'acheteur@agroflow.demo',
    password: 'Acheteur2026!',
  },
  operateur: {
    email: 'operateur@agroflow.demo',
    password: 'Operateur2026!',
  },
};

export function AuthPage() {
  const { session, loginWithCredentials, register } = useAuth();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roleParam = params.get('role') ?? '';
  const role: Role | null = isRole(roleParam) ? roleParam : null;

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const profile = role ? profileForRole(role) : null;
  const theme = role ? ROLE_CARD_THEME[role] : null;

  if (session) {
    return <Navigate to={homeForRole(session.role)} replace />;
  }

  if (!role || !profile || !theme) {
    return <Navigate to="/login" replace />;
  }

  function fillDemoCredentials() {
    if (!role) return;
    const creds = DEMO_CREDENTIALS[role];
    setMode('login');
    setEmail(creds.email);
    setPassword(creds.password);
    setError('');
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    if (!role || !profile) return;

    if (mode === 'login') {
      const result = loginWithCredentials(email, password, role);
      if (!result.ok) {
        setError(result.error);
        return;
      }
    } else {
      const result = register({
        email,
        password,
        displayName: displayName || profile.displayName,
        role,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
    }
    navigate(homeForRole(role), { replace: true });
  }

  return (
    <div className="relative min-h-[100dvh] bg-af-canvas text-af-ink">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(29,138,90,0.08),_transparent_55%)]"
        aria-hidden
      />

      <AuthHeader showBackToProfiles />

      <div className="relative flex items-center justify-center px-5 py-10 md:py-14">
        <div className="relative w-full max-w-md">
          <div className="relative">
            <div
              className={`pointer-events-none absolute inset-x-6 top-[92%] bottom-[-1.5rem] z-0 rounded-[28px] ${theme.glow} ${theme.glowBlur}`}
              aria-hidden
            />

            <div className="relative z-10 overflow-hidden rounded-[20px] border border-black/10 bg-white/75 p-6 shadow-lg shadow-black/10 backdrop-blur-xl sm:p-8">
              <p className={`mb-4 text-sm font-bold ${theme.accentText}`}>
                {profile.label}
              </p>

              <h1 className="text-2xl font-bold tracking-tight">
                {mode === 'login' ? 'Connexion' : 'Créer un compte'}
              </h1>
              <p className="mt-2 text-sm text-af-muted">
                {mode === 'login'
                  ? 'Entrez vos identifiants pour ouvrir votre espace.'
                  : 'Votre espace démarre sans données. Vous pourrez en ajouter ensuite.'}
              </p>

              <div
                className="mt-5 grid grid-cols-2 gap-1 rounded-2xl bg-af-canvas p-1"
                role="tablist"
                aria-label="Mode d’authentification"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'login'}
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className={`rounded-xl py-2.5 text-sm font-bold transition ${
                    mode === 'login'
                      ? 'bg-white text-af-ink shadow-sm'
                      : 'text-af-muted hover:text-af-ink'
                  }`}
                >
                  Connexion
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'register'}
                  onClick={() => {
                    setMode('register');
                    setError('');
                    if (!displayName) setDisplayName(profile.displayName);
                  }}
                  className={`rounded-xl py-2.5 text-sm font-bold transition ${
                    mode === 'register'
                      ? 'bg-white text-af-ink shadow-sm'
                      : 'text-af-muted hover:text-af-ink'
                  }`}
                >
                  Créer un compte
                </button>
              </div>

              <form className="mt-6 space-y-4" onSubmit={submit}>
                {mode === 'register' ? (
                  <Field
                    label="Nom d’affichage"
                    value={displayName}
                    onChange={setDisplayName}
                    autoComplete="organization"
                    placeholder={profile.displayName}
                  />
                ) : null}
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  autoComplete="username"
                  placeholder={`${role}@agroflow.demo`}
                  required
                />
                <Field
                  label="Mot de passe"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  autoComplete={
                    mode === 'login' ? 'current-password' : 'new-password'
                  }
                  required
                />

                {error ? (
                  <p className="rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                    {error}
                  </p>
                ) : null}

                {mode === 'login' ? (
                  <button
                    type="button"
                    onClick={fillDemoCredentials}
                    className="w-full text-left text-sm font-medium text-af-muted underline-offset-2 hover:text-af-ink hover:underline"
                  >
                    Utiliser le compte de démonstration
                  </button>
                ) : null}

                <button
                  type="submit"
                  className="flex h-12 w-full items-center justify-center rounded-2xl bg-af-green text-sm font-bold text-white hover:bg-af-green-dark"
                >
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-wide text-af-muted uppercase">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        className="mt-1.5 h-12 w-full rounded-2xl border border-black/10 bg-white/80 px-4 text-sm text-af-ink outline-none focus:border-af-green"
      />
    </label>
  );
}
