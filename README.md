# Smart Traffic Platform

Smart Traffic Platform est une plateforme de gestion intelligente du trafic urbain. Elle centralise l'authentification, le suivi des vehicules, la surveillance de zones de trafic, la declaration d'incidents, les notifications temps reel et une interface cartographique interactive.

Le projet repose sur une architecture microservices avec un frontend Next.js, une API Gateway GraphQL, des services backend NestJS, PostgreSQL, Prisma, Docker Compose et une pipeline GitHub Actions.

## Architecture generale

```text
Frontend Next.js
   |
   | HTTP GraphQL
   v
API Gateway GraphQL
   |
   | Forwarding GraphQL + Authorization
   v
Auth Service          PostgreSQL
Vehicle Service       PostgreSQL
Traffic Service       PostgreSQL + Notification Service
Notification Service  PostgreSQL + WebSocket
Incident Service      PostgreSQL + Notification Service
```

Principes principaux :

- Le frontend consomme les fonctionnalites via l'API Gateway.
- L'API Gateway route les operations GraphQL vers le service responsable.
- Les services metier valident les JWT recus dans le header `Authorization`.
- PostgreSQL est partage par les services avec Prisma comme ORM.
- Le Notification Service expose aussi un canal WebSocket pour les notifications temps reel.
- La carte interactive Leaflet affiche les vehicules, les zones de trafic et les incidents.

## Services backend

### Auth Service

Service responsable de l'identite et de la securite :

- inscription utilisateur ;
- connexion ;
- generation JWT ;
- refresh token ;
- logout ;
- profil utilisateur ;
- gestion des roles `ADMIN` et `OPERATOR`.

Chemin : `backend/auth-service`

### Vehicle Service

Service responsable des vehicules et de leurs positions GPS :

- creation, lecture, mise a jour et suppression de vehicules ;
- ajout de position GPS ;
- historique GPS ;
- simulation de deplacement GPS.

Chemin : `backend/vehicle-service`

### Traffic Service

Service responsable des zones de circulation :

- creation et gestion de zones ;
- mesure de densite ;
- mutation `measureTrafficDensity` ;
- mutation historique `updateTrafficDensity` ;
- detection de congestion ;
- classification `LOW`, `MEDIUM`, `HIGH`.

Chemin : `backend/traffic-service`

### Notification Service

Service responsable des notifications :

- creation de notifications ;
- consultation des notifications de l'utilisateur connecte ;
- notifications non lues ;
- marquage comme lu ;
- notifications globales cote service/admin ;
- WebSocket temps reel via le namespace `/notifications`.

Chemin : `backend/notification-service`

### Incident Service

Service responsable des incidents urbains :

- declaration d'incident ;
- consultation des incidents ;
- changement de statut ;
- integration avec les notifications.

Chemin : `backend/incident-service`

## Frontend

Le frontend est une application Next.js situee dans `frontend/smart-traffic-dashboard`.

Fonctionnalites principales :

- authentification utilisateur ;
- tableau de bord ;
- gestion vehicules ;
- suivi GPS ;
- zones de trafic ;
- incidents ;
- notifications ;
- carte interactive Leaflet ;
- integration GraphQL via l'API Gateway.

Le frontend ne doit pas appeler directement les microservices metier pour GraphQL. L'URL principale est :

```env
NEXT_PUBLIC_GRAPHQL_GATEWAY_URL=http://localhost:4000/graphql
GRAPHQL_GATEWAY_URL=http://localhost:4000/graphql
```

Le WebSocket de notifications utilise :

```env
NEXT_PUBLIC_NOTIFICATION_WS_URL=http://localhost:3005/notifications
```

## API Gateway

L'API Gateway est situee dans `backend/api-gateway`.

Role :

- point d'entree GraphQL unique pour le frontend ;
- routage des queries et mutations vers le service responsable ;
- forwarding du header `Authorization` ;
- normalisation des erreurs reseau et GraphQL ;
- protection contre les operations GraphQL melangeant plusieurs domaines dans une seule requete.

URL locale :

```text
http://localhost:4000/graphql
```

Les ports directs des services backend restent utiles pour le debug, mais le frontend doit passer par la Gateway.

## Docker Compose

Docker Compose lance toute la plateforme :

- PostgreSQL ;
- Auth Service ;
- Vehicle Service ;
- Traffic Service ;
- Notification Service ;
- Incident Service ;
- API Gateway ;
- Frontend.

Commandes :

```bash
docker compose build
docker compose up
```

Arret :

```bash
docker compose down
```

Arret avec suppression du volume PostgreSQL :

```bash
docker compose down -v
```

Le volume persistant PostgreSQL est :

```text
smart_traffic_postgres_data
```

Le reseau Docker est :

```text
smart-traffic-network
```

## Variables d'environnement

Variables principales utilisees par Docker Compose :

```env
POSTGRES_DB=smart_traffic
POSTGRES_USER=smart_traffic
POSTGRES_PASSWORD=smart_traffic_password
DATABASE_URL=postgresql://smart_traffic:smart_traffic_password@database:5432/smart_traffic?schema=public

JWT_SECRET=local_dev_access_secret_change_me
JWT_REFRESH_SECRET=local_dev_refresh_secret_change_me
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

AUTH_SERVICE_GRAPHQL_URL=http://auth-service:3000/graphql
VEHICLE_SERVICE_GRAPHQL_URL=http://vehicle-service:3000/graphql
TRAFFIC_SERVICE_GRAPHQL_URL=http://traffic-service:3000/graphql
NOTIFICATION_SERVICE_GRAPHQL_URL=http://notification-service:3000/graphql
INCIDENT_SERVICE_GRAPHQL_URL=http://incident-service:3000/graphql

NEXT_PUBLIC_GRAPHQL_GATEWAY_URL=http://localhost:4000/graphql
GRAPHQL_GATEWAY_URL=http://api-gateway:3000/graphql
NEXT_PUBLIC_NOTIFICATION_WS_URL=http://localhost:3005/notifications

CORS_ORIGIN=http://localhost:3000
```

En production, remplacer tous les secrets locaux par des valeurs fortes et gerees hors du depot.

## URLs locales

| Composant | URL |
| --- | --- |
| Frontend | `http://localhost:3000` |
| API Gateway GraphQL | `http://localhost:4000/graphql` |
| Auth Service GraphQL | `http://localhost:3002/graphql` |
| Vehicle Service GraphQL | `http://localhost:3003/graphql` |
| Traffic Service GraphQL | `http://localhost:3004/graphql` |
| Notification Service GraphQL | `http://localhost:3005/graphql` |
| Notification WebSocket | `http://localhost:3005/notifications` |
| Incident Service GraphQL | `http://localhost:3006/graphql` |
| PostgreSQL | `localhost:5432` |

## Installation locale

Installation complete avec Docker :

```bash
docker compose build
docker compose up
```

Installation frontend seule :

```bash
cd frontend/smart-traffic-dashboard
npm ci
npm run dev
```

Installation d'un service backend :

```bash
cd backend/<service>
npm ci
npx prisma generate
npm run start:dev
```

Exemples de services :

```text
backend/api-gateway
backend/auth-service
backend/vehicle-service
backend/traffic-service
backend/notification-service
backend/incident-service
```

## Commandes de test et qualite

Frontend :

```bash
cd frontend/smart-traffic-dashboard
npm run lint
npm run test
npm run build
```

Backend, pour chaque service :

```bash
cd backend/<service>
npm ci
npx prisma generate
npx eslint "{src,apps,libs,test}/**/*.ts" --max-warnings=0
npm test -- --runInBand
npm run build
```

Validation Docker Compose :

```bash
docker compose config --quiet
docker compose build
```

## CI/CD

La pipeline GitHub Actions est definie dans `.github/workflows/ci.yml`.

Elle execute :

- installation des dependances pour le frontend et chaque service backend ;
- generation Prisma si un schema est present ;
- lint avec zero warning ;
- tests unitaires ;
- build backend ;
- build frontend ;
- build Docker Compose.

Version Node utilisee par la CI :

```text
Node.js 22
```

## WebSocket

Le Notification Service expose un canal temps reel :

```text
http://localhost:3005/notifications
```

Usage attendu :

- connexion du frontend au namespace de notifications ;
- reception des notifications creees par le service ;
- affichage temps reel cote interface ;
- conservation de la compatibilite avec les notifications GraphQL.

La securite principale des donnees de notifications est assuree cote GraphQL par l'extraction du `userId` depuis le JWT. Les notifications globales doivent rester controlees cote service ou admin.

## Carte interactive

La carte interactive repose sur Leaflet dans le frontend.

Elle sert a visualiser :

- les vehicules et leurs positions GPS ;
- les zones de trafic ;
- les niveaux de densite ;
- les incidents declares.

Points d'attention :

- charger Leaflet uniquement cote client dans Next.js ;
- eviter les imports Leaflet pendant le rendu serveur ;
- garder des marqueurs lisibles sur mobile ;
- limiter les rafraichissements trop frequents si beaucoup de vehicules sont affiches.

## Comptes de test

Le projet ne depend pas d'un compte seed obligatoire. Les comptes peuvent etre crees via la mutation `register`.

Compte operateur conseille pour les tests manuels :

```text
email: operator@example.com
password: Password123!
role attendu: OPERATOR
```

Compte admin conseille :

```text
email: admin@example.com
password: Password123!
role attendu: ADMIN
```

Si l'inscription cree un utilisateur `OPERATOR` par defaut, promouvoir un compte en admin dans PostgreSQL pour les tests d'administration :

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

## Requetes GraphQL importantes

Toutes les requetes frontend doivent passer par :

```text
http://localhost:4000/graphql
```

### Inscription

```graphql
mutation Register($input: RegisterInput!) {
  register(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      role
    }
  }
}
```

Variables :

```json
{
  "input": {
    "email": "operator@example.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "Operator"
  }
}
```

### Connexion

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      role
    }
  }
}
```

### Profil utilisateur

```graphql
query Me {
  me {
    id
    email
    role
  }
}
```

Header :

```http
Authorization: Bearer <accessToken>
```

### Creation vehicule

```graphql
mutation CreateVehicle($input: CreateVehicleInput!) {
  createVehicle(input: $input) {
    id
    licensePlate
    type
    status
  }
}
```

### Ajout position GPS

```graphql
mutation AddVehiclePosition($vehicleId: String!, $input: AddVehiclePositionInput!) {
  addVehiclePosition(vehicleId: $vehicleId, input: $input) {
    id
    latitude
    longitude
    timestamp
  }
}
```

### Simulation GPS

```graphql
mutation SimulateVehicleGps($vehicleId: String!) {
  simulateVehicleGps(vehicleId: $vehicleId) {
    id
    latitude
    longitude
    timestamp
  }
}
```

### Creation zone de trafic

```graphql
mutation CreateTrafficZone($input: CreateTrafficZoneInput!) {
  createTrafficZone(input: $input) {
    id
    name
    densityLevel
  }
}
```

### Mesure de densite

```graphql
mutation MeasureTrafficDensity($zoneId: String!, $vehicleCount: Int!) {
  measureTrafficDensity(zoneId: $zoneId, vehicleCount: $vehicleCount) {
    id
    vehicleCount
    densityLevel
    measuredAt
  }
}
```

### Zones congestionnees

```graphql
query CongestedZones {
  congestedZones {
    id
    name
    densityLevel
  }
}
```

### Notifications de l'utilisateur

```graphql
query MyNotifications {
  myNotifications {
    id
    title
    message
    read
    createdAt
  }
}
```

### Notifications non lues

```graphql
query MyUnreadNotifications {
  myUnreadNotifications {
    id
    title
    message
    createdAt
  }
}
```

### Marquer une notification comme lue

```graphql
mutation MarkNotificationAsRead($id: String!) {
  markNotificationAsRead(id: $id) {
    id
    read
  }
}
```

### Declaration incident

```graphql
mutation CreateIncident($input: CreateIncidentInput!) {
  createIncident(input: $input) {
    id
    title
    status
    severity
  }
}
```

### Changement statut incident

```graphql
mutation UpdateIncidentStatus($id: String!, $status: IncidentStatus!) {
  updateIncidentStatus(id: $id, status: $status) {
    id
    status
  }
}
```

## Securite

Points deja couverts :

- JWT emis par Auth Service ;
- refresh token ;
- guards JWT sur les services metier ;
- roles `ADMIN` et `OPERATOR` ;
- forwarding du header `Authorization` par l'API Gateway ;
- prevention IDOR sur les notifications utilisateur ;
- validation DTO avec NestJS et GraphQL.

Points a renforcer avant production :

- rotation et stockage securise des secrets ;
- politique CORS stricte par environnement ;
- rate limiting sur login/register ;
- journalisation centralisee ;
- audit des permissions par operation ;
- TLS obligatoire.

## Limites et ameliorations futures

Limites actuelles :

- pas de seed officiel pour les comptes de demonstration ;
- WebSocket expose separement de la Gateway GraphQL ;
- pas de federation GraphQL complete ;
- tests end-to-end encore a renforcer ;
- supervision, metriques et logs centralises absents ;
- migrations et donnees initiales a formaliser pour les environnements de demo.

Ameliorations recommandees :

- ajouter un script de seed Prisma avec comptes `ADMIN` et `OPERATOR` ;
- ajouter des tests E2E couvrant login, vehicules, trafic, incidents et notifications ;
- ajouter un reverse proxy unique pour HTTP et WebSocket ;
- documenter le schema GraphQL genere dans un artefact versionne ;
- ajouter rate limiting et monitoring ;
- isoler les schemas PostgreSQL par service si l'objectif microservices doit etre strict ;
- ajouter une strategie de reconnexion WebSocket documentee et testee.
