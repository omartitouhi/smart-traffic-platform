import {
  Body,
  Controller,
  Headers,
  HttpCode,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';

type GraphQLRequestBody = {
  query?: string;
  variables?: Record<string, unknown>;
  operationName?: string;
};

const AUTH_OPERATIONS = new Set([
  'login',
  'logout',
  'me',
  'refreshToken',
  'register',
  'users',
]);

const VEHICLE_OPERATIONS = new Set([
  'addVehiclePosition',
  'createVehicle',
  'deleteVehicle',
  'simulateVehiclePosition',
  'updateVehicle',
  'vehicle',
  'vehiclePositions',
  'vehicles',
]);

@Controller('graphql')
export class GraphQLProxyController {
  @Post()
  @HttpCode(200)
  async proxy(
    @Body() body: GraphQLRequestBody,
    @Headers('authorization') authorization?: string,
  ) {
    const targetUrl = this.resolveTargetUrl(body);

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: JSON.stringify(body),
    });

    const payload = (await response.json()) as unknown;
    return payload;
  }

  private resolveTargetUrl(body: GraphQLRequestBody): string {
    const operation = this.extractOperation(body);

    if (AUTH_OPERATIONS.has(operation)) {
      return this.getRequiredEnv('AUTH_SERVICE_GRAPHQL_URL');
    }

    if (VEHICLE_OPERATIONS.has(operation)) {
      return this.getRequiredEnv('VEHICLE_SERVICE_GRAPHQL_URL');
    }

    throw new InternalServerErrorException(
      `Operation GraphQL non routee par l API Gateway: ${operation || 'inconnue'}.`,
    );
  }

  private extractOperation(body: GraphQLRequestBody): string {
    if (body.operationName) {
      return (
        body.operationName.charAt(0).toLowerCase() + body.operationName.slice(1)
      );
    }

    const match = body.query?.match(
      /\b(?:query|mutation)\s+\w+[\s\S]*?\{\s*(\w+)/,
    );
    if (match?.[1]) return match[1];

    const anonymousMatch = body.query?.match(/\{\s*(\w+)/);
    return anonymousMatch?.[1] ?? '';
  }

  private getRequiredEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new InternalServerErrorException(
        `Variable d environnement manquante: ${name}.`,
      );
    }

    return value;
  }
}
