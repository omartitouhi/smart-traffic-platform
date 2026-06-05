import { GraphQLProxyController } from './graphql-proxy.controller';

describe('GraphQLProxyController', () => {
  const originalFetch = global.fetch;
  const originalVehicleUrl = process.env.VEHICLE_SERVICE_GRAPHQL_URL;

  beforeEach(() => {
    process.env.VEHICLE_SERVICE_GRAPHQL_URL = 'http://vehicle/graphql';
    global.fetch = jest.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { vehicles: [] } }), {
        status: 200,
      }),
    ) as jest.MockedFunction<typeof fetch>;
  });

  afterEach(() => {
    global.fetch = originalFetch;
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
});
