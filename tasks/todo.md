# AgroFlow tasks

Source : `AgroFlow_SPEC.md` v1.2. Vérifier chaque tâche avant de passer à la suivante.

## Task 1: Scaffold Vite

**Description:** App React + TS strict + Tailwind + Vitest + ESLint ; scripts spec §3 ; deps `react-router-dom`, `lucide-react`, `qrcode.react`.

**Acceptance criteria:**
- [ ] `npm run dev`, `npx tsc --noEmit`, `npm test`, `npm run lint` OK
- [ ] `strict` + `noUncheckedIndexedAccess`

**Verification:**
- [ ] Les 4 commandes ci-dessus

**Dependencies:** None

**Files likely touched:** `package.json`, `vite.config.ts`, `tsconfig*.json`, `src/main.tsx`

**Estimated scope:** Medium

## Task 2: Types + geo

**Acceptance criteria:**
- [ ] Types §10 dans `src/types/lot.ts`
- [ ] `DEFAULT_GEO` §10.2 dans `src/data/geo.ts`
- [ ] `dateDepart: string | null` ; pas de `proposee` persisté

**Verification:**
- [ ] `npx tsc --noEmit`

**Dependencies:** T1

**Files:** `src/types/lot.ts`, `src/data/geo.ts`

**Estimated scope:** Small

## Task 3: Seed relatif

**Acceptance criteria:**
- [ ] 12–15 lots dont AF-001..003 §16
- [ ] Dates = calendrier de `now` + offset
- [ ] ≥1 paire <50, ≥1 moyenne, ≥1 cas R2 ; historique ≥2 lots hors trio

**Verification:**
- [ ] `npm test -- src/services/seed.ts`

**Dependencies:** T2

**Files:** `src/data/lots.seed.json`, `src/data/evenements.seed.json`, `src/services/seed.ts`, `src/services/seed.test.ts`

**Estimated scope:** Medium

## Task 4: Ids

**Acceptance criteria:**
- [ ] 15 lots → `AF-016` ; vides → `AF-001`, `OP-001`, `EV-001`

**Verification:**
- [ ] tests ids

**Dependencies:** T2

**Files:** `src/services/ids.ts`, `src/services/ids.test.ts`

**Estimated scope:** Small

## Task 5: Storage

**Acceptance criteria:**
- [ ] Clé `agroflow_state_v1` ; JSON invalide → seed + warn
- [ ] Reset réécrit le seed ; load ne ré-offset pas un état valide

**Verification:**
- [ ] tests storage (localStorage mock)

**Dependencies:** T3, T4

**Files:** `src/services/storage.ts`, `src/services/storage.test.ts`

**Estimated scope:** Small

## Checkpoint A
- [ ] `tsc` + `npm test` verts

## Task 6: Compatibility

**Acceptance criteria:**
- [ ] AF-001×AF-002 = 90
- [ ] Pas de `Date.now` / `localStorage` dans le moteur

**Verification:**
- [ ] `npm test -- src/services/compatibility.test.ts`

**Dependencies:** T2, T3

**Files:** `src/services/compatibility.ts`, `src/services/compatibility.test.ts`

**Estimated scope:** Small

## Task 7: Grouping pur

**Acceptance criteria:**
- [ ] Trio : poids 955, score 90, depart Bohicon
- [ ] Inéligible si paire <75, §11.2, ou destinations différentes

**Verification:**
- [ ] tests grouping

**Dependencies:** T6

**Files:** `src/services/grouping.ts`, `src/services/grouping.test.ts`

**Estimated scope:** Small

## Checkpoint B
- [ ] Fixture 90 + 955/90

## Task 8: AppState

**Acceptance criteria:**
- [ ] Reducer : addLot, createOperation, advance, events, delay 30h, reset
- [ ] createOperation refuse si inéligible ; lots `en_groupement`, op `validee`

**Verification:**
- [ ] tests reducer + `tsc`

**Dependencies:** T5, T7

**Files:** `src/state/AppState.tsx`, `src/state/AppState.test.ts`

**Estimated scope:** Medium

## Task 9: Layout + routes

**Acceptance criteria:**
- [ ] Nav + reset démo + 404 + pages stub
- [ ] FR ; `:focus-visible`

**Verification:**
- [ ] `npm run dev` manuel

**Dependencies:** T8

**Files:** `src/App.tsx`, `src/components/Layout.tsx`, `src/pages/NotFoundPage.tsx`, `src/index.css`

**Estimated scope:** Medium

## Task 10: Liste lots

**Acceptance criteria:**
- [ ] Seed visible ; filtres combinables ; empty state ; pas de undefined

**Verification:**
- [ ] manuel + `tsc`

**Dependencies:** T9

**Files:** `src/pages/LotsPage.tsx`, `src/utils/formatKg.ts`

**Estimated scope:** Small

## Task 11: Création lot

**Acceptance criteria:**
- [ ] Validation sans write ; catégorie déduite ; redirect `/matching?ref=`

**Verification:**
- [ ] manuel + `tsc`

**Dependencies:** T10

**Files:** `src/pages/NewLotPage.tsx`, `src/utils/formatDate.ts`

**Estimated scope:** Small

## Checkpoint C
- [ ] Créer un lot → matching

## Task 12: LotCard + ScoreBar

**Acceptance criteria:**
- [ ] 90 haute / 60 moyenne / 40 faible ; pas d’animation obligatoire

**Dependencies:** T6, T9

**Files:** `src/components/ScoreBar.tsx`, `src/components/LotCard.tsx`

**Estimated scope:** Small

## Task 13: Matching

**Acceptance criteria:**
- [ ] `?ref=` ; checkboxes seulement ≥75 ; CTA grouping query lots

**Dependencies:** T11, T12

**Files:** `src/pages/MatchingPage.tsx`

**Estimated scope:** Small

## Task 14: Grouping UI

**Acceptance criteria:**
- [ ] 955 / 90 ; R2 bloque ; succès → `/operations/:id`

**Dependencies:** T8, T13

**Files:** `src/pages/GroupingPage.tsx`

**Estimated scope:** Small

## Checkpoint D — Niveau 1
- [ ] Parcours lot → opération créée

## Task 15: rulesEngine

**Acceptance criteria:**
- [ ] 955 pas de R3 ; retard 30h → R1 ; incident >6h → R4

**Dependencies:** T2 (parallèle possible dès T2)

**Files:** `src/services/rulesEngine.ts`, `src/services/rulesEngine.test.ts`

**Estimated scope:** Small

## Task 16: Timeline opération

**Acceptance criteria:**
- [ ] Transitions strictes ; sync lots ; `dateDepart` à planifiee

**Dependencies:** T14, T8

**Files:** `src/pages/OperationPage.tsx`, `src/components/OperationTimeline.tsx`

**Estimated scope:** Small

## Task 17: Événements + retard démo

**Acceptance criteria:**
- [ ] Simuler 30 h → R1 sur la fiche ; résoudre incident coupe R4

**Dependencies:** T15, T16

**Files:** `src/pages/OperationPage.tsx`, `src/components/AlertBadge.tsx`

**Estimated scope:** Small

## Checkpoint E
- [ ] Scénario jusqu’à alerte critique fiche

## Task 18: Dashboard

**Acceptance criteria:**
- [ ] KPIs + opportunités = nb destinations cluster ; R1 visible

**Dependencies:** T15, T9, T7

**Files:** `src/pages/DashboardPage.tsx`

**Estimated scope:** Small

## Task 19: Passeport + QR

**Acceptance criteria:**
- [ ] `/passport/AF-001` : fiche, historique, QR + URL en clair

**Dependencies:** T16

**Files:** `src/pages/PassportPage.tsx`, `src/components/QRPassport.tsx`

**Estimated scope:** Small

## Checkpoint F
- [ ] §16 × 1 ; `npm run build`

## Task 20: Qualité démo

**Acceptance criteria:**
- [ ] Checklist §15 hors animations ; 3 resets §16

**Dependencies:** T18, T19

**Estimated scope:** Medium

## Task 21: Niveau 3

**Acceptance criteria:**
- [ ] Seulement si Checkpoint F vert : score animé + SVG corridor

**Dependencies:** T20

**Estimated scope:** Medium

## Checkpoint G
- [ ] Niveau 1–2 verts ; Wow optionnel
