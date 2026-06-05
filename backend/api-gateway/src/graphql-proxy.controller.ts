import {
  BadGatewayException,
  BadRequestException,
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import {
  Kind,
  parse,
  type DefinitionNode,
  type OperationDefinitionNode,
} from 'graphql';

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
}
