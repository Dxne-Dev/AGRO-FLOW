# AgroFlow

Mutualiser les volumes. Organiser les flux. Suivre les lots.

SPA de démo (hackathon Cursor × Devs Days 2026) : regroupement de petits lots agricoles et passeport numérique par QR. **Pas de backend** — état dans `localStorage`.

## Source de vérité

Le contrat produit et technique est **[AgroFlow_SPEC.md](./AgroFlow_SPEC.md)** (v1.2).  
Ce README ne fait que pointer vers la spec : en cas d’écart, la spec gagne.

Hors périmètre (entre autres) : API distante, parcelles, irrigation, optimisation d’itinéraires.  
Auth = **session locale** (rôles + comptes) — identifiants seed : [`SEED_ACCOUNTS.md`](./SEED_ACCOUNTS.md).

## Démarrage

```bash
npm install
npm run dev
```

1. Ouvrir `/login` → choisir un rôle  
2. `/auth` → Connexion ou Créer un compte  
3. Dashboard **vide** ; Profil → « Charger le scénario démo » pour AF-001…

## Modules

`lots` → `matching` → `grouping` → `operations` → `alerts` → `dashboard` ∥ `passport`

## Documents du dépôt

| Fichier | Rôle |
|---|---|
| `AgroFlow_SPEC.md` | Spec (contrat) |
| `AgroFlow_UX.docx` | Notes UX — subordonnées à la spec |
| `AgroFlow_Planning_36h_et_Prompts_Cursor.pdf` | Planning historique — le planning vivant est spec §17 |
| `AgroFlow_Document_collaboratif_Hackathon_2026.docx` | Notes d’équipe |
