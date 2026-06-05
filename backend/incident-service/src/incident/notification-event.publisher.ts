import { Injectable, Logger } from '@nestjs/common';

type DomainNotificationEventType =
  | 'INCIDENT_DECLARED'
  | 'INCIDENT_STATUS_CHANGED'
  | 'TRAFFIC_ZONE_HIGH'
  | 'VEHICLE_IN_CONGESTED_ZONE';

type NotificationEventPayload = {
  eventType: DomainNotificationEventType;
  resourceId?: string;
  resourceName?: string;
  previousStatus?: string;
  status?: string;
  density?: number;
  vehicleCount?: number;
  userId?: string;
};

type GraphQLNotificationResponse = {
  errors?: Array<{ message?: string }>;
};

const CREATE_NOTIFICATION_FROM_EVENT_MUTATION = `
  mutation CreateNotificationFromEvent($input: CreateDomainNotificationEventInput!) {
    createNotificationFromEvent(input: $input) {
      id
    }
  }
`;

@Injectable()
export class NotificationEventPublisher {
  private readonly logger = new Logger(NotificationEventPublisher.name);

  async publish(payload: NotificationEventPayload): Promise<void> {
    const endpoint = process.env.NOTIFICATION_SERVICE_GRAPHQL_URL;

    if (!endpoint) {
      this.logger.warn(
        'NOTIFICATION_SERVICE_GRAPHQL_URL absente, evenement notification ignore.',
      );
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: CREATE_NOTIFICATION_FROM_EVENT_MUTATION,
          variables: { input: payload },
        }),
      });

      const result = (await response.json()) as GraphQLNotificationResponse;

      if (!response.ok || result.errors?.length) {
        this.logger.warn(
          `Notification non creee: ${result.errors?.[0]?.message ?? response.statusText}.`,
        );
      }
    } catch (error) {
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.warn('Notification service indisponible.', stack);
    }
  }
}
