import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Header,
  HttpCode,
  NotFoundException,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  Kind,
  parse,
  type DefinitionNode,
  type OperationDefinitionNode,
} from 'graphql';

const isProd = process.env.NODE_ENV === 'production';
const isGraphqlUiEnabled =
  process.env.GRAPHQL_UI_ENABLED === 'true' ||
  (process.env.GRAPHQL_UI_ENABLED !== 'false' && !isProd);

type GraphQLRequestBody = {
  query?: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};

type ServiceKey =
  | 'AUTH_SERVICE_GRAPHQL_URL'
  | 'VEHICLE_SERVICE_GRAPHQL_URL'
  | 'TRAFFIC_SERVICE_GRAPHQL_URL'
  | 'NOTIFICATION_SERVICE_GRAPHQL_URL'
  | 'INCIDENT_SERVICE_GRAPHQL_URL';

export const OPERATION_ROUTES: Partial<Record<string, ServiceKey>> = {
  login: 'AUTH_SERVICE_GRAPHQL_URL',
  logout: 'AUTH_SERVICE_GRAPHQL_URL',
  me: 'AUTH_SERVICE_GRAPHQL_URL',
  refreshToken: 'AUTH_SERVICE_GRAPHQL_URL',
  register: 'AUTH_SERVICE_GRAPHQL_URL',
  users: 'AUTH_SERVICE_GRAPHQL_URL',

  addVehiclePosition: 'VEHICLE_SERVICE_GRAPHQL_URL',
  createVehicle: 'VEHICLE_SERVICE_GRAPHQL_URL',
  deleteVehicle: 'VEHICLE_SERVICE_GRAPHQL_URL',
  simulateVehiclePosition: 'VEHICLE_SERVICE_GRAPHQL_URL',
  updateVehicle: 'VEHICLE_SERVICE_GRAPHQL_URL',
  vehicle: 'VEHICLE_SERVICE_GRAPHQL_URL',
  vehiclePositions: 'VEHICLE_SERVICE_GRAPHQL_URL',
  vehicles: 'VEHICLE_SERVICE_GRAPHQL_URL',

  congestedZones: 'TRAFFIC_SERVICE_GRAPHQL_URL',
  createTrafficZone: 'TRAFFIC_SERVICE_GRAPHQL_URL',
  deleteTrafficZone: 'TRAFFIC_SERVICE_GRAPHQL_URL',
  measureTrafficDensity: 'TRAFFIC_SERVICE_GRAPHQL_URL',
  trafficZone: 'TRAFFIC_SERVICE_GRAPHQL_URL',
  trafficZones: 'TRAFFIC_SERVICE_GRAPHQL_URL',
  updateTrafficDensity: 'TRAFFIC_SERVICE_GRAPHQL_URL',
  updateTrafficZone: 'TRAFFIC_SERVICE_GRAPHQL_URL',

  createNotification: 'NOTIFICATION_SERVICE_GRAPHQL_URL',
  createNotificationFromEvent: 'NOTIFICATION_SERVICE_GRAPHQL_URL',
  deleteNotification: 'NOTIFICATION_SERVICE_GRAPHQL_URL',
  markAllAsRead: 'NOTIFICATION_SERVICE_GRAPHQL_URL',
  markAllNotificationsAsRead: 'NOTIFICATION_SERVICE_GRAPHQL_URL',
  markAsRead: 'NOTIFICATION_SERVICE_GRAPHQL_URL',
  markNotificationAsRead: 'NOTIFICATION_SERVICE_GRAPHQL_URL',
  notifications: 'NOTIFICATION_SERVICE_GRAPHQL_URL',
  sendNotification: 'NOTIFICATION_SERVICE_GRAPHQL_URL',
  unreadNotificationCount: 'NOTIFICATION_SERVICE_GRAPHQL_URL',
  unreadNotifications: 'NOTIFICATION_SERVICE_GRAPHQL_URL',

  declareIncident: 'INCIDENT_SERVICE_GRAPHQL_URL',
  deleteIncident: 'INCIDENT_SERVICE_GRAPHQL_URL',
  incident: 'INCIDENT_SERVICE_GRAPHQL_URL',
  incidents: 'INCIDENT_SERVICE_GRAPHQL_URL',
  incidentsByStatus: 'INCIDENT_SERVICE_GRAPHQL_URL',
  updateIncident: 'INCIDENT_SERVICE_GRAPHQL_URL',
  updateIncidentStatus: 'INCIDENT_SERVICE_GRAPHQL_URL',
};

@Controller('graphql')
export class GraphQLProxyController {
  @Get()
  @Header('Content-Type', 'text/html; charset=utf-8')
  getGraphqlConsole(): string {
    if (!isGraphqlUiEnabled) {
      throw new NotFoundException('GraphQL UI is disabled.');
    }

    return this.renderGraphqlConsole();
  }

  @Post()
  @HttpCode(200)
  async proxy(
    @Body() body: GraphQLRequestBody,
    @Headers('authorization') authorization?: string,
  ) {
    const targetUrl = this.resolveTargetUrl(body);
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (authorization) {
      headers.Authorization = authorization;
    }

    try {
      const response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      const responseText = await response.text();
      if (!responseText) return {};

      const payload = this.parseJsonResponse(responseText);
      if (!response.ok) {
        throw new BadGatewayException({
          message: `Le service GraphQL cible a repondu avec le statut ${response.status}.`,
          targetStatus: response.status,
          response: payload,
        });
      }

      return payload;
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;

      const message =
        error instanceof Error ? error.message : 'erreur inconnue';
      throw new BadGatewayException(
        `Erreur de communication avec le service GraphQL cible: ${message}.`,
      );
    }
  }

  private resolveTargetUrl(body: GraphQLRequestBody): string {
    const operations = this.extractRootOperations(body);
    const routeTargets = operations.map(
      (operation) => OPERATION_ROUTES[operation],
    );

    if (routeTargets.includes(undefined)) {
      const missingOperation = operations.find(
        (operation) => !OPERATION_ROUTES[operation],
      );
      throw new BadRequestException(
        `Operation GraphQL non routee par l API Gateway: ${missingOperation ?? 'inconnue'}.`,
      );
    }

    const serviceKeys = new Set(routeTargets);

    if (serviceKeys.size > 1) {
      throw new BadRequestException(
        'Une requete GraphQL ne peut pas melanger des operations de plusieurs services via cette Gateway.',
      );
    }

    const [serviceKey] = [...serviceKeys] as [ServiceKey];
    return this.getRequiredEnv(serviceKey);
  }

  private extractRootOperations(body: GraphQLRequestBody): string[] {
    if (!body.query?.trim()) {
      throw new BadRequestException('La requete GraphQL est vide.');
    }

    let definitions: readonly DefinitionNode[];
    try {
      const document = parse(body.query);
      definitions = document.definitions;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'syntaxe GraphQL invalide';
      throw new BadRequestException(`Requete GraphQL invalide: ${message}`);
    }

    const operation = this.selectOperation(definitions, body.operationName);

    if (!operation) {
      throw new BadRequestException(
        `Operation GraphQL introuvable: ${body.operationName ?? 'operation anonyme'}.`,
      );
    }

    const operations = operation.selectionSet.selections
      .filter((selection) => selection.kind === Kind.FIELD)
      .map((selection) => selection.name.value);

    if (operations.length === 0) {
      throw new BadRequestException(
        'La requete GraphQL ne contient aucune operation racine routable.',
      );
    }

    return [...new Set(operations)];
  }

  private selectOperation(
    definitions: readonly DefinitionNode[],
    operationName?: string,
  ): OperationDefinitionNode | undefined {
    const operations = definitions.filter(
      (definition): definition is OperationDefinitionNode =>
        definition.kind === Kind.OPERATION_DEFINITION,
    );

    if (operationName) {
      return operations.find(
        (operation) => operation.name?.value === operationName,
      );
    }

    if (operations.length > 1) {
      throw new BadRequestException(
        'operationName est requis quand une requete contient plusieurs operations GraphQL.',
      );
    }

    return operations[0];
  }

  private parseJsonResponse(responseText: string): unknown {
    try {
      return JSON.parse(responseText) as unknown;
    } catch {
      throw new BadGatewayException(
        'Le service GraphQL cible a retourne une reponse non JSON.',
      );
    }
  }

  private getRequiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new ServiceUnavailableException(
        `Variable d environnement manquante: ${name}.`,
      );
    }

    return value;
  }

  private renderGraphqlConsole(): string {
    return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Smart Traffic GraphQL Console</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #0b1220;
        --slate: #334155;
        --muted: #64748b;
        --line: #dbe4ee;
        --cloud: #f6f8fb;
        --cyan: #0891b2;
        --green: #16a34a;
        --white: #ffffff;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: var(--cloud);
        color: var(--ink);
      }
      header {
        padding: 28px 40px 18px;
        border-bottom: 1px solid var(--line);
        background: var(--white);
      }
      .kicker {
        color: var(--cyan);
        font-size: 12px;
        font-weight: 800;
        letter-spacing: .08em;
        text-transform: uppercase;
      }
      h1 {
        margin: 8px 0 8px;
        font-size: 34px;
        line-height: 1.1;
      }
      p { margin: 0; color: var(--muted); }
      main {
        display: grid;
        grid-template-columns: 280px minmax(0, 1fr);
        gap: 18px;
        padding: 22px 40px 36px;
      }
      aside, section {
        background: var(--white);
        border: 1px solid var(--line);
        border-radius: 10px;
      }
      aside { padding: 16px; }
      section { padding: 18px; min-width: 0; }
      button {
        border: 0;
        border-radius: 8px;
        background: var(--cyan);
        color: var(--white);
        cursor: pointer;
        font-weight: 700;
        padding: 10px 14px;
      }
      button.secondary {
        width: 100%;
        margin-bottom: 8px;
        background: #e0f2fe;
        color: #075985;
        text-align: left;
      }
      label {
        display: block;
        margin: 14px 0 7px;
        color: var(--slate);
        font-size: 13px;
        font-weight: 700;
      }
      input, textarea, pre {
        width: 100%;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #fbfdff;
        color: var(--ink);
        font-family: "Cascadia Code", Consolas, monospace;
        font-size: 13px;
      }
      input { padding: 10px; }
      textarea {
        min-height: 260px;
        resize: vertical;
        padding: 12px;
        line-height: 1.45;
      }
      pre {
        min-height: 210px;
        overflow: auto;
        padding: 12px;
        white-space: pre-wrap;
      }
      .grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      .actions {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 14px;
      }
      .status { color: var(--muted); font-size: 13px; }
      @media (max-width: 900px) {
        main { grid-template-columns: 1fr; padding: 18px; }
        .grid { grid-template-columns: 1fr; }
      }
    </style>
  </head>
  <body>
    <header>
      <div class="kicker">API Gateway GraphQL</div>
      <h1>Smart Traffic GraphQL Console</h1>
      <p>Interface locale de test. Les requetes sont envoyees en POST vers <strong>/graphql</strong>.</p>
    </header>
    <main>
      <aside>
        <div class="kicker">Exemples</div>
        <button class="secondary" data-sample="login">Auth - login</button>
        <button class="secondary" data-sample="me">Auth - me</button>
        <button class="secondary" data-sample="vehicles">Vehicle - vehicles</button>
        <button class="secondary" data-sample="traffic">Traffic - trafficZones</button>
        <button class="secondary" data-sample="notifications">Notification - notifications</button>
        <button class="secondary" data-sample="incidents">Incident - incidents</button>
        <label for="token">Bearer token</label>
        <input id="token" placeholder="Coller un accessToken JWT si necessaire" />
      </aside>
      <section>
        <div class="grid">
          <div>
            <label for="query">Query / Mutation</label>
            <textarea id="query"></textarea>
          </div>
          <div>
            <label for="variables">Variables JSON</label>
            <textarea id="variables">{}</textarea>
          </div>
        </div>
        <div class="actions">
          <button id="run">Executer</button>
          <span id="status" class="status">Pret.</span>
        </div>
        <label for="result">Resultat</label>
        <pre id="result">{}</pre>
      </section>
    </main>
    <script>
      const samples = {
        login: {
          query: 'mutation Login($input: LoginInput!) {\\n  login(input: $input) {\\n    accessToken\\n    user { id email role }\\n  }\\n}',
          variables: { input: { email: 'operator@example.com', password: 'Password123!' } }
        },
        me: {
          query: 'query Me {\\n  me { id email firstName lastName role }\\n}',
          variables: {}
        },
        vehicles: {
          query: 'query Vehicles {\\n  vehicles { id matricule brand model status }\\n}',
          variables: {}
        },
        traffic: {
          query: 'query TrafficZones {\\n  trafficZones { id name vehicleCount density congestionLevel isCongested }\\n}',
          variables: {}
        },
        notifications: {
          query: 'query Notifications($input: NotificationsQueryInput!) {\\n  notifications(input: $input) { id title type isRead createdAt }\\n}',
          variables: { input: { take: 20, skip: 0 } }
        },
        incidents: {
          query: 'query Incidents {\\n  incidents { id title type status latitude longitude }\\n}',
          variables: {}
        }
      };
      const queryEl = document.getElementById('query');
      const variablesEl = document.getElementById('variables');
      const resultEl = document.getElementById('result');
      const statusEl = document.getElementById('status');
      function loadSample(name) {
        queryEl.value = samples[name].query;
        variablesEl.value = JSON.stringify(samples[name].variables, null, 2);
      }
      document.querySelectorAll('[data-sample]').forEach((button) => {
        button.addEventListener('click', () => loadSample(button.dataset.sample));
      });
      document.getElementById('run').addEventListener('click', async () => {
        statusEl.textContent = 'Execution...';
        resultEl.textContent = '';
        try {
          const token = document.getElementById('token').value.trim();
          const headers = { 'Content-Type': 'application/json' };
          if (token) headers.Authorization = 'Bearer ' + token.replace(/^Bearer\\s+/i, '');
          const response = await fetch('/graphql', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              query: queryEl.value,
              variables: JSON.parse(variablesEl.value || '{}')
            })
          });
          const data = await response.json();
          resultEl.textContent = JSON.stringify(data, null, 2);
          statusEl.textContent = response.ok ? 'OK' : 'Erreur HTTP ' + response.status;
        } catch (error) {
          statusEl.textContent = 'Erreur.';
          resultEl.textContent = String(error && error.message ? error.message : error);
        }
      });
      loadSample('login');
    </script>
  </body>
</html>`;
  }
}
