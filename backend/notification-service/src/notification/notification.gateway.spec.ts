import { JwtService } from '@nestjs/jwt';
import { NotificationType } from '@prisma/client';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';

type MockSocketServer = {
  emit: jest.Mock;
  to: jest.Mock;
};

function createNotification(
  overrides: Partial<NotificationEntity> = {},
): NotificationEntity {
  const now = new Date('2026-06-05T10:00:00.000Z');

  return {
    id: '4d5a5952-2c57-43e0-9ed8-bb1ef64ce001',
    title: 'Traffic alert',
    message: 'Congestion detectee.',
    type: NotificationType.TRAFFIC_ALERT,
    isRead: false,
    userId: '68ab2b30-1ef5-4215-9cdb-7522588f34cd',
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function attachMockServer(gateway: NotificationGateway) {
  const roomEmitter = {
    emit: jest.fn(),
  };
  const server: MockSocketServer = {
    emit: jest.fn(),
    to: jest.fn().mockReturnValue(roomEmitter),
  };

  Object.defineProperty(gateway, 'server', {
    value: server,
  });

  return { roomEmitter, server };
}

describe('NotificationGateway', () => {
  let gateway: NotificationGateway;
  let jwtService: Pick<JwtService, 'verify'>;

  beforeEach(() => {
    jwtService = {
      verify: jest.fn(),
    };
    gateway = new NotificationGateway(jwtService as JwtService);
  });

  it('emits notification:new to the user room when notification has userId', () => {
    const { roomEmitter, server } = attachMockServer(gateway);
    const notification = createNotification();

    gateway.emitNotificationCreated(notification);

    expect(server.to).toHaveBeenCalledWith(`user:${notification.userId}`);
    expect(roomEmitter.emit).toHaveBeenCalledWith(
      'notification:new',
      notification,
    );
    expect(server.emit).not.toHaveBeenCalled();
  });

  it('broadcasts notification:new when notification is global', () => {
    const { server } = attachMockServer(gateway);
    const notification = createNotification({ userId: null });

    gateway.emitNotificationCreated(notification);

    expect(server.emit).toHaveBeenCalledWith('notification:new', notification);
    expect(server.to).not.toHaveBeenCalled();
  });

  it('emits notification:read to the user room when notification has userId', () => {
    const { roomEmitter, server } = attachMockServer(gateway);
    const notification = createNotification({ isRead: true });

    gateway.emitNotificationRead(notification);

    expect(server.to).toHaveBeenCalledWith(`user:${notification.userId}`);
    expect(roomEmitter.emit).toHaveBeenCalledWith(
      'notification:read',
      notification,
    );
    expect(server.emit).not.toHaveBeenCalled();
  });

  it('broadcasts notification:read when notification is global', () => {
    const { server } = attachMockServer(gateway);
    const notification = createNotification({ isRead: true, userId: null });

    gateway.emitNotificationRead(notification);

    expect(server.emit).toHaveBeenCalledWith('notification:read', notification);
    expect(server.to).not.toHaveBeenCalled();
  });
});
