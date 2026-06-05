import { Role } from '../common/enums/role.enum';
import type { AuthUser } from '../common/auth/strategies/jwt.strategy';
import { NotificationResolver } from './notification.resolver';
import { NotificationService } from './notification.service';

type NotificationServiceMock = Pick<
  NotificationService,
  | 'deleteNotification'
  | 'getNotifications'
  | 'getUnreadNotificationCount'
  | 'markAsRead'
  | 'markAllAsRead'
>;

describe('NotificationResolver', () => {
  let notificationService: Record<keyof NotificationServiceMock, jest.Mock>;
  let resolver: NotificationResolver;

  const currentUser: AuthUser = {
    id: '68ab2b30-1ef5-4215-9cdb-7522588f34cd',
    email: 'operator@example.com',
    role: Role.OPERATOR,
  };

  const spoofedUserId = '80ce2c9f-5a31-4471-9067-6db0ddb5a911';

  beforeEach(() => {
    notificationService = {
      deleteNotification: jest.fn().mockResolvedValue(true),
      getNotifications: jest.fn().mockResolvedValue([]),
      getUnreadNotificationCount: jest.fn().mockResolvedValue(0),
      markAsRead: jest.fn().mockResolvedValue({}),
      markAllAsRead: jest.fn().mockResolvedValue([]),
    };

    resolver = new NotificationResolver(
      notificationService as unknown as NotificationService,
    );
  });

  it('uses the JWT user id when listing notifications', async () => {
    await resolver.notifications(
      {
        userId: spoofedUserId,
        take: 10,
        skip: 0,
      },
      currentUser,
    );

    expect(notificationService.getNotifications).toHaveBeenCalledWith({
      userId: currentUser.id,
      take: 10,
      skip: 0,
    });
  });

  it('uses the JWT user id when counting unread notifications', async () => {
    await resolver.unreadNotificationCount(
      {
        userId: spoofedUserId,
      },
      currentUser,
    );

    expect(notificationService.getUnreadNotificationCount).toHaveBeenCalledWith(
      {
        userId: currentUser.id,
      },
    );
  });

  it('uses the JWT user id when marking one notification as read', async () => {
    await resolver.markNotificationAsRead(
      {
        id: '4d5a5952-2c57-43e0-9ed8-bb1ef64ce001',
        userId: spoofedUserId,
      },
      currentUser,
    );

    expect(notificationService.markAsRead).toHaveBeenCalledWith({
      id: '4d5a5952-2c57-43e0-9ed8-bb1ef64ce001',
      userId: currentUser.id,
    });
  });

  it('uses the JWT user id when marking all notifications as read', async () => {
    await resolver.markAllNotificationsAsRead(
      {
        userId: spoofedUserId,
      },
      currentUser,
    );

    expect(notificationService.markAllAsRead).toHaveBeenCalledWith({
      userId: currentUser.id,
    });
  });

  it('uses the JWT user id when deleting a notification', async () => {
    await resolver.deleteNotification(
      {
        id: '4d5a5952-2c57-43e0-9ed8-bb1ef64ce001',
        userId: spoofedUserId,
      },
      currentUser,
    );

    expect(notificationService.deleteNotification).toHaveBeenCalledWith({
      id: '4d5a5952-2c57-43e0-9ed8-bb1ef64ce001',
      userId: currentUser.id,
    });
  });
});
