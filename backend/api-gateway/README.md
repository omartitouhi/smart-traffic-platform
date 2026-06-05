# Smart Traffic API Gateway

Point d'entree GraphQL unique du frontend.

Le frontend doit envoyer toutes les requetes GraphQL vers:

```txt
POST /graphql
```

La Gateway route chaque operation racine vers le microservice proprietaire et transmet le header `Authorization` au service cible.

## Variables D'Environnement

```txt
AUTH_SERVICE_GRAPHQL_URL=http://auth-service:3000/graphql
VEHICLE_SERVICE_GRAPHQL_URL=http://vehicle-service:3000/graphql
TRAFFIC_SERVICE_GRAPHQL_URL=http://traffic-service:3000/graphql
NOTIFICATION_SERVICE_GRAPHQL_URL=http://notification-service:3000/graphql
INCIDENT_SERVICE_GRAPHQL_URL=http://incident-service:3000/graphql
CORS_ORIGIN=http://localhost:3000
PORT=3000
```

## Operations Routees

Auth Service:

```txt
login
logout
me
refreshToken
register
users
```

Vehicle Service:

```txt
addVehiclePosition
createVehicle
deleteVehicle
simulateVehiclePosition
updateVehicle
vehicle
vehiclePositions
vehicles
```

Traffic Service:

```txt
congestedZones
createTrafficZone
deleteTrafficZone
measureTrafficDensity
trafficZone
trafficZones
updateTrafficDensity
updateTrafficZone
```

Notification Service:

```txt
createNotification
createNotificationFromEvent
deleteNotification
markAllAsRead
markAllNotificationsAsRead
markAsRead
markNotificationAsRead
notifications
sendNotification
unreadNotificationCount
unreadNotifications
```

Incident Service:

```txt
declareIncident
deleteIncident
incident
incidents
incidentsByStatus
updateIncident
updateIncidentStatus
```

## Contraintes De Routage

- Une requete GraphQL peut contenir plusieurs champs racine seulement s'ils appartiennent au meme service.
- Si un document contient plusieurs operations nommees, `operationName` est obligatoire.
- Les aliases GraphQL sont acceptes: la Gateway route selon le vrai nom du champ, pas selon l'alias.
- Les fragments sont transmis au service cible avec la requete originale.
- Les operations inconnues sont refusees par la Gateway.

## WebSocket

Les notifications temps reel utilisent Socket.IO directement sur le Notification Service (`/notifications`). Cette Gateway ne proxy pas encore les connexions WebSocket.
