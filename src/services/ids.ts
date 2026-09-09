function nextPrefixedId(prefix: string, ids: string[]): string {
  let max = 0;
  for (const id of ids) {
    const match = id.match(new RegExp(`^${prefix}-(\\d+)$`));
    if (!match) continue;
    const n = Number(match[1]);
    if (n > max) max = n;
  }
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

export function nextLotId(lots: { id: string }[]): string {
  return nextPrefixedId('AF', lots.map((lot) => lot.id));
}

export function nextOperationId(operations: { id: string }[]): string {
  return nextPrefixedId('OP', operations.map((op) => op.id));
}

export function nextEventId(events: { id: string }[]): string {
  return nextPrefixedId('EV', events.map((event) => event.id));
}
