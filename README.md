
# 🛍 Mini Projet Kafka – Simulation E-commerce en Temps Réel

## 🎯 Objectif

Créer une application e-commerce simple avec :

- Un **formulaire de commande** (via interface web)
- Une **section Top Produits** mise à jour en temps réel grâce à Kafka

---

## 🧠 Concepts Clés

- Kafka pour **traiter les commandes en temps réel**
- Architecture **microservices** avec Producers et Consumers Kafka
- **Conteneurisation complète** avec Docker & Docker Compose
- Base de données **PostgreSQL** pour stocker commandes et statistiques

---

## 📦 Architecture Résumée

![kafka Arcchitecture Projet](https://github.com/user-attachments/assets/a25685c5-bcbf-465c-a836-41694c0c35ff)

---

## 🧰 Technologies Utilisées

| Composant        | Technologie                         |
|------------------|-------------------------------------|
| Frontend         | HTML, CSS, JavaScript (Vanilla)     |
| Backend API      | Node.js (Express), kafka-node       |
| Kafka            | Apache Kafka + Zookeeper            |
| Consumers        | Node.js, KafkaJS, Nodemailer, pg    |
| Base de données  | PostgreSQL                          |
| Conteneurs       | Docker, Docker Compose              |
| Outils Dev       | Mailtrap, Git, VSCode               |

---

## 📁 Structure du Projet

```
kafka-ecommerce-project/
│
├── frontend/                 # Interface utilisateur
│   ├── index.html
│   └── Dockerfile
│
├── backend/                 # API Express + Producer Kafka
│   ├── server.js
│   ├── producer.js
│   ├── db.js
│   └── Dockerfile
│
├── consumers/               # Consumers Kafka
│   ├── emailConsumer.js
│   ├── statsConsumer.js
│   ├── Dockerfile.email
│   └── Dockerfile.stats
│
├── db/
│   └── init.sql             # Script SQL pour initialisation DB
│
├── docker-compose.yml       # Orchestration des services
├── .env                     # Variables d'environnement (mail/db)
├── simulate100.js           # Script simulation de 100 commandes
└── README.md
```

---

## 🧪 Lancer le Projet (Dév / Local)

### 📦 Installation des outils requis

1. **Docker**  
   👉 [Installer Docker Desktop](https://www.docker.com/products/docker-desktop)

2. **Node.js & NPM**  
   👉 [Installer Node.js](https://nodejs.org/)

```bash
# Vérifier les versions
docker -v
node -v
npm -v

# Installer les dépendances Node.js (pour dev local)
cd backend
npm install

cd ../consumers
npm install

cd ../  # retour à la racine

# Lancer tous les conteneurs Docker
docker-compose up --build
```

Puis ouvrez :

- 🌐 Frontend : [http://localhost:3000](http://localhost:3000)
- 📡 API : [http://localhost:4000](http://localhost:4000)

### 🛠 Commandes Docker Utiles

| Action                          | Commande                                           |
|---------------------------------|----------------------------------------------------|
| Voir les conteneurs en cours    | `docker ps`                                       |
| Arrêter & reconstruire          | `docker-compose down --build`                    |
| Voir les logs d’un service      | `docker logs <nom_du_service>`                   |
| Shell dans la DB                | `docker exec -it <db_container_id> psql -U admin -d commandes_db` |
| Rebuilder uniquement un service | `docker-compose build api-backend`               |
| Supprimer tous les volumes      | `docker volume prune` (⚠ Attention: irréversible) |

### 🧪 Générer 100 commandes automatiquement

Un script `simulate100.js` est inclus à la racine du projet :

```bash
npm install axios
node simulate100.js
```

Ce script envoie 100 commandes aléatoires à l’API pour tester Kafka + Consumers 🎯

### 📊 Base de données PostgreSQL

**Tables utilisées :**

```sql
CREATE TABLE IF NOT EXISTS commandes (
  id SERIAL PRIMARY KEY,
  produit TEXT,
  quantite INT,
  email TEXT,
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS top_products (
  produit TEXT PRIMARY KEY,
  count INT DEFAULT 1
);
```

### ✉ Fonctionnement des Consumers Kafka

#### 1. consumer-email

- Groupe Kafka : `email-group`
- Envoie un email de confirmation via Mailtrap

#### 2. consumer-topproducts

- Groupe Kafka : `stats-group`
- Incrémente le produit dans `top_products` (PostgreSQL)

---

## 🔧 Comment fonctionne Docker (en bref)

Docker permet de :

- Emballer chaque composant (API, frontend, DB, Kafka...) dans un conteneur isolé
- Garantir un environnement stable quel que soit l’ordinateur de dev
- Orchestrer tous les services via Docker Compose

**Avantages :**

- Déploiement rapide
- Plus besoin d’installer Kafka ou PostgreSQL localement
- Facile à reproduire ou partager entre développeurs

---

## 🌐 API Backend

| Méthode | Endpoint        | Description                              |
|---------|------------------|------------------------------------------|
| GET     | `/`              | Vérifie que l'API fonctionne             |
| POST    | `/commandes`     | Envoie une commande                      |
| GET     | `/top-products`  | Récupère les 10 produits les plus populaires |

---

## ⚙️ `.env` (à placer à la racine)

Ce fichier contient les **variables d’environnement sensibles** nécessaires au bon fonctionnement des services : email et base de données.

### 📬 Mailtrap SMTP (pour tester l’envoi d’e-mails sans utiliser un vrai compte)

- `MAIL_USER` : identifiant utilisateur Mailtrap
- `MAIL_PASS` : mot de passe associé

```env
MAIL_USER=ton-mailtrap-username
MAIL_PASS=ton-mailtrap-motdepasse
```

Ces variables sont utilisées dans le **consumer email** pour envoyer un email de confirmation de commande.

### 🛢 PostgreSQL

- `PGUSER` : nom d’utilisateur de la base
- `PGPASSWORD` : mot de passe
- `PGDATABASE` : nom de la base utilisée

```env
PGUSER=admin
PGPASSWORD=password
PGDATABASE=commandes_db
```

Ces valeurs sont exploitées dans le **consumer stats** pour enregistrer les statistiques de commandes dans la base de données.

---

## 🧠 À Faire (Bonus)

- ✅ Ajouter un dashboard de statistiques avec Chart.js
- 🔐 Ajouter un système d’authentification
- 📊 Visualiser toutes les commandes dans une interface admin

---

## 📬 Contact

Projet réalisé dans un cadre pédagogique pour maîtriser Kafka, Node.js et Docker en situation réelle.  
N'hésitez pas à contribuer ou poser vos questions via GitHub!

