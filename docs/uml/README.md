# Diagrammes UML - Smart Traffic Platform

Ce dossier contient les diagrammes UML du projet Smart Traffic Platform au format Mermaid. Ils peuvent etre lus directement dans GitHub ou rendus avec un outil compatible Mermaid.

## Fichiers

| Fichier | Description |
| --- | --- |
| `01-component-diagram.mmd` | Vue globale des composants frontend, API Gateway, services backend, base PostgreSQL, WebSocket et CI/CD. |
| `02-auth-login-register-sequence.mmd` | Flux d'inscription et de connexion avec generation des JWT et refresh tokens. |
| `03-vehicle-gps-simulation-sequence.mmd` | Flux de simulation GPS d'un vehicule depuis le frontend jusqu'au stockage de la position. |
| `04-congestion-websocket-notification-sequence.mmd` | Flux de mesure de densite, detection de congestion et notification temps reel via WebSocket. |
| `05-incident-notification-sequence.mmd` | Flux de declaration d'incident et creation de notification associee. |
| `06-domain-class-diagram.mmd` | Diagramme de classes principales base sur les modeles Prisma des services. |

## Lecture des diagrammes

Les diagrammes representent l'architecture logique du projet. Certains liens entre entites sont volontairement notes comme relations logiques, car les microservices possedent leurs propres modules Prisma et ne declarent pas tous les liens sous forme de contraintes SQL directes.

## Rendu local optionnel

Avec Mermaid CLI installe :

```bash
mmdc -i docs/uml/01-component-diagram.mmd -o docs/uml/01-component-diagram.svg
```

Ou coller le contenu d'un fichier `.mmd` dans Mermaid Live Editor.

## Conventions

- Le frontend passe par l'API Gateway pour GraphQL.
- Le header `Authorization` est forwarde par la Gateway vers les services.
- Le Notification Service conserve un canal WebSocket direct pour les notifications temps reel.
- Les roles principaux sont `ADMIN` et `OPERATOR`.
- Les niveaux de congestion sont `LOW`, `MEDIUM` et `HIGH`.
