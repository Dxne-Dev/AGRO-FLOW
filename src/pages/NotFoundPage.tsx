import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Page introuvable</h1>
      <p className="text-sm text-stone-600">Cette route n’existe pas dans AgroFlow.</p>
      <Link to="/" className="text-sm font-medium text-emerald-700 hover:underline">
        Retour au tableau de bord
      </Link>
    </div>
  );
}
