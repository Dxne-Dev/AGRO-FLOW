# Comptes seed AgroFlow (local / démo)

Source technique : [`src/data/accounts.seed.json`](src/data/accounts.seed.json).  
Ces comptes sont injectés dans `localStorage` (`agroflow_users_v1`) au premier chargement. **Pas de backend** — mots de passe en clair pour le hackathon uniquement.

| Rôle | Email | Mot de passe | Nom affiché |
|---|---|---|---|
| Producteur | `producteur@agroflow.demo` | `Producteur2026!` | Coop. Zagnanado |
| Transporteur | `transporteur@agroflow.demo` | `Transport2026!` | Transport Atlantique |
| Acheteur | `acheteur@agroflow.demo` | `Acheteur2026!` | Marché Dantokpa |
| Opérateur | `operateur@agroflow.demo` | `Operateur2026!` | Ops AgroFlow |

## Parcours

1. `/login` — choisir le rôle  
2. `/auth?role=…` — Connexion **ou** Créer un compte  
3. Dashboard **vide** par défaut (pas de lots seed)  
4. Profil → **Charger le scénario démo** pour injecter AF-001… (pitch jury)

Tu peux aussi créer de nouveaux comptes via « Créer un compte » (même rôle que l’étape 1).
