# Votika — Frontend

Frontend React de l'application **Votika**, une plateforme de vote Mobile Money pour les créateurs TikTok africains.

---

## 🚀 Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Éditez .env et renseignez vos clés
```

---

## ⚙️ Variables d'environnement

Créez un fichier `.env` à la racine du projet `votika-frontend/` :

```env
VITE_API_BASE_URL=http://localhost:5000/api     # URL du backend Votika
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...          # Clé publique Clerk (optionnel)
```

> **Note :** Si `VITE_CLERK_PUBLISHABLE_KEY` est vide, l'app fonctionne sans Clerk. L'authentification est uniquement requise pour les dashboards créateur/admin.

---

## 🛠️ Développement

```bash
# Démarrer le serveur de développement
npm run dev

# Vérification des types TypeScript
npx tsc --noEmit

# Build de production
npm run build
```

---

## 📁 Structure du projet

```
src/
├── api/              # Client Axios configuré
├── components/
│   ├── common/       # Button, LoadingState, ErrorState, EmptyState, ProtectedRoute
│   ├── creator/      # CreatorCard
│   ├── layout/       # Header, Footer, Layout
│   └── vote/         # VotePanel, PaymentMethodSelector
├── hooks/            # Hooks React Query
├── lib/              # Utilitaires (cn)
├── pages/            # Pages (Home, Creator, Leaderboard, VoteConfirmation)
├── types/            # Interfaces TypeScript
├── App.tsx           # Providers + Router
└── main.tsx
```

---

## 💳 Flux de vote

1. L'utilisateur clique "Voter" sur une `CreatorCard`
2. Il remplit le `VotePanel` (votes, méthode de paiement, téléphone)
3. Soumission → `POST /api/votes` → redirection vers MoneyFusion
4. MoneyFusion redirige vers `/vote/confirmation?token=xxx`
5. Polling auto toutes les 3s sur `GET /api/votes/:voteId/status`

---

## 🔒 Authentification Clerk

- Voter ne nécessite **pas de compte**
- Routes protégées : `/dashboard/creator` (rôle `creator`) et `/dashboard/admin` (rôle `admin`)
