# EnergyX - Application de Développement Personnel

![EnergyX Logo](https://img.shields.io/badge/EnergyX-Développement%20Personnel-0ea5e9?style=for-the-badge)
[![PWA](https://img.shields.io/badge/PWA-Installable-4CAF50?style=for-the-badge)](https://developer.mozilla.org/fr/docs/Web/Progressive_web_apps)
[![Deploy to GitHub Pages](https://github.com/thieuquillabru/EnergyX/actions/workflows/deploy.yml/badge.svg)](https://github.com/thieuquillabru/EnergyX/actions/workflows/deploy.yml)

## 🚀 Utiliser l'application

**👉 [Ouvrir EnergyX](https://thieuquillabru.github.io/EnergyX/)**

Aucune installation, aucun compte, aucun serveur : l'application tourne
entièrement dans votre navigateur et vos données restent sur votre appareil
(stockage local).

EnergyX est une application web complète de développement personnel, mentale et physique. Elle vous permet de gérer tous les aspects de votre vie : habitudes, objectifs, santé, passions, apprentissage et bien plus encore.

## 📱 Progressive Web App (PWA)

EnergyX est une **PWA installable** ! Vous pouvez l'installer sur votre appareil comme une application native.

### Fonctionnalités PWA :
- ✅ **Installation sur mobile/PC** - Ajoutez à l'écran d'accueil
- ✅ **Fonctionne hors ligne** - Accédez à vos données même sans connexion
- ✅ **Interface plein écran** - Expérience immersive
- ✅ **Raccourcis** - Accès direct aux sections depuis l'écran d'accueil

### Comment installer ?

**Sur Mobile :**
1. Ouvrez l'app dans votre navigateur
2. Cliquez sur "Installer" ou sur "Ajouter à l'écran d'accueil"
3. L'app apparaîtra comme une icône native !

**Sur PC (Chrome / Edge) :**
1. Ouvrez [l'application](https://thieuquillabru.github.io/EnergyX/)
2. Cliquez sur l'icône d'installation dans la barre d'adresse

## ✨ Fonctionnalités

### 📊 Dashboard Principal
- Vue d'ensemble de votre journée
- Progression des habitudes
- Statistiques en temps réel
- Citation motivante du jour

### ✅ Gestion des Habitudes
- Créer des habitudes personnalisées avec icônes et couleurs
- Suivi des séries (streaks)
- Catégories : Santé, Fitness, Mental, Apprentissage, Social, Productivité, Créativité, Finance, Passion
- Rappels et suivi quotidien

### 🎯 Objectifs
- Définir des objectifs court et long terme
- Jalons et sous-objectifs
- Suivi de progression avec barre de progression
- Priorités (Basse, Moyenne, Haute, Critique)
- Dates limite

### 📔 Journal Personnel
- Écriture quotidienne
- Tracking de l'humeur (5 niveaux)
- Indicateurs : Énergie, Sommeil, Hydratation, Exercice
- Pratique de la gratitude
- Tags personnalisés
- Calendrier d'humeur sur 30 jours

### ⏱️ Minuteur Pomodoro
- Sessions de concentration personnalisables
- Pomodoros courts et longs
- Suivi des tâches
- Statistiques de productivité
- Son de notification

### 📚 Bibliothèque de Lecture
- Gestion de votre collection de livres
- Statut : À lire, En cours, Terminé, En pause
- Progression de lecture
- Système de notation
- Catégories

### 🎮 Collection de Jeux
- Gérez votre ludothèque
- Plateformes multiples (PC, PlayStation, Xbox, Switch, Mobile)
- Heures de jeu
- Statut : Backlog, En cours, Terminé, En pause, Abandonné
- Notations et genres

### ⭐ Compétences
- Développez vos compétences
- Catégories : Programmation, Langues, Musique, Art, Business, Science, Vie
- Niveaux : Débutant, Intermédiaire, Avancé, Expert
- Ressources et journal de pratique

### 💪 Fitness
- Journal d'entraînement
- Types : Musculation, Cardio, Flexibilité, HIIT, Sports
- Exercises avec séries et répétitions
- Calories brûlées
- Statistiques hebdomadaires

### 🧘 Méditation
- Sessions de méditation guidées
- Types : Pleine conscience, Respiration, Visualisation, Scan corporel, Amour bienveillant, Sommeil, Concentration
- Durées personnalisables
- Suivi des sessions

### 🔥 Motivation
- Citations inspirantes
- Défis personnels
- Suivi de progression des défis
- Favoris

### 👤 Profil
- Niveau et XP (système de gamification)
- Statistiques globales
- Passions personnalisées
- Succès

### ⚙️ Personnalisation
- **8 thèmes prédéfinis** : Océan, Forêt, Coucher de Soleil, Lavande, Rose, Minuit, Émeraude, Ardoise
- Création de thèmes personnalisés
- Mode clair/foncé adaptatif

## 🛠️ Développement local

```bash
# Cloner le repository
git clone https://github.com/thieuquillabru/EnergyX.git
cd EnergyX

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

Autres commandes utiles :

```bash
npm run build   # génère le site statique dans out/
npm run lint    # vérifie le code
```

## 📦 Déploiement

Le site est **déployé automatiquement sur GitHub Pages** à chaque push sur
`main`, via le workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

L'application est exportée en statique (`output: 'export'`), il n'y a donc
aucun serveur à gérer et aucun hébergeur tiers n'est nécessaire.

### Activer GitHub Pages (à faire une seule fois)

1. Aller dans **Settings → Pages** du repository
2. Dans **Build and deployment → Source**, choisir **GitHub Actions**
3. Pousser sur `main` : le site est publié sur
   `https://<votre-utilisateur>.github.io/EnergyX/`

> Le chemin de base est injecté au build via la variable
> `NEXT_PUBLIC_BASE_PATH`. En local elle est vide, ce qui permet de continuer
> à travailler sur `http://localhost:3000/`.

### Héberger ailleurs

Le dossier `out/` produit par `npm run build` est un site statique classique :
il peut être servi par n'importe quel hébergeur (Netlify, Cloudflare Pages,
un simple serveur nginx, …). Pensez à définir `NEXT_PUBLIC_BASE_PATH` si le
site n'est pas servi à la racine du domaine.

## 🛠️ Technologies

- **Framework**: Next.js 16 (App Router)
- **Langage**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Storage**: LocalStorage (persistance locale)
- **Build**: Turbopack (export statique)
- **Hébergement**: GitHub Pages

## 📱 Fonctionnalités à venir

- [x] Mode hors-ligne (PWA)
- [ ] Synchronisation cloud
- [ ] Rappels push
- [ ] Widgets de bureau
- [ ] Partage de défis avec la communauté
- [ ] Statistiques avancées et graphiques
- [ ] Intégration avec des API externes ( Goodreads, Steam, etc.)
- [ ] Mode nuit automatique
- [ ] Export/Import avancé (CSV, PDF)

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Thieu Quilla Bru** - [GitHub](https://github.com/thieuquillabru)

---

⭐ N'oubliez pas de donner une étoile au projet si vous l'aimez !

## 🙏 Remerciements

Merci à tous les contributeurs et à la communauté open source pour leur soutien.
