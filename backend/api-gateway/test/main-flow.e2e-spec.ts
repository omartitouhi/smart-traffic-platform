import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';

type GraphQLBody = {
  query: string;
  variables?: Record<string, unknown>;
};

type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  type: 'TRAFFIC_ALERT' | 'INCIDENT_ALERT';
  isRead: boolean;
};

const AUTH_URL = 'http://auth-service.test/graphql';
const VEHICLE_URL = 'http://vehicle-service.test/graphql';
const TRAFFIC_URL = 'http://traffic-service.test/graphql';
const NOTIFICATION_URL = 'http://notification-service.test/graphql';
const INCIDENT_URL = 'http://incident-service.test/graphql';

const accessToken = 'test-access-token';
const vehicleId = '22222222-2222-4222-8222-222222222222';
const trafficZoneId = '33333333-3333-4333-8333-333333333333';
const incidentId = '55555555-5555-4555-8555-555555555555';

function parseBody(init?: RequestInit): GraphQLBody {
  if (typeof init?.body !== 'string') {
    throw new Error('Expected GraphQL request body to be a JSON string.');
  }

  return JSON.parse(init.body) as GraphQLBody;
}

function jsonResponse(data: unknown): Response {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function getRequestUrl(input: string | URL | Request): string {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.href;
  return input.url;
}

function createFetchMock() {
  const notifications: NotificationRecord[] = [];

  return jest.fn((input: string | URL | Request, init?: RequestInit) => {
    const url = getRequestUrl(input);
    const body = parseBody(init);

    if (url === AUTH_URL) {
      if (body.query.includes('register')) {
        return Promise.resolve(
          jsonResponse({
            register: {
              accessToken,
              refreshToken: 'test-refresh-token',
              user: {
                id: '11111111-1111-4111-8111-111111111111',
                email: 'operator@example.com',
                role: 'OPERATOR',
              },
            },
          }),
        );
      }

      if (body.query.includes('login')) {
        return Promise.resolve(
          jsonResponse({
            login: {
              accessToken,
              refreshToken: 'test-refresh-token',
              user: {
                id: '11111111-1111-4111-8111-111111111111',
                email: 'operator@example.com',
                role: 'OPERATOR',
              },
            },
          }),
        );
      }
    }

    if (url === VEHICLE_URL) {
      if (body.query.includes('createVehicle')) {
        return Promise.resolve(
          jsonResponse({
            createVehicle: {
              id: vehicleId,
              matricule: 'TN-2026-001',
              brand: 'Renault',
              model: 'Clio',
              type: 'CAR',
              status: 'ACTIVE',
            },
          }),
        );
      }

      if (body.query.includes('simulateVehiclePosition')) {
        return Promise.resolve(
          jsonResponse({
            simulateVehiclePosition: {
              id: '66666666-6666-4666-8666-666666666666',
              vehicleId,
              latitude: 36.8065,
              longitude: 10.1815,
              speed: 42.5,
            },
          }),
        );
      }
    }

    if (url === TRAFFIC_URL) {
      if (body.query.includes('createTrafficZone')) {
        return Promise.resolve(
          jsonResponse({
            createTrafficZone: {
              id: trafficZoneId,
              name: 'Centre-ville Tunis',
              vehicleCount: 25,
              density: 25,
              congestionLevel: 'LOW',
              isCongested: false,
            },
          }),
        );
      }

      if (body.query.includes('updateTrafficDensity')) {
        notifications.push({
          id: '44444444-4444-4444-8444-444444444444',
          title: 'Congestion detectee',
          message: 'Densite elevee dans la zone Centre-ville Tunis.',
          type: 'TRAFFIC_ALERT',
          isRead: false,
        });

        return Promise.resolve(
          jsonResponse({
            updateTrafficDensity: {
              id: trafficZoneId,
              name: 'Centre-ville Tunis',
              vehicleCount: 120,
              density: 95,
              congestionLevel: 'HIGH',
              isCongested: true,
            },
          }),
        );
      }
    }

    if (url === INCIDENT_URL && body.query.includes('declareIncident')) {
      notifications.push({
        id: '77777777-7777-4777-8777-777777777777',
        title: 'Incident declare',
        message: 'Un accident a ete signale.',
        type: 'INCIDENT_ALERT',
        isRead: false,
      });

      return Promise.resolve(
        jsonResponse({
          declareIncident: {
            id: incidentId,
            title: 'Accident avenue Habib Bourguiba',
            type: 'ACCIDENT',
            status: 'SIGNALE',
          },
        }),
      );
    }

    if (url === NOTIFICATION_URL && body.query.includes('notifications')) {
      return Promise.resolve(
        jsonResponse({
          notifications,
        }),
      );
    }

    return Promise.resolve(
      new Response(
        JSON.stringify({ errors: [{ message: 'Unhandled mock request' }] }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      ),
    );
  });
}

describe('Smart Traffic main flow through API Gateway (e2e)', () => {
  let app: INestApplication<App>;
  let fetchMock: jest.MockedFunction<typeof fetch>;

  beforeEach(async () => {
    process.env.AUTH_SERVICE_GRAPHQL_URL = AUTH_URL;
    process.env.VEHICLE_SERVICE_GRAPHQL_URL = VEHICLE_URL;
    process.env.TRAFFIC_SERVICE_GRAPHQL_URL = TRAFFIC_URL;
    process.env.NOTIFICATION_SERVICE_GRAPHQL_URL = NOTIFICATION_URL;
    process.env.INCIDENT_SERVICE_GRAPHQL_URL = INCIDENT_URL;

    fetchMock = createFetchMock() as jest.MockedFunction<typeof fetch>;
    global.fetch = fetchMock;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.restoreAllMocks();
  });

  it('validates register/login, vehicle GPS, congestion notification, and incident notification', async () => {
    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation Register($input: RegisterInput!) {
            register(input: $input) {
              accessToken
              user { email role }
            }
          }
        `,
        variables: {
          input: {
            email: 'operator@example.com',
            password: 'Password123!',
            firstName: 'Test',
            lastName: 'Operator',
          },
        },
      })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          data: {
            register: {
              accessToken,
              user: { email: 'operator@example.com', role: 'OPERATOR' },
            },
          },
        });
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation Login($input: LoginInput!) {
            login(input: $input) {
              accessToken
              user { email role }
            }
          }
        `,
        variables: {
          input: {
            email: 'operator@example.com',
            password: 'Password123!',
          },
        },
      })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          data: {
            login: {
              accessToken,
              user: { email: 'operator@example.com', role: 'OPERATOR' },
            },
          },
        });
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          mutation CreateVehicle($input: CreateVehicleInput!) {
            createVehicle(input: $input) {
              id
              matricule
              status
            }
          }
        `,
        variables: {
          input: {
            matricule: 'TN-2026-001',
            brand: 'Renault',
            model: 'Clio',
            type: 'CAR',
            status: 'ACTIVE',
          },
        },
      })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          data: {
            createVehicle: {
              id: vehicleId,
              matricule: 'TN-2026-001',
              status: 'ACTIVE',
            },
          },
        });
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          mutation SimulateVehiclePosition($vehicleId: ID!) {
            simulateVehiclePosition(vehicleId: $vehicleId) {
              vehicleId
              latitude
              longitude
              speed
            }
          }
        `,
        variables: { vehicleId },
      })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          data: {
            simulateVehiclePosition: {
              vehicleId,
              latitude: 36.8065,
              longitude: 10.1815,
              speed: 42.5,
            },
          },
        });
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          mutation CreateTrafficZone($input: CreateTrafficZoneInput!) {
            createTrafficZone(input: $input) {
              id
              name
              congestionLevel
              isCongested
            }
          }
        `,
        variables: {
          input: {
            name: 'Centre-ville Tunis',
            latitude: 36.8065,
            longitude: 10.1815,
            radius: 1200,
            vehicleCount: 25,
          },
        },
      })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          data: {
            createTrafficZone: {
              id: trafficZoneId,
              congestionLevel: 'LOW',
              isCongested: false,
            },
          },
        });
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          mutation UpdateTrafficDensity($input: UpdateTrafficDensityInput!) {
            updateTrafficDensity(input: $input) {
              id
              vehicleCount
              density
              congestionLevel
              isCongested
            }
          }
        `,
        variables: {
          input: {
            zoneId: trafficZoneId,
            vehicleCount: 120,
          },
        },
      })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          data: {
            updateTrafficDensity: {
              id: trafficZoneId,
              congestionLevel: 'HIGH',
              isCongested: true,
            },
          },
        });
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          query Notifications($input: NotificationsQueryInput!) {
            notifications(input: $input) {
              title
              type
              isRead
            }
          }
        `,
        variables: { input: { take: 20, skip: 0 } },
      })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          data: {
            notifications: [
              {
                title: 'Congestion detectee',
                type: 'TRAFFIC_ALERT',
                isRead: false,
              },
            ],
          },
        });
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          mutation DeclareIncident($input: CreateIncidentInput!) {
            declareIncident(input: $input) {
              id
              title
              type
              status
            }
          }
        `,
        variables: {
          input: {
            title: 'Accident avenue Habib Bourguiba',
            description: 'Collision signalee avec ralentissement important.',
            type: 'ACCIDENT',
            latitude: 36.8008,
            longitude: 10.1847,
            address: 'Avenue Habib Bourguiba, Tunis',
          },
        },
      })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        expect(body).toMatchObject({
          data: {
            declareIncident: {
              id: incidentId,
              type: 'ACCIDENT',
              status: 'SIGNALE',
            },
          },
        });
      });

    await request(app.getHttpServer())
      .post('/graphql')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: `
          query Notifications($input: NotificationsQueryInput!) {
            notifications(input: $input) {
              title
              type
              isRead
            }
          }
        `,
        variables: { input: { take: 20, skip: 0 } },
      })
      .expect(200)
      .expect(({ body }: { body: unknown }) => {
        const serializedBody = JSON.stringify(body);
        expect(serializedBody).toContain('TRAFFIC_ALERT');
        expect(serializedBody).toContain('INCIDENT_ALERT');
      });

    expect(fetchMock).toHaveBeenCalledWith(
      VEHICLE_URL,
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: `Bearer ${accessToken}`,
        }) as Record<string, string>,
      }),
    );
  });
});
