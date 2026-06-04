# Smart Traffic Platform

Plateforme locale composee d'un frontend Next.js, d'une API Gateway GraphQL et de services NestJS pour l'authentification, les vehicules et la gestion du trafic.

## Architecture locale

```text
Frontend Next.js
  -> API Gateway GraphQL
    -> Auth Service
    -> Vehicle Service
    -> Traffic Service
    -> PostgreSQL
```

Le frontend doit utiliser uniquement l'API Gateway GraphQL:

```text
http://localhost:4000/graphql
```

## Commandes de test

```bash
cd backend/auth-service && npm run lint && npm test -- --runInBand && npm run build
cd backend/vehicle-service && npm run lint && npm test -- --runInBand && npm run build
cd backend/traffic-service && npm run lint && npm test -- --runInBand && npm run build
cd backend/api-gateway && npm run lint && npm test -- --runInBand && npm run build
cd frontend/smart-traffic-dashboard && npm run lint && npm test && npm run build
```

## Docker Compose

```bash
docker compose down -v
docker compose build --no-cache
docker compose up
docker compose logs -f
docker compose down
```

## URLs locales

- Frontend: http://localhost:3000
- API Gateway GraphQL: http://localhost:4000/graphql
- Auth Service GraphQL: http://localhost:3002/graphql
- Vehicle Service GraphQL: http://localhost:3003/graphql
- Traffic Service GraphQL: http://localhost:3004/graphql
- PostgreSQL: localhost:5432

## Traffic Management

Routes frontend:

- `/traffic`
- `/traffic/create`
- `/traffic/[id]`

Operations GraphQL Gateway:

- `createTrafficZone`
- `trafficZones`
- `trafficZone`
- `updateTrafficZone`
- `updateTrafficDensity`
- `congestedZones`
- `deleteTrafficZone`

Le header JWT est ajoute automatiquement par Apollo Client:

```text
Authorization: Bearer <accessToken>
```
