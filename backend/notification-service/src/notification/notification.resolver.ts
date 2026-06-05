import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateDomainNotificationEventInput } from './dto/create-domain-notification-event.input';
import { CreateNotificationInput } from './dto/create-notification.input';
import { DeleteNotificationInput } from './dto/delete-notification.input';
import { MarkAllNotificationsReadInput } from './dto/mark-all-notifications-read.input';
import { MarkNotificationReadInput } from './dto/mark-notification-read.input';
import { NotificationUserInput } from './dto/notification-user.input';
import { NotificationsQueryInput } from './dto/notifications-query.input';
import { NotificationEntity } from './entities/notification.entity';
import { NotificationService } from './notification.service';

@Resolver(() => NotificationEntity)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Query(() => [NotificationEntity])
  notifications(
    @Args('input') input: NotificationsQueryInput,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.getNotifications(input);
  }

  @Query(() => [NotificationEntity])
  unreadNotifications(
    @Args('input') input: NotificationsQueryInput,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.getUnreadNotifications(input);
  }

  @Query(() => Int)
  unreadNotificationCount(
    @Args('input') input: NotificationUserInput,
  ): Promise<number> {
    return this.notificationService.getUnreadNotificationCount(input);
  }

  @Mutation(() => NotificationEntity)
  createNotification(
    @Args('input') input: CreateNotificationInput,
  ): Promise<NotificationEntity> {
    return this.notificationService.createNotification(input);
  }

  @Mutation(() => NotificationEntity)
  createNotificationFromEvent(
    @Args('input') input: CreateDomainNotificationEventInput,
  ): Promise<NotificationEntity> {
    return this.notificationService.createFromDomainEvent(input);
  }

  @Mutation(() => NotificationEntity)
  sendNotification(
    @Args('input') input: CreateNotificationInput,
  ): Promise<NotificationEntity> {
    return this.notificationService.createNotification(input);
  }

  @Mutation(() => NotificationEntity)
  markAsRead(
    @Args('input') input: MarkNotificationReadInput,
  ): Promise<NotificationEntity> {
    return this.notificationService.markAsRead(input);
  }

  @Mutation(() => NotificationEntity)
  markNotificationAsRead(
    @Args('input') input: MarkNotificationReadInput,
  ): Promise<NotificationEntity> {
    return this.notificationService.markAsRead(input);
  }

  @Mutation(() => [NotificationEntity])
  markAllAsRead(
    @Args('input') input: MarkAllNotificationsReadInput,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.markAllAsRead(input);
  }

  @Mutation(() => [NotificationEntity])
  markAllNotificationsAsRead(
    @Args('input') input: MarkAllNotificationsReadInput,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.markAllAsRead(input);
  }

  @Mutation(() => Boolean)
  deleteNotification(
    @Args('input') input: DeleteNotificationInput,
  ): Promise<boolean> {
    return this.notificationService.deleteNotification(input);
  }
}
