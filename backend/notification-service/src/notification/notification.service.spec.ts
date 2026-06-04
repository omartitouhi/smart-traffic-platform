import { NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';

type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

type PrismaMock = {
  notification: {
    create: jest.Mock;
    delete: jest.Mock;
    findMany: jest.Mock;
    findFirst: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
  };
};

function createNotification(overrides: Partial<NotificationRecord> = {}) {
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

describe('NotificationService', () => {
  let prisma: PrismaMock;
  let gateway: Pick<
    NotificationGateway,
    | 'emitNotificationCreated'
    | 'emitNotificationDeleted'
    | 'emitNotificationRead'
  >;
  let service: NotificationService;

  beforeEach(() => {
    prisma = {
      notification: {
        create: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
      },
    };
    gateway = {
      emitNotificationCreated: jest.fn(),
      emitNotificationDeleted: jest.fn(),
      emitNotificationRead: jest.fn(),
    };
    service = new NotificationService(
      prisma as never,
      gateway as NotificationGateway,
    );
  });

  it('creates a notification and emits websocket event', async () => {
    const notification = createNotification();
    prisma.notification.create.mockResolvedValue(notification);

    const result = await service.createNotification({
      title: ' Traffic alert ',
      message: ' Congestion detectee. ',
      type: NotificationType.TRAFFIC_ALERT,
      userId: notification.userId,
    });

    expect(prisma.notification.create).toHaveBeenCalledWith({
      data: {
        title: 'Traffic alert',
        message: 'Congestion detectee.',
        type: NotificationType.TRAFFIC_ALERT,
        userId: notification.userId,
      },
    });
    expect(gateway.emitNotificationCreated).toHaveBeenCalledWith(result);
    expect(result).toMatchObject({
      id: notification.id,
      isRead: false,
      userId: notification.userId,
    });
  });

  it('keeps sendNotification as an alias for createNotification', async () => {
    const notification = createNotification();
    prisma.notification.create.mockResolvedValue(notification);

    const result = await service.sendNotification({
      title: 'Traffic alert',
      message: 'Congestion detectee.',
      type: NotificationType.TRAFFIC_ALERT,
      userId: notification.userId,
    });

    expect(result.id).toBe(notification.id);
    expect(gateway.emitNotificationCreated).toHaveBeenCalledWith(result);
  });

  it('gets notifications ordered for a user', async () => {
    const notification = createNotification();
    prisma.notification.findMany.mockResolvedValue([notification]);

    const result = await service.getNotifications({
      userId: notification.userId,
      isRead: false,
      take: 10,
      skip: 0,
    });

    expect(prisma.notification.findMany).toHaveBeenCalledWith({
      where: { userId: notification.userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
      skip: 0,
    });
    expect(result).toHaveLength(1);
  });

  it('gets unread notifications only', async () => {
    const notification = createNotification();
    prisma.notification.findMany.mockResolvedValue([notification]);

    const result = await service.getUnreadNotifications({
      userId: notification.userId,
      take: 10,
      skip: 0,
    });

    expect(prisma.notification.findMany).toHaveBeenCalledWith({
      where: { userId: notification.userId, isRead: false },
      orderBy: { createdAt: 'desc' },
      take: 10,
      skip: 0,
    });
    expect(result).toHaveLength(1);
  });

  it('marks a notification as read and emits websocket event', async () => {
    const notification = createNotification();
    const readNotification = createNotification({ isRead: true });
    prisma.notification.findFirst.mockResolvedValue(notification);
    prisma.notification.update.mockResolvedValue(readNotification);

    const result = await service.markAsRead({
      id: notification.id,
      userId: notification.userId,
    });

    expect(prisma.notification.update).toHaveBeenCalledWith({
      where: { id: notification.id },
      data: { isRead: true },
    });
    expect(gateway.emitNotificationRead).toHaveBeenCalledWith(result);
    expect(result.isRead).toBe(true);
  });

  it('marks all unread notifications as read and emits websocket events', async () => {
    const notification = createNotification();
    const secondNotification = createNotification({
      id: '9b41910c-5f8d-47dd-b5e9-0b66246b1a4c',
    });
    const readNotifications = [
      createNotification({ isRead: true }),
      createNotification({
        id: secondNotification.id,
        isRead: true,
      }),
    ];
    prisma.notification.findMany
      .mockResolvedValueOnce([notification, secondNotification])
      .mockResolvedValueOnce(readNotifications);
    prisma.notification.updateMany.mockResolvedValue({ count: 2 });

    const result = await service.markAllAsRead({
      userId: notification.userId,
    });

    expect(prisma.notification.updateMany).toHaveBeenCalledWith({
      where: {
        id: { in: [notification.id, secondNotification.id] },
        userId: notification.userId,
      },
      data: { isRead: true },
    });
    expect(gateway.emitNotificationRead).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(2);
    expect(result.every((item) => item.isRead)).toBe(true);
  });

  it('deletes a notification and emits websocket event', async () => {
    const notification = createNotification();
    prisma.notification.findFirst.mockResolvedValue(notification);
    prisma.notification.delete.mockResolvedValue(notification);

    const result = await service.deleteNotification({
      id: notification.id,
      userId: notification.userId,
    });

    expect(prisma.notification.delete).toHaveBeenCalledWith({
      where: { id: notification.id },
    });
    expect(gateway.emitNotificationDeleted).toHaveBeenCalledWith(
      expect.objectContaining({ id: notification.id }),
    );
    expect(result).toBe(true);
  });

  it('throws NotFoundException when notification does not belong to user', async () => {
    prisma.notification.findFirst.mockResolvedValue(null);

    await expect(
      service.markAsRead({
        id: '4d5a5952-2c57-43e0-9ed8-bb1ef64ce001',
        userId: '68ab2b30-1ef5-4215-9cdb-7522588f34cd',
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
