import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '../common/auth/decorators/current-user.decorator';
import { Roles } from '../common/auth/decorators/roles.decorator';
import type { AuthUser } from '../common/auth/strategies/jwt.strategy';
import { GqlJwtAuthGuard } from '../common/auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../common/auth/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
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
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  notifications(
    @Args('input') input: NotificationsQueryInput,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.getNotifications({
      ...input,
      userId: currentUser.id,
    });
  }

  @Query(() => [NotificationEntity])
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  unreadNotifications(
    @Args('input') input: NotificationsQueryInput,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.getUnreadNotifications({
      ...input,
      userId: currentUser.id,
    });
  }

  @Query(() => Int)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  unreadNotificationCount(
    @Args('input') input: NotificationUserInput,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<number> {
    return this.notificationService.getUnreadNotificationCount({
      ...input,
      userId: currentUser.id,
    });
  }

  @Mutation(() => NotificationEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
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
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  sendNotification(
    @Args('input') input: CreateNotificationInput,
  ): Promise<NotificationEntity> {
    return this.notificationService.createNotification(input);
  }

  @Mutation(() => NotificationEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  markAsRead(
    @Args('input') input: MarkNotificationReadInput,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<NotificationEntity> {
    return this.notificationService.markAsRead({
      ...input,
      userId: currentUser.id,
    });
  }

  @Mutation(() => NotificationEntity)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  markNotificationAsRead(
    @Args('input') input: MarkNotificationReadInput,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<NotificationEntity> {
    return this.notificationService.markAsRead({
      ...input,
      userId: currentUser.id,
    });
  }

  @Mutation(() => [NotificationEntity])
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  markAllAsRead(
    @Args('input') input: MarkAllNotificationsReadInput,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.markAllAsRead({
      ...input,
      userId: currentUser.id,
    });
  }

  @Mutation(() => [NotificationEntity])
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  markAllNotificationsAsRead(
    @Args('input') input: MarkAllNotificationsReadInput,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<NotificationEntity[]> {
    return this.notificationService.markAllAsRead({
      ...input,
      userId: currentUser.id,
    });
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlJwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.OPERATOR)
  deleteNotification(
    @Args('input') input: DeleteNotificationInput,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<boolean> {
    return this.notificationService.deleteNotification({
      ...input,
      userId: currentUser.id,
    });
  }
}
