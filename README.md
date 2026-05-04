# 🇸🇳 Tacko delices

Une application web moderne, performante et élégante pour un restaurant de gastronomie sénégalaise. L'accent est mis sur l'immersion visuelle, l'expérience utilisateur et la simplicité de gestion.

> Ce projet est pensé selon une architecture *Serverless* complète (Vite / React + Supabase), éliminant le besoin de maintenir un serveur backend traditionnel tout en garantissant des performances de pointe.

---

## ✨ Fonctionnalités Principales

### Côté Client (Site Public)
- **Design Immersif** : Animations fluides avec GSAP, typographie soignée et interface Dark Mode premium.
- **Affichage Dynamique** : Les plats du jour s'affichent uniquement s'ils sont marqués "actifs".
- **Statut en Temps Réel** : Indicateur Ouvert/Fermé instantané.
- **Conversion** : Call-to-Action vers WhatsApp avec bouton magnétique.

### Côté Administration (Privé)
- **Tableau de Bord Sécurisé** : Authentification complète.
- **Gestion des Plats** : Modification facile des noms, descriptions, prix (en Francs CFA) et photos (upload automatique sécurisé).
- **Statut du Restaurant** : Bouton simple pour basculer le restaurant en Ouvert ou Fermé.
- **Statistiques** : Suivi des visites et des dernières modifications effectuées.

---

## 🛠️ Stack Technique

- **Frontend** : React 19, Vite, TypeScript
- **Styling** : Tailwind CSS v4
- **Animations** : GSAP (ScrollTrigger)
- **Backend / Base de Données** : Supabase (Authentification, PostgreSQL, Storage, RLS)
- **Routing** : React Router v7

---

## 🚀 Installation & Développement Local

1. **Cloner le projet**
   ```bash
   git clone https://github.com/votre-compte/tacko-delices.git
   cd Tacko-delices
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration de l'environnement (Supabase)**
   - Créez un projet sur [Supabase](https://supabase.com/).
   - Récupérez l'URL du projet et la clé `anon public` dans les paramètres (Project Settings > API).
   - Dupliquez `.env.example` en un fichier `.env` à la racine.
   - Renseignez les clés :
     ```env
     VITE_SUPABASE_URL=https://votre-url-projet.supabase.co
     VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
     ```

4. **Initialiser la base de données**
   - Sur votre dashboard Supabase, allez dans `SQL Editor`.
   - Copiez/collez tout le contenu de `supabase/migrations/20260203130000_teranga_init.sql` et cliquez sur **Run**.
   - Vous devrez aussi exécuter la requête pour ajouter la colonne `is_active` si absente :
     ```sql
     ALTER TABLE public.dishes ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
     ```

5. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

---

## 🌍 Déploiement en Production

Le projet est conçu pour être hébergé sur des plateformes de déploiement statique comme **Vercel**, **Netlify** ou **Cloudflare Pages**.

1. Connectez votre dépôt GitHub à Vercel ou Netlify.
2. Assurez-vous que le Framework Preset soit défini sur **Vite**.
3. Dans la section **Environment Variables** de l'hébergeur, ajoutez :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Cliquez sur **Deploy** !

La commande de build est `npm run build` et le dossier de sortie (output) sera `dist/`.

---

*Développé avec passion pour mettre en valeur l'âme du Sénégal dans chaque plat.* 🥘