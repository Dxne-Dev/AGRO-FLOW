# Implementation Plan: AgroFlow

## Overview

SPA locale (React + Vite + Tailwind, localStorage) pour mutualiser des lots agricoles, matcher, grouper en opération, suivre une timeline, alerter, et afficher un passeport QR. Contrat : `AgroFlow_SPEC.md` v1.2.

## Architecture Decisions

- Moteurs purs + tests avant l’UI du même module.
- `AppState` : Context + reducer ; alertes dérivées via `checkAlerts`, jamais persistées.
- Tranches verticales : lot créable après T11 ; Niveau 1 après T14 ; dashboard ∥ passport après T17.
- `recharts` uniquement en T21 si utile ; le flux corridor est un SVG.

## Task List

### Phase 0: Foundation
- [ ] T1 Scaffold Vite
- [ ] T2 Types + geo
- [ ] T3 Seed relatif
- [ ] T4 Ids
- [ ] T5 Storage

### Checkpoint A
- [ ] `tsc` + `npm test` verts

### Phase 1: Engines
- [ ] T6 Compatibility
- [ ] T7 Grouping pur

### Checkpoint B
- [ ] Fixture 90 + groupement 955/90

### Phase 2–3: Shell + lots
- [ ] T8 AppState
- [ ] T9 Layout + routes
- [ ] T10 Liste lots
- [ ] T11 Création lot

### Checkpoint C
- [ ] Créer un lot → matching `?ref=`

### Phase 4: Niveau 1 UI
- [ ] T12 LotCard + ScoreBar
- [ ] T13 Matching
- [ ] T14 Grouping UI

### Checkpoint D
- [ ] Opération créée depuis le trio démo

### Phase 5: Operations + alerts
- [ ] T15 rulesEngine
- [ ] T16 Timeline
- [ ] T17 Événements + retard 30 h

### Checkpoint E
- [ ] R1 visible sur la fiche opération

### Phase 6: Surfaces
- [ ] T18 Dashboard
- [ ] T19 Passeport + QR

### Checkpoint F
- [ ] Scénario §16 × 1 ; `npm run build`

### Phase 7: Polish
- [ ] T20 Qualité démo
- [ ] T21 Niveau 3 (si F vert)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| QR localhost | Med | URL en clair sous le QR |
| KPI opportunités mal compté | High | Compter les destinations §13.2 |
| T8 trop gros | Med | Extraire `reducer.ts` si besoin |
| Coupe temps | High | S’arrêter après T14 ; jamais skip T6–T7 |

## Open Questions

Aucune bloquante (spec §20).
