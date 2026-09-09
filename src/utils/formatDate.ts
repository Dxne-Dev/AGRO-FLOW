export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  });
}

export function todayIso(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addDaysIso(isoDate: string, days: number): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  const date = new Date(y ?? 0, (m ?? 1) - 1, (d ?? 1) + days);
  return todayIso(date);
}

export function formatDisponibilite(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return `Disponible ${isoDate}`;
  const formatted = date
    .toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
    .replace('.', '');
  return `Disponible ${formatted}`;
}

export function formatDateRange(fromIso: string, toIso: string): string {
  const from = new Date(`${fromIso}T00:00:00`);
  const to = new Date(`${toIso}T00:00:00`);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return `${formatDate(fromIso)} – ${formatDate(toIso)}`;
  }
  const sameMonth =
    from.getMonth() === to.getMonth() && from.getFullYear() === to.getFullYear();
  const monthYear = to.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  if (sameMonth) {
    return `${from.getDate()}–${to.getDate()} ${monthYear}`;
  }
  return `${from.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} – ${to.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}
