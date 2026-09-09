# AGROFLOW — Fiche de spécification produit & technique (v1.0)

> **Statut** : Document de référence (single source of truth)
> **Contexte** : Hackathon Cursor × Devs Days 2026 — sprint de 36h
> **Stack** : React + Vite + Tailwind CSS — pas de backend distant (LocalStorage/JSON)
> **Librairies autorisées** : `react-router-dom`, `lucide-react`, `qrcode.react`, `recharts`

---

## 1. Contexte & problème

Les producteurs agricoles disposent souvent de petits volumes (quelques centaines de kg) et organisent leur transport individuellement. Résultat : véhicules sous-remplis, coûts élevés, trajets non optimisés, et aucune visibilité consolidée sur les lots en cours d'acheminement.

**AgroFlow** mutualise ces besoins logistiques : regroupement de cargaisons compatibles + traçabilité simplifiée de chaque lot via un passeport numérique.

### Valeur clé (pitch)
> *"Mutualiser les volumes. Organiser les flux. Suivre les lots."*

**Exemple chiffré démo** : 3 producteurs × ~300 kg → 1 opération groupée de 950 kg vers une destination commune.

---

## 2. Objectifs du MVP

Démontrer un parcours **complet de bout en bout**, reproductible au moins 3 fois, en live :

```
Création de lot → Analyse de compatibilité → Matching → Regroupement
→ Opération (timeline) → Événement + alerte → Passeport numérique (QR Code)
```

### Pyramide des priorités (règle de coupe en cas de manque de temps)
| Niveau | Contenu |
|---|---|
| **1 — Indispensable** | Création de lot, matching, regroupement |
| **2 — Important** | Opération, timeline, dashboard |
| **3 — Wow** | QR code, carte/flux visuels, animations |

⚠️ En cas de coupure : on coupe dans le Niveau 3 en premier, **jamais** dans le Niveau 1.

### Hors périmètre (non-MVP)
- Backend distant, authentification réelle, multi-utilisateurs
- Algorithmes d'optimisation d'itinéraires avancés
- Temps réel / notifications push
- Certification ou contrôle qualité réglementaire (les alertes sont une **aide**, pas un contrôle)

---

## 3. Utilisateurs & parcours

| Persona | Rôle dans l'app |
|---|---|
| **Producteur** | Crée des lots, consulte les opportunités de regroupement |
| **Transporteur** | Consulte les opérations et volumes à prendre en charge |
| **Acheteur** | Scanne le QR code → consulte le passeport du lot |
| **Opérateur logistique** | Valide les regroupements, planifie, enregistre les événements |

**Parcours principal (happy path)** : celui du scénario de démo (§ 10). Toutes les autres fonctionnalités sont secondaires.

---

## 4. Modèle de données

### 4.1 Types TypeScript (`src/types/lot.ts`)

```ts
type StatutLot =
  | 'disponible'
  | 'en_groupement'
  | 'planifie'
  | 'en_transit'
  | 'arrive';

type Contrainte =
  | 'fragile'
  | 'temperature_ambiante'   // produit sensible à la chaleur
  | 'hauteur_interdite'      // ne pas empiler
  | 'urgent'
  | 'sans_contact';           // incompatibilité produit/produit

interface Lot {
  id: string;                 // format "AF-XXX" (ex. AF-001)
  produit: string;            // maïs, ananas, soja, piment...
  categorie: string;          // céréale, fruit, légumineuse...
  quantiteKg: number;
  producteur: string;
  localisation: string;       // ville/zône de départ
  destination: string;        // corridor logistique
  dateDisponibilite: string;  // ISO date
  contraintes: Contrainte[];
  statut: StatutLot;
}

interface Evenement {
  id: string;
  lotId: string;
  type: 'changement_statut' | 'retard' | 'incident' | 'note';
  message: string;
  date: string;               // ISO datetime
}

interface Operation {
  id: string;
  lots: Lot[];                // lots regroupés
  scoreCompatibilite: number; // 0–100, score du groupement
  statut: 'proposee' | 'validee' | 'planifiee' | 'en_transit' | 'arrivee';
  poidsTotalKg: number;
  depart: string;
  destination: string;
  dateDepart: string;
  evenements: Evenement[];
}

interface Alerte {
  severite: 'info' | 'vigilance' | 'critique';
  message: string;
  sourceId: string;           // lotId ou operationId
}
```

### 4.2 Données de test (`src/data/lots.json`)
- **12 à 15 lots fictifs réalistes**, produits variés (maïs, ananas, soja, piment…)
- **5 localisations au Bénin** : Bohicon, Allada, Abomey-Calavi, Porto-Novo, Parakou
- **3 destinations communes** : Cotonou, Abomey-Calavi, Porto-Novo
- Historique d'événements cohérent pour au moins 2 lots
- Format strictement conforme au type `Lot`

---

## 5. Algorithme de compatibilité (`src/services/compatibility.ts`)

### 5.1 Fonction principale
```ts
calculateCompatibilityScore(lotA: Lot, lotB: Lot): number // 0–100
```

### 5.2 Pondération (figée pour le MVP)

| Critère | Poids | Règle |
|---|---|---|
| Produit / catégorie | 30 | Identique = 30 ; même catégorie = 20 ; sinon 0 |
| Destination | 25 | Identique = 25 ; corridor proche (paramétrable) = 12 ; sinon 0 |
| Zone géographique | 20 | Même ville/zone = 20 ; zone adjacente = 10 ; sinon 0 |
| Disponibilité | 15 | Fenêtre de ±3 jours = 15 ; ±7 jours = 8 ; sinon 0 |
| Contraintes | 10 | Aucune incompatibilité = 10 ; incompatibilité majeure (ex. `hauteur_interdite` vs empilable) = 0 |

### 5.3 Seuils d'affichage
- `≥ 75` → badge **"Haute compatibilité"** (vert)
- `50–74` → badge **"Compatibilité moyenne"** (orange)
- `< 50` → badge **"Faible"** (gris/rouge), non proposé au regroupement par défaut

### 5.4 Score de groupement
Pour une opération regroupant N lots : score = moyenne des scores de toutes les paires (N×(N-1)/2 paires), arrondi à l'entier.

---

## 6. Moteur de règles & alertes (`src/services/rulesEngine.ts`)

```ts
checkAlerts(operation: Operation): Alerte[]
```

### Règles MVP (figées)

| # | Règle | Sévérité | Message |
|---|---|---|---|
| R1 | Retard > 24h sur une étape planifiée | `critique` | "Vigilance élevée : retard de transport détecté" |
| R2 | Contraintes incompatibles entre 2 lots du groupement | `critique` | "Regroupement refusé : contraintes produit incompatibles" |
| R3 | Poids total > capacité véhicule standard (1 000 kg) | `vigilance` | "Volume proche de la capacité maximale" |
| R4 | Événement de type `incident` non résolu depuis > 6h | `vigilance` | "Incident signalé en attente de traitement" |

> Les alertes sont une **aide au suivi** affichée dans le dashboard et sur la fiche opération. Elles ne bloquent pas la navigation.

---

## 7. Architecture front-end

### 7.1 Structure de dossiers
```
src/
├── components/     # composants réutilisables (LotCard, ScoreBar, AlertBadge...)
├── pages/          # une page = une route
├── data/           # lots.json, evenements.json (données seed)
├── services/       # compatibility.ts, rulesEngine.ts, storage.ts
├── utils/          # helpers (formatDate, formatKg, calculs)
└── types/          # lot.ts (référence commune, ne pas dupliquer les types)
```

### 7.2 Persistance
- État initial : seed depuis `src/data/*.json`
- Mutations : LocalStorage (`agroflow_state_v1`)
- Au chargement : si `agroflow_state_v1` existe → l'utiliser, sinon seeder

### 7.3 Routes

| Route | Page | Contenu |
|---|---|---|
| `/` | Dashboard | KPIs : total lots, opportunités, opérations, alertes ; liste des alertes actives |
| `/lots` | Liste des lots | Tableau + filtres (statut, produit, destination) ; bouton "Nouveau lot" |
| `/lots/nouveau` | Création de lot | Formulaire complet (§ 8) |
| `/matching` | Matching | Cartes de lots avec score de compatibilité vs lot de référence (sélectionnable) |
| `/grouping` | Regroupement | Proposition de groupement (lots compatibles), volume total, bouton **"Créer l'opération"** |
| `/operations/:id` | Opération | Timeline : lots enregistrés → regroupement validé → transport planifié → en transit → arrivé ; boutons d'enregistrement d'événement |
| `/passport/:lotId` | Passeport numérique | Fiche lot : id, produit, producteur, origine, destination, statut, historique ; **QR code** encodant l'URL de la page |

### 7.4 Composants clés

| Composant | Props | Responsabilité |
|---|---|---|
| `LotCard` | `lot: Lot`, `score?: number` | Affiche produit, quantité, trajet (origine → destination), barre de score |
| `ScoreBar` | `score: number`, `animated?: boolean` | Barre de progression + badge de seuil (vert/orange/rouge) |
| `AlertBadge` | `alerte: Alerte` | Pastille colorée par sévérité |
| `OperationTimeline` | `operation: Operation` | Timeline verticale des étapes et événements |
| `QRPassport` | `url: string` | QR code (qrcode.react) pointant vers `/passport/:lotId` |
| `Layout` | — | Sidebar + header, navigation `react-router-dom` |

---

## 8. Formulaire de création de lot (`/lots/nouveau`)

Champs obligatoires : produit, quantité (kg), producteur, localisation (select parmi les 5 villes), destination (select parmi les 3 corridors), date de disponibilité.
Champs optionnels : catégorie (déduite du produit si vide), contraintes (checkbox multi-select).

**Comportements** :
- Validation : quantité > 0, date ≥ aujourd'hui
- À la soumission : id auto-généré (`AF-{seq}`), statut `disponible`, redirection vers `/matching` avec ce lot pré-sélectionné
- Nouveau lot **visible immédiatement** dans la liste et le dashboard

---

## 9. Design & UX

### 9.1 Direction visuelle
- Ton : sobre, professionnel, "tech au service de l'agriculture"
- Palette suggérée : vert primaire (`emerald-600`), neutres chauds (stone), accent orange pour les alertes
- Typographie : système par défaut, hiérarchie claire (un seul `h1` par page)
- **Uniquement Tailwind** — pas de CSS séparé, pas de librairie UI externe

### 9.2 États obligatoires (checklist avant démo)
- [ ] Aucun écran vide — chaque liste vide a un état illustré avec CTA
- [ ] Aucun `undefined`/`null` affiché
- [ ] Loading states sur les actions
- [ ] Affichage correct sur l'écran de projection (1280px minimum)
- [ ] États hover/focus sur tous les boutons et liens

### 9.3 Effets "Wow" (Niveau 3 — seulement si Niveaux 1 et 2 terminés)
1. Score de compatibilité **animé** au chargement (compteur 0 → 92% + badge "HIGH COMPATIBILITY")
2. Représentation simplifiée des flux : **Bohicon → Allada → Abomey-Calavi → Cotonou** (schéma SVG animé, `recharts` non requis pour celui-ci)
3. Passeport scannable via QR code avec mention *"Traceability: verified journey"*

---

## 10. Scénario de démo (figé — ne plus le modifier après H2)

1. **3 producteurs** créent chacun un lot : même produit (ex. maïs), ~300 kg chacun, origines différentes (Bohicon, Allada, Abomey-Calavi), **même destination** (Cotonou), disponibilités proches (±2 jours)
2. Dashboard : 3 nouveaux lots détectés, 1 opportunité de regroupement
3. Matching : scores de compatibilité affichés entre les 3 lots (attendu : ≥ 75)
4. Grouping : sélection des 3 lots → volume total **~950 kg** → bouton "Créer l'opération"
5. Opération : timeline créée, passage à "transport planifié"
6. **Événement déclenché en live** : "retard de 30h" → alerte critique visible (règle R1)
7. Acheteur : scan du QR code → passeport du lot AF-XXX : identité, origine déclarée, statut "en transit", historique complet

**Données du scénario** (à verser dans le seed) :

| Lot | Producteur | Produit | Qté | Origine | Destination | Dispo |
|---|---|---|---|---|---|---|
| AF-001 | Coop. Zagnanado | Maïs | 320 kg | Bohicon | Cotonou | J+1 |
| AF-002 | Exploit. Hounkpe | Maïs | 310 kg | Allada | Cotonou | J+2 |
| AF-003 | Ferme Ganhoué | Maïs | 325 kg | Abomey-Calavi | Cotonou | J+1 |

---

## 11. Critères d'acceptation

### Parcours complet
- [ ] Créer un lot via le formulaire → il apparaît dans `/lots`, `/`, et est proposé au matching
- [ ] Le moteur de compatibilité retourne un score correct selon la pondération § 5.2 (testable sur AF-001/AF-002)
- [ ] Un regroupement de lots ≥ seuil génère une opération avec score et poids total corrects
- [ ] La timeline d'opération avance aux clics et enregistre les événements
- [ ] La règle R1 (retard > 24h) déclenche une alerte `critique` visible sur le dashboard
- [ ] `/passport/AF-001` affiche toutes les infos du lot + historique + QR code fonctionnel
- [ ] Rafraîchissement de la page : l'état persiste (LocalStorage)

### Qualité / démo
- [ ] Démo reproductible ≥ 3 fois sans manipulation de code
- [ ] Aucune régression : navigation fluide, pas de crash, pas de console error bloquante
- [ ] Données réalistes partout (pas de "test", "lorem ipsum", quantités incohérentes)

---

## 12. Planning de sprint (36h)

| Créneau | Durée | Objectif |
|---|---|---|
| H0–H2 | 2h | Alignement + setup projet + scénario figé |
| H2–H8 | 6h | Cœur MVP : modèle de données, moteur compatibilité, moteur regroupement, règles |
| **H8** | checkpoint | Démo interne minimale : créer un lot → analyse → score |
| H8–H16 | 8h | Parcours complet : dashboard, matching, grouping, opération, passeport |
| **H16** | checkpoint | MVP fonctionnel de bout en bout (déjà pitchable) |
| H16–H22 | 6h | Polish + effets wow (Niveau 3) |
| H22–H26 | 4h | Stabilisation — **gel des fonctionnalités**, bug fixing uniquement |
| H26–H29 | 3h | Préparation du pitch |
| H29–H32 | 3h | Répétitions |
| H32–H36 | 4h | Sécurisation finale + marge tampon (tests sur la machine de présentation, mode hors-ligne) |

### Répartition des rôles
| Membre | Rôle | Livrable principal |
|---|---|---|
| Sergio | Lead tech & architecture | Structure, logique applicative, intégration |
| Dine | UI/UX | Écrans, parcours, intégration front |
| Mickael | Données & spatiale | Modèle de données, seed JSON, visualisation flux |
| Gaitant | Qualité & cohérence | Règles de vigilance, événements, alertes |
| Omega | Environnement & durabilité | Matrice de compatibilité, critères d'impact |

---

## 13. Conventions de code & prompt Cursor

### Conventions
- TypeScript strict, pas de `any` sauf justification
- Un composant par fichier, nommé en PascalCase
- Les types vivent **uniquement** dans `src/types/lot.ts` — les importer, jamais les redéfinir
- Services purs (pas de JSX) : `compatibility.ts`, `rulesEngine.ts`
- Fonctions petites et testables

### Bonnes pratiques de prompts (économie de tokens)
1. Toujours référencer le fichier concerné via `@nom_fichier` plutôt que de coller du code
2. Demander des **diffs ciblés** ("modifie uniquement la fonction X") plutôt que des réécritures
3. Découper en petites unités : un composant / une fonction / un type par prompt
4. Donner le contexte minimal : structure de données attendue, format entrée/sortie, contraintes
5. Éviter les prompts ouverts ("améliore le code") — préférer des critères précis
6. Fermer les onglets non pertinents avant de lancer un prompt (Cursor inclut le contexte ouvert)
7. Réserver les prompts "documente ce code" à la phase pitch

---

## 14. Pitch — structure recommandée

1. **Titre + accroche** : "Mutualiser les volumes. Organiser les flux. Suivre les lots."
2. **Le problème** : producteurs isolés, véhicules sous-remplis
3. **L'opportunité** : 3 producteurs → 1 opération → 950 kg
4. **AgroFlow** : mutualisation, compatibilité, traçabilité
5. **Démo live** (scénario § 10)
6. **Technique** : React, moteur de données, algorithme de compatibilité, passeport + QR — mention de Cursor comme accélérateur
7. **Impact** (sans statistiques inventées)
8. **Vision** : prototype → réseau logistique agricole → infrastructure

---

*v1.0 — Document collaboratif. Toute modification impactant les types, la pondération §5.2 ou le scénario §10 doit être validée par toute l'équipe.*
