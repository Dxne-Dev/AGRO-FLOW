# Spec: AgroFlow (MVP hackathon)

> **Statut** : source de vérité produit & technique — revue humaine requise avant PLAN / TASKS / IMPLEMENT  
> **Version** : 1.2  
> **Contexte** : Hackathon Cursor × Devs Days 2026 — sprint 36 h  
> **Langue UI** : français  
> **Runtime** : SPA locale, aucun backend distant

**Prééminence.** En cas de contradiction, l’ordre est : ce fichier → `package.json` (versions) → `README.md`. Le README n’est pas un second contrat produit.

Toute modification des **types §10**, de la **pondération §11**, des **matrices §10.2 / §11.2**, du **scénario §16** ou des **règles §12** doit être validée par toute l’équipe.

---

## Capability map

Le livrable démo est unique ; les modules ci-dessous sont **indépendamment testables**. Pas de spec fichier-par-module tant que cette carte n’est pas contestée (36 h : un seul document).

| Module id | Responsabilité | Dépend de |
|---|---|---|
| `lots` | Seed, persistance, création, liste, filtres, ids `AF-XXX` | — |
| `matching` | Score paire à paire + badges de seuil | `lots` |
| `grouping` | Proposition de groupement, poids, création d’opération | `lots`, `matching` |
| `operations` | Timeline, transitions de statut, événements | `grouping` |
| `alerts` | Règles de vigilance (dérivées, non persistées) | `operations` |
| `passport` | Fiche lot + historique + QR | `lots`, `operations` |
| `dashboard` | KPIs et liste unique des alertes | `lots`, `grouping`, `alerts` |

**Build order :** `lots` → `matching` → `grouping` → `operations` → `alerts` → `dashboard` ∥ `passport`

Contrats (fonctions pures, `AppState`, routes) = ce document.

---

## 1. Objective

**AgroFlow** mutualise de petits volumes agricoles (quelques centaines de kg) en **opérations de transport groupées**, et fournit un **passeport numérique** par lot.

**Pitch :** *Mutualiser les volumes. Organiser les flux. Suivre les lots.*  
**Chiffre démo :** 3 producteurs → **955 kg** vers Cotonou (pas « ~950 » une fois le seed figé).

### Utilisateurs

Pas de comptes. Un **poste opérateur unique** joue tous les rôles. Les personas sont narratives (jury / pitch), pas des ACL.

| Persona | Ce qu’on montre à l’écran |
|---|---|
| Producteur | Formulaire de lot, liste, matching |
| Transporteur | Fiche opération, volume, timeline |
| Acheteur | `/passport/:lotId` + QR |
| Opérateur logistique | Groupement, validation, événements, alertes |

**Happy path** = scénario §16. Tout le reste est secondaire.

### Succès produit

Reproduire **≥ 3 fois** en live, sans toucher au code :

```
Création de lot → Matching → Regroupement → Opération (timeline)
→ Événement + alerte → Passeport (QR)
```

### Pyramide (coupe temps)

| Niveau | Modules | Coupe |
|---|---|---|
| **1 — Indispensable** | `lots`, `matching`, `grouping` | Jamais |
| **2 — Important** | `operations`, `alerts`, `dashboard` | Après le 3 |
| **3 — Wow** | QR, SVG flux, animation de score | En premier |

### Hors périmètre

- Backend, auth, multi-utilisateurs, sync multi-onglets, PWA obligatoire
- Solveur d’itinéraires, GPS, cartes tuilées, temps réel, push
- Certification / contrôle qualité (alertes = **aide**)
- Paiement, facturation, messagerie
- Parcelles, irrigation, suivi cultural (hors produit)
- Scores « impact environnemental » chiffrés (pas de stats inventées)

---

## 2. Tech Stack

| Couche | Choix |
|---|---|
| Runtime | Navigateurs modernes (Chrome, Edge, Firefox, Safari courants). Pas d’IE11 |
| Langage | TypeScript strict (`strict`, `noUncheckedIndexedAccess`) |
| UI | React + Vite + Tailwind **uniquement** (pas de CSS module, pas de lib UI) |
| Routing | `react-router-dom` |
| Icônes | `lucide-react` |
| QR | `qrcode.react` |
| Graphes | `recharts` **optionnel** Niveau 3 uniquement |
| Tests | Vitest ; Testing Library si le temps le permet |
| Persistance | `localStorage` clé `agroflow_state_v1` |
| État | React Context + reducer (pas de Redux / Zustand) |

**Dépendances runtime autorisées :** la liste ci-dessus + toolchain Vite / TS / Tailwind / Vitest. Toute autre lib = Ask first.

Versions exactes = `package.json` au setup H0–H2. Pas d’upgrade en cours de sprint.

---

## 3. Commands

Scripts à créer au scaffold (H0–H2), puis à utiliser tels quels :

```bash
npm install
npm run dev
npx tsc --noEmit
npm run lint
npm test
npm test -- --coverage
npm run build
npm run preview
```

**Reset démo :** bouton header *Réinitialiser la démo* → `resetState()` (reseed + write). Obligatoire pour enchaîner 3 runs.

---

## 4. Project Structure

```
src/
├── main.tsx
├── App.tsx                      # Router + AppStateProvider
├── index.css                    # directives Tailwind uniquement
├── components/                  # un export principal PascalCase par fichier
│   ├── Layout.tsx
│   ├── LotCard.tsx
│   ├── ScoreBar.tsx
│   ├── AlertBadge.tsx
│   ├── OperationTimeline.tsx
│   └── QRPassport.tsx
├── pages/
│   ├── DashboardPage.tsx
│   ├── LotsPage.tsx
│   ├── NewLotPage.tsx
│   ├── MatchingPage.tsx
│   ├── GroupingPage.tsx
│   ├── OperationPage.tsx
│   ├── PassportPage.tsx
│   └── NotFoundPage.tsx
├── data/
│   ├── lots.seed.json           # 12–15 lots + offsetDays (pas de dates mortes)
│   ├── evenements.seed.json
│   └── geo.ts
├── services/
│   ├── compatibility.ts
│   ├── compatibility.test.ts
│   ├── grouping.ts
│   ├── grouping.test.ts
│   ├── rulesEngine.ts
│   ├── rulesEngine.test.ts
│   ├── ids.ts
│   ├── seed.ts                  # offsets → Lot[] / Evenement[] ISO
│   └── storage.ts
├── state/
│   └── AppState.tsx
├── types/
│   └── lot.ts                   # UNIQUE source des types domaine
└── utils/
    ├── formatDate.ts
    └── formatKg.ts
README.md
AgroFlow_SPEC.md                 # ce fichier
```

Types : uniquement `src/types/lot.ts`. `state/` n’en redéfinit aucun.

---

## 5. Code Style

- TypeScript strict ; `any` interdit sauf commentaire d’une ligne justifié
- UI française ; identifiants de code anglais
- Services **sans JSX** ; pas de `localStorage` / `Date.now()` dans `compatibility.ts`
- Dates jour : `YYYY-MM-DD` ; événements : ISO datetime

```ts
/** Pur : matrices et « maintenant » injectés, jamais lus en global. */
export function calculateCompatibilityScore(
  lotA: Lot,
  lotB: Lot,
  geo: GeoConfig = DEFAULT_GEO,
): number {
  return (
    scoreProduct(lotA, lotB) +
    scoreDestination(lotA, lotB, geo) +
    scoreZone(lotA, lotB, geo) +
    scoreAvailability(lotA, lotB) +
    scoreConstraints(lotA, lotB)
  );
}
```

---

## 6. Testing Strategy

| Niveau | Quoi | Où | Barre |
|---|---|---|---|
| Unitaire | Score paire, groupement, éligibilité, R1–R4, ids, seed offsets | `src/services/*.test.ts` | **Obligatoire** avant UI du module |
| Composant | `ScoreBar`, validation formulaire | colocalisé | Si le temps (Niveau 2) |
| Manuel | Scénario §16 × 3, 1280 px, persist reload | checklist §15 | **Obligatoire** avant gel H22 |

**Couverture :** 100 % des branches de `compatibility.ts`, `grouping.ts`, `rulesEngine.ts`. Pas de quota pages.

**Horloge :** `now: Date` injecté dans `checkAlerts` et `buildSeed`.

**Interdit :** supprimer un test rouge pour passer le build.

---

## 7. Boundaries

- **Always**
  - `npx tsc --noEmit` et `npm test` avant de déclarer un module fini
  - Valider le formulaire (quantité > 0, ≤ 1000, date ≥ aujourd’hui calendaire)
  - Importer les types depuis `src/types/lot.ts`
  - Ne reseed que via reset explicite
  - États vides, bouton submit désactivé pendant le traitement, `:focus-visible`
- **Ask first**
  - Nouvelle dépendance npm
  - Changement de pondération, geo, contraintes, capacité, textes d’alerte
  - Changement de `AppState` / bump de clé localStorage
  - Nouvelle route ou UI par persona
  - Auth, backend, carte réelle, forcer un lot < 75 dans un groupement
- **Never**
  - Commit de secrets
  - Dupliquer les types domaine
  - Solveur d’itinéraire hors matrices figées
  - Inventer des stats d’impact dans le pitch
  - Couper le Niveau 1 pour finir le Niveau 3
  - Afficher `undefined` / `null` / « lorem » / « test »

---

## 8. Success Criteria

Un item non coché = module non livré.

### `lots`
- [ ] Seed 12–15 lots `Lot`, dont AF-001..003 du §16, dates = jour du reset + offset
- [ ] Submit formulaire → `AF-{n}` 3 chiffres, `disponible`, visible sur `/`, `/lots`, `/matching`
- [ ] Quantité ≤ 0, > 1000 ou date passée → pas d’écriture + erreur
- [ ] Reload conserve l’état ; reset restaure le seed

### `matching`
- [ ] AF-001 vs AF-002 = **90** (fixture §11.5)
- [ ] Badges : ≥ 75 vert « Haute compatibilité » ; 50–74 orange ; < 50 gris
- [ ] `< 50` et `50–74` exclus du groupement par défaut
- [ ] Lot de référence via select et `?ref=`

### `grouping`
- [ ] Query `?lots=AF-001,AF-002,AF-003` → poids **955**, score **90**
- [ ] Incompatibilité majeure §11.2 → **pas** de `createOperation`, message R2
- [ ] Poids > 1000 → opération créable + R3
- [ ] Créer → `statut: 'validee'`, lots `en_groupement`, id `OP-XXX`

### `operations` + `alerts`
- [ ] Transitions strictes `validee` → `planifiee` → `en_transit` → `arrivee`
- [ ] Lots : `en_groupement` → `planifie` → `en_transit` → `arrive`
- [ ] *Simuler un retard de 30 h* → événement `retard` + R1 `critique` dashboard et fiche
- [ ] Incident sans `resolvedAt` depuis > 6 h (`now` injecté) → R4

### `passport` + `dashboard`
- [ ] `/passport/AF-001` : identité, trajet, statut, historique, QR + URL en clair
- [ ] KPIs : nb lots, nb opportunités §13.2, nb opérations, alertes actives
- [ ] Aucune erreur console bloquante sur §16

### Démo
- [ ] §16 × 3 après reset
- [ ] Lisible à **1280 px**
- [ ] Données réalistes (villes béninoises, kg cohérents)

---

## 9. Contrats de services (interfaces)

```ts
export interface GeoConfig {
  adjacent: Record<string, string[]>;
  nearbyDestinations: Record<string, string[]>;
}

export interface StorageAPI {
  loadState(): AppState;     // JSON invalide / absent → seed
  saveState(state: AppState): void;
  resetState(): AppState;    // seed(now) + write
}

export interface IdAPI {
  nextLotId(lots: Lot[]): string;             // max AF-NNN + 1, pad 3
  nextOperationId(operations: Operation[]): string; // OP-NNN
  nextEventId(events: Evenement[]): string;   // EV-NNN
}

export interface GroupingAPI {
  groupingScore(lots: Lot[], geo?: GeoConfig): number;
  isGroupEligible(lots: Lot[], geo?: GeoConfig): boolean;
  createOperationInput(lots: Lot[]): Omit<Operation, 'id' | 'evenementIds'>;
}

export interface RulesAPI {
  checkAlerts(input: {
    operation: Operation;
    lots: Lot[];
    evenements: Evenement[];
    now: Date;
    capaciteKg?: number; // défaut 1000
  }): Alerte[];
}
```

`createOperation` vit dans le reducer (écriture d’état), pas dans le service pur : le service **décide** l’éligibilité et calcule score / poids / `depart`.

`depart` d’une opération = `localisation` du premier id dans `lotIds` (ordre de la query). Pour AF-001,002,003 → Bohicon.

---

## 10. Modèle de données

Fichier canonique : `src/types/lot.ts`.

```ts
export type StatutLot =
  | 'disponible'
  | 'en_groupement'
  | 'planifie'
  | 'en_transit'
  | 'arrive';

export type Contrainte =
  | 'fragile'
  | 'temperature_ambiante'
  | 'hauteur_interdite'
  | 'urgent'
  | 'sans_contact';

export type StatutOperation =
  | 'validee'
  | 'planifiee'
  | 'en_transit'
  | 'arrivee';

export type TypeEvenement =
  | 'changement_statut'
  | 'retard'
  | 'incident'
  | 'note';

export interface Lot {
  id: string;
  produit: string;
  categorie: string;
  quantiteKg: number;
  producteur: string;
  localisation: string;
  destination: string;
  dateDisponibilite: string; // YYYY-MM-DD
  contraintes: Contrainte[];
  statut: StatutLot;
}

export interface Evenement {
  id: string;
  lotId?: string;
  operationId?: string;
  type: TypeEvenement;
  message: string;
  date: string;
  retardHeures?: number; // requis si type === 'retard'
  resolvedAt?: string;
}

export interface Operation {
  id: string;
  lotIds: string[];          // jamais Lot[] dénormalisé
  scoreCompatibilite: number;
  statut: StatutOperation;
  poidsTotalKg: number;
  depart: string;
  destination: string;
  dateDepart: string | null; // null tant que pas planifiee
  evenementIds: string[];
}

export interface Alerte {
  id: string; // `${ruleId}-${operation.id}` pour un rendu stable
  severite: 'info' | 'vigilance' | 'critique';
  message: string;
  ruleId: 'R1' | 'R2' | 'R3' | 'R4';
  sourceId: string;
}

export interface AppState {
  lots: Lot[];
  operations: Operation[];
  evenements: Evenement[];
}
```

Le statut `proposee` **n’existe pas** en persistance : la page `/grouping` est l’état « proposé » avant clic.

### 10.1 Produit → catégorie

Normaliser : trim + minuscule. Si catégorie vide à la création :

| Produits | Catégorie |
|---|---|
| maïs, mil, riz, sorgho | céréale |
| soja, niébé, arachide | légumineuse |
| ananas, mangue, orange | fruit |
| piment, gombo, tomate | légume |

Hors table → catégorie **obligatoire**.

### 10.2 Géographie

**Origines (select) :** Bohicon, Allada, Abomey-Calavi, Porto-Novo, Parakou  
**Destinations (select) :** Cotonou, Abomey-Calavi, Porto-Novo

Score **zone** = comparaison des `localisation` uniquement.

Adjacence (symétrique). Parakou : aucune.

| Ville | Adjacentes |
|---|---|
| Bohicon | Allada, Abomey-Calavi |
| Allada | Bohicon, Abomey-Calavi |
| Abomey-Calavi | Allada, Bohicon, Porto-Novo |
| Porto-Novo | Abomey-Calavi |
| Parakou | — |

Corridors proches (destinations, symétrique) :

| Destination | Proches |
|---|---|
| Cotonou | Abomey-Calavi, Porto-Novo |
| Abomey-Calavi | Cotonou, Porto-Novo |
| Porto-Novo | Cotonou, Abomey-Calavi |

Cotonou n’est pas une origine.

### 10.3 Seed

`lots.seed.json` : champs `Lot` **sauf** `dateDisponibilite` ; à la place `dateDisponibiliteOffsetDays: number` (AF-001 = 1, AF-002 = 2, AF-003 = 1).

`buildSeed(now)` écrit `dateDisponibilite` = calendrier local de `now` + offset (pas d’heures).

- 12–15 lots, trio démo **sans contrainte**
- ≥ 1 paire seed < 50, ≥ 1 paire 50–74, ≥ 1 paire `sans_contact` + produit différent (R2)
- `evenements.seed.json` : historique pour **≥ 2 lots hors trio démo**
- Événements seed : dates relatives (`offsetHours`) matérialisées par `buildSeed`

### 10.4 Persistance

Clé `agroflow_state_v1`. JSON invalide → seed + `console.warn`.  
Reload : si la clé existe et parse → l’utiliser (ne pas réappliquer les offsets).

---

## 11. Compatibilité (`matching`)

```ts
calculateCompatibilityScore(a: Lot, b: Lot, geo?: GeoConfig): number // 0–100
```

### 11.1 Pondération (somme 100)

| Critère | Poids | Règle |
|---|---|---|
| Produit / catégorie | 30 | même produit (normalisé) = 30 ; sinon même catégorie = 20 ; sinon 0 |
| Destination | 25 | identique = 25 ; proche §10.2 = 12 ; sinon 0 |
| Zone | 20 | même localisation = 20 ; adjacente = 10 ; sinon 0 |
| Disponibilité | 15 | \|Δ jours calendaires\| ≤ 3 = 15 ; ≤ 7 = 8 ; sinon 0 |
| Contraintes | 10 | majeure §11.2 = 0 ; sinon 10 |

### 11.2 Incompatibilités majeures

1. Un lot `sans_contact` et `produit` différent  
2. Un lot `hauteur_interdite` et l’autre **sans** `hauteur_interdite`

`fragile` / `urgent` / `temperature_ambiante` ne bloquent pas.

### 11.3 Seuils

- ≥ 75 → Haute (vert) — **seul** palier grouping
- 50–74 → Moyenne (orange) — matching seulement
- < 50 → Faible (gris)

Pas de « forcer l’ajout » au MVP.

### 11.4 Groupement N lots

N ≥ 2. Score = `Math.round` de la moyenne de toutes les paires.  
`isGroupEligible` = false si une paire < 75 **ou** incompatibilité majeure **ou** destinations non identiques.

### 11.5 Fixture (non-régression)

Trio maïs, Cotonou, sans contraintes, Δ dispo ≤ 2 j, origines adjacentes :

| Paire | Zone | Total |
|---|---|---|
| AF-001 × AF-002 | 10 | **90** |
| AF-001 × AF-003 | 10 | **90** |
| AF-002 × AF-003 | 10 | **90** |
| Groupement 3 | — | **90** |

Détail 90 = 30+25+10+15+10.

---

## 12. Alertes (`alerts`)

Alertes **recalculées** à l’affichage. Elles ne bloquent pas la navigation.  
R2 bloque **uniquement** `createOperation` (dans `grouping`).

| # | Condition | Sévérité | Message |
|---|---|---|---|
| R1 | `retard` lié à l’opération avec `retardHeures > 24`, **ou** statut ∈ {`planifiee`,`en_transit`} et `dateDepart != null` et `now - dateDepart > 24h` | `critique` | Vigilance élevée : retard de transport détecté |
| R2 | Au moins une paire en incompatibilité §11.2 | `critique` | Regroupement refusé : contraintes produit incompatibles |
| R3 | `poidsTotalKg > 1000` | `vigilance` | Volume proche de la capacité maximale |
| R4 | `incident` sur l’opération, pas de `resolvedAt`, `now - date > 6h` | `vigilance` | Incident signalé en attente de traitement |

Capacité = 1000 kg. **955 kg → pas de R3.**

---

## 13. Architecture UI

### 13.1 Routes

| Route | Page |
|---|---|
| `/` | KPIs + alertes (`checkAlerts` sur **chaque** opération) |
| `/lots` | Tableau + filtres statut / produit / destination |
| `/lots/nouveau` | Formulaire §14 |
| `/matching?ref=AF-001` | Cartes scorées vs ref |
| `/grouping?lots=AF-001,AF-002,AF-003` | Récap + Créer l’opération |
| `/operations/:id` | Timeline, avance statut, événements, retard 30 h |
| `/passport/:lotId` | Fiche + historique lot ∪ opérations liées + QR |
| `*` | `NotFoundPage` → lien `/` |

Nav `Layout` : Dashboard, Lots, Matching, Groupement, reset démo.

**Matching → grouping :** lots cochés (uniquement score ≥ 75) puis CTA *Proposer un groupement* qui navigue avec `?lots=` (ids triés comme cochés, ref en premier si cochée).

### 13.2 KPI « opportunités »

Une **opportunité** = une `destination` pour laquelle il existe un ensemble de ≥ 2 lots `disponible` **tous pairwise éligibles** (≥ 75 et §11.4).

Valeur affichée = **nombre de telles destinations** (pas le nombre de paires).  
Trio démo Cotonou, seuls éligibles entre eux → **1** (sauf autres clusters seed sur une autre destination).

### 13.3 Composants

| Composant | Props | Rôle |
|---|---|---|
| `LotCard` | `lot`, `score?`, `selected?`, `onToggle?` | Trajet, kg, score |
| `ScoreBar` | `score`, `animated?` | 0–100 + badge ; `animated` Niveau 3 |
| `AlertBadge` | `alerte` | Couleur sévérité |
| `OperationTimeline` | `operation`, `evenements`, `onAdvance?` | Étapes + events |
| `QRPassport` | `url` | QR + `<p>` URL en clair |
| `Layout` | — | Sidebar, header, reset |

### 13.4 Transitions

Interdites : sauter une étape, reculer.

`validee` → `planifiee` (`dateDepart = now.toISOString()`) → `en_transit` → `arrivee`

Chaque avance : `Evenement` `changement_statut` + MAJ statuts lots (§8).

### 13.5 Événements manuels

Type, message, `retardHeures` si retard. Incident sans `resolvedAt`.  
*Marquer résolu* → `resolvedAt = now`.  
Bouton démo : crée `retard` / `retardHeures: 30` / message fixe « Retard de 30 h simulé ».

---

## 14. Formulaire `/lots/nouveau`

**Obligatoires :** produit, quantité kg, producteur, localisation, destination, date.  
**Optionnels :** catégorie (déduite §10.1), contraintes.

- Quantité : nombre > 0 et ≤ 1000  
- Date : `min` = aujourd’hui (navigateur)  
- Submit : `nextLotId` → save → `/matching?ref={id}`

---

## 15. Design & UX

- Ton sobre, « tech au service de l’agriculture »
- `emerald-600`, `stone`, alertes orange / rouge
- Un `h1` par page ; typo système ; Tailwind uniquement

Checklist :

- [ ] Liste vide → illustration + CTA
- [ ] Pas de `undefined` / `null` à l’écran
- [ ] Submit désactivé pendant le traitement
- [ ] 1280 px
- [ ] `:focus-visible` sur actions

Niveau 3 (si 1 et 2 verts) :

1. Compteur de score 0 → valeur  
2. SVG Bohicon → Allada → Abomey-Calavi → Cotonou  
3. Mention *Traceability: verified journey* sous le QR

QR = `origin + '/passport/' + lotId`. Scan téléphone sur localhost **non garanti** : l’URL en clair est le plan A jury.

---

## 16. Scénario de démo (figé)

Ne pas changer le tableau sans accord unanime.

1. Reset démo.  
2. Les 3 lots seed sont `disponible` (pas besoin de les recréer sauf pour montrer le formulaire).  
3. Dashboard : opportunité ≥ 1 sur Cotonou.  
4. Matching `?ref=AF-001` : 90 vs AF-002 et AF-003.  
5. Grouping des 3 : 955 kg, score 90 → Créer.  
6. Avancer à `planifiee` puis `en_transit`.  
7. Simuler retard 30 h → R1.  
8. `/passport/AF-001`.

| Lot | Producteur | Produit | kg | Origine | Destination | Offset |
|---|---|---|---|---|---|---|
| AF-001 | Coop. Zagnanado | Maïs | 320 | Bohicon | Cotonou | +1 |
| AF-002 | Exploit. Hounkpe | Maïs | 310 | Allada | Cotonou | +2 |
| AF-003 | Ferme Ganhoué | Maïs | 325 | Abomey-Calavi | Cotonou | +1 |

Poids = **955 kg**.

---

## 17. Planning 36 h (contexte, pas le plan technique)

`tasks/plan.md` **après** validation de cette spec.

| Créneau | Objectif |
|---|---|
| H0–H2 | Scaffold, scripts §3, scénario figé |
| H2–H8 | `lots` + moteurs + tests |
| **H8** | Créer un lot → score 90 |
| H8–H16 | Pages parcours |
| **H16** | MVP pitchable |
| H16–H22 | Niveau 3 |
| H22–H26 | Gel, bugs |
| H26–H36 | Pitch, répétitions, machine de présentation |

| Membre | Rôle | Module id |
|---|---|---|
| Sergio | Lead tech | `storage`, AppState, intégration |
| Dine | UI/UX | pages, `Layout` |
| Mickael | Données & spatiale | seed, `geo.ts`, SVG |
| Gaitant | Qualité | `rulesEngine`, événements |
| Omega | Compatibilité | `compatibility.ts`, matrices |

---

## 18. Pitch

1. Accroche §1  
2. Problème : petits volumes isolés  
3. 3 producteurs → 955 kg  
4. Matching, groupement, passeport  
5. Démo §16  
6. React, score **testé**, QR — Cursor comme accélérateur  
7. Impact **sans** stats inventées  
8. Vision : prototype → réseau logistique

---

## 19. Prompts Cursor

1. `@AgroFlow_SPEC.md` + `@fichier` concerné  
2. Diff ciblé, une unité par prompt  
3. Copier un critère §8, pas « améliore »  
4. Fermer les onglets hors sujet  
5. Documenter le code en phase pitch seulement

---

## 20. Open Questions

Corriger **maintenant** ou les parenthèses deviennent le contrat.

1. Un fichier spec vs `SPEC-lots.md`… — (**un fichier**, carte ci-dessus)  
2. Fuseau seed — (**calendrier du navigateur** de la machine démo)  
3. ESLint au scaffold Vite — (**oui**)  
4. UI dédiée transporteur / acheteur — (**non**)  
5. Forcer un lot < 75 — (**non**)  
6. Tunnel pour scan QR réel — (**non**, URL en clair)  
7. Max 1000 kg **par lot** — (**oui** ; le groupement peut dépasser)  
8. Critères « durabilité » chiffrés pour Omega — (**non** au MVP ; matrices §11 seulement)

---

## 21. Assumptions

Fausses ? Corriger **avant** le code.

1. SPA web, pas de native.  
2. Pas d’auth ; une session navigateur.  
3. Vérité = `AppState` + localStorage.  
4. Groupement = même destination, pas de multi-drop.  
5. Matching = scores vs **un** lot de référence + moyenne des paires au grouping.  
6. `lotIds` pas de `Lot[]` dans `Operation`.  
7. Alertes dérivées.  
8. R2 bloque la création ; R1/R3/R4 n’empêchent pas d’avancer.  
9. Cette spec prime sur tout README ou docx/pdf du dépôt.

---

*v1.2 — Phase suivante après **ok humain** : PLAN (`tasks/plan.md`) puis TASKS, puis IMPLEMENT. Pas de code métier avant.*
