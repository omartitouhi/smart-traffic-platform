import { GraphQLProxyController } from './graphql-proxy.controller';

describe('GraphQLProxyController', () => {
  const originalFetch = global.fetch;
  const originalVehicleUrl = process.env.VEHICLE_SERVICE_GRAPHQL_URL;
  const originalAuthUrl = process.env.AUTH_SERVICE_GRAPHQL_URL;
  const originalTrafficUrl = process.env.TRAFFIC_SERVICE_GRAPHQL_URL;

  beforeEach(() => {
    process.env.AUTH_SERVICE_GRAPHQL_URL = 'http://auth/graphql';
    process.env.TRAFFIC_SERVICE_GRAPHQL_URL = 'http://traffic/graphql';
    process.env.VEHICLE_SERVICE_GRAPHQL_URL = 'http://vehicle/graphql';
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { vehicles: [] } }), {
        status: 200,
      }),
    ) as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.AUTH_SERVICE_GRAPHQL_URL = originalAuthUrl;
    process.env.TRAFFIC_SERVICE_GRAPHQL_URL = originalTrafficUrl;
    process.env.VEHICLE_SERVICE_GRAPHQL_URL = originalVehicleUrl;
    jest.restoreAllMocks();
  });

  it('forwards the Authorization header to the target service', async () => {
    const controller = new GraphQLProxyController();

    await controller.proxy(
      {
        query: 'query Vehicles { vehicles { id } }',
      },
      'Bearer access-token',
    );

    expect(global.fetch).toHaveBeenCalledWith(
      'http://vehicle/graphql',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer access-token',
        }) as Record<string, string>,
      }) as RequestInit,
    );
  });

  it('routes by operationName when the document has multiple operations', async () => {
    const controller = new GraphQLProxyController();

    await controller.proxy({
      operationName: 'Vehicles',
      query: `
        query LoginPreview { me { id } }
        query Vehicles { vehicles { id } }
      `,
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://vehicle/graphql',
      expect.any(Object),
    );
  });

  it('routes by the real field name when a GraphQL alias is used', async () => {
    const controller = new GraphQLProxyController();

    await controller.proxy({
      query: 'query AliasedVehicles { fleet: vehicles { id } }',
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://vehicle/graphql',
      expect.any(Object),
    );
  });

  it('routes measureTrafficDensity to the Traffic Service', async () => {
    const controller = new GraphQLProxyController();

    await controller.proxy({
      query: `
        mutation MeasureTrafficDensity($input: MeasureTrafficDensityInput!) {
          measureTrafficDensity(input: $input) { id density }
        }
      `,
      variables: {
        input: {
          zoneId: '9f1b7b62-8f40-4fb1-9d72-7d3462321f11',
          vehicleCount: 160,
        },
      },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      'http://traffic/graphql',
      expect.any(Object),
    );
  });

  it('rejects a request mixing operations from multiple services', async () => {
    const controller = new GraphQLProxyController();

    await expect(
      controller.proxy({
        query: 'query Mixed { me { id } vehicles { id } }',
      }),
    ).rejects.toThrow(
      'Une requete GraphQL ne peut pas melanger des operations de plusieurs services',
    );
  });

  it('rejects an unknown root operation', async () => {
    const controller = new GraphQLProxyController();

    await expect(
      controller.proxy({
        query: 'query Unknown { unknownOperation { id } }',
      }),
    ).rejects.toThrow('Operation GraphQL non routee par l API Gateway');
  });

  it('throws when a target service URL is missing', async () => {
    delete process.env.VEHICLE_SERVICE_GRAPHQL_URL;
    const controller = new GraphQLProxyController();

    await expect(
      controller.proxy({
        query: 'query Vehicles { vehicles { id } }',
      }),
    ).rejects.toThrow(
      'Variable d environnement manquante: VEHICLE_SERVICE_GRAPHQL_URL.',
    );
  });

  it('surfaces non-OK target service responses as gateway errors', async () => {
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ errors: [{ message: 'down' }] }), {
        status: 503,
      }),
    ) as jest.MockedFunction<typeof fetch>;
    const controller = new GraphQLProxyController();

    await expect(
      controller.proxy({
        query: 'query Vehicles { vehicles { id } }',
      }),
    ).rejects.toThrow('Le service GraphQL cible a repondu avec le statut 503.');
  });
});
