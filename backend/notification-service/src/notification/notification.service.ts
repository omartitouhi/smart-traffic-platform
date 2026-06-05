import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  NotificationType,
  type Notification,
  type Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateDomainNotificationEventInput,
  DomainNotificationEventType,
} from './dto/create-domain-notification-event.input';
import { CreateNotificationInput } from './dto/create-notification.input';
import { DeleteNotificationInput } from './dto/delete-notification.input';
import { MarkAllNotificationsReadInput } from './dto/mark-all-notifications-read.input';
import { MarkNotificationReadInput } from './dto/mark-notification-read.input';
import { NotificationUserInput } from './dto/notification-user.input';
import { NotificationsQueryInput } from './dto/notifications-query.input';
import type { NotificationEntity } from './entities/notification.entity';
import { NotificationGateway } from './notification.gateway';

function isPrismaErrorWithCode(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  );
}

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationGateway: NotificationGateway,
  ) {}

  async createNotification(
    input: CreateNotificationInput,
  ): Promise<NotificationEntity> {
    try {
      const notification = await this.prisma.notification.create({
        data: {
          title: input.title.trim(),
          message: input.message.trim(),
          type: input.type,
          userId: input.userId ?? null,
        },
      });
      const entity = this.toNotificationEntity(notification);
      this.notificationGateway.emitNotificationCreated(entity);
      await this.emitUnreadCountForUser(entity.userId);
      return entity;
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de l envoi de la notification.',
      );
    }
  }

  async sendNotification(
    input: CreateNotificationInput,
  ): Promise<NotificationEntity> {
    return this.createNotification(input);
  }

  async getNotifications(
    input: NotificationsQueryInput,
  ): Promise<NotificationEntity[]> {
    const take = this.clamp(input.take ?? 50, 1, 100);
    const skip = Math.max(input.skip ?? 0, 0);
    const where: Prisma.NotificationWhereInput = {
      OR: [{ userId: input.userId }, { userId: null }],
      ...(input.isRead !== undefined ? { isRead: input.isRead } : {}),
    };

    try {
      const notifications = await this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take,
        skip,
      });
      return notifications.map((notification) =>
        this.toNotificationEntity(notification),
      );
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la recuperation des notifications.',
      );
    }
  }

  async getUnreadNotifications(
    input: NotificationsQueryInput,
  ): Promise<NotificationEntity[]> {
    return this.getNotifications({ ...input, isRead: false });
  }

  async getUnreadNotificationCount(
    input: NotificationUserInput,
  ): Promise<number> {
    try {
      return await this.prisma.notification.count({
        where: {
          OR: [{ userId: input.userId }, { userId: null }],
          isRead: false,
        },
      });
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors du comptage des notifications non lues.',
      );
    }
  }

  async markAsRead(
    input: MarkNotificationReadInput,
  ): Promise<NotificationEntity> {
    const notification = await this.findNotificationForUserOrThrow(
      input.id,
      input.userId,
    );

    if (notification.isRead) {
      return this.toNotificationEntity(notification);
    }

    try {
      const updatedNotification = await this.prisma.notification.update({
        where: { id: input.id },
        data: { isRead: true },
      });
      const entity = this.toNotificationEntity(updatedNotification);
      this.notificationGateway.emitNotificationRead(entity);
      await this.emitUnreadCountForUser(input.userId);
      return entity;
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors du marquage de la notification comme lue.',
      );
    }
  }

  async markNotificationAsRead(
    input: MarkNotificationReadInput,
  ): Promise<NotificationEntity> {
    return this.markAsRead(input);
  }

  async markAllAsRead(
    input: MarkAllNotificationsReadInput,
  ): Promise<NotificationEntity[]> {
    try {
      const unreadNotifications = await this.prisma.notification.findMany({
        where: {
          OR: [{ userId: input.userId }, { userId: null }],
          isRead: false,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (unreadNotifications.length === 0) {
        return [];
      }

      const notificationIds = unreadNotifications.map(
        (notification) => notification.id,
      );

      await this.prisma.notification.updateMany({
        where: {
          id: { in: notificationIds },
          OR: [{ userId: input.userId }, { userId: null }],
        },
        data: { isRead: true },
      });

      const updatedNotifications = await this.prisma.notification.findMany({
        where: {
          id: { in: notificationIds },
          OR: [{ userId: input.userId }, { userId: null }],
        },
        orderBy: { createdAt: 'desc' },
      });
      const entities = updatedNotifications.map((notification) =>
        this.toNotificationEntity(notification),
      );

      entities.forEach((notification) => {
        this.notificationGateway.emitNotificationRead(notification);
      });
      await this.emitUnreadCountForUser(input.userId);

      return entities;
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors du marquage des notifications comme lues.',
      );
    }
  }

  async deleteNotification(input: DeleteNotificationInput): Promise<boolean> {
    await this.findNotificationForUserOrThrow(input.id, input.userId);

    try {
      const deletedNotification = await this.prisma.notification.delete({
        where: { id: input.id },
      });
      this.notificationGateway.emitNotificationDeleted(
        this.toNotificationEntity(deletedNotification),
      );
      await this.emitUnreadCountForUser(input.userId);
      return true;
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la suppression de la notification.',
      );
    }
  }

  async createFromDomainEvent(
    input: CreateDomainNotificationEventInput,
  ): Promise<NotificationEntity> {
    const notification = this.buildNotificationFromDomainEvent(input);
    return this.createNotification(notification);
  }

  private async findNotificationForUserOrThrow(
    id: string,
    userId: string,
  ): Promise<Notification> {
    try {
      const notification = await this.prisma.notification.findFirst({
        where: {
          id,
          OR: [{ userId }, { userId: null }],
        },
      });

      if (!notification) {
        throw new NotFoundException('Notification introuvable.');
      }

      return notification;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handlePrismaError(
        error,
        'Erreur lors de la recuperation de la notification.',
      );
    }
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private toNotificationEntity(notification: Notification): NotificationEntity {
    return {
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      isRead: notification.isRead,
      userId: notification.userId,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    };
  }

  private buildNotificationFromDomainEvent(
    input: CreateDomainNotificationEventInput,
  ): CreateNotificationInput {
    const resourceName = input.resourceName?.trim() || 'ressource inconnue';

    switch (input.eventType) {
      case DomainNotificationEventType.TRAFFIC_ZONE_HIGH:
        return {
          title: 'Zone de trafic congestionnee',
          message: `La zone ${resourceName} est passee au niveau HIGH avec une densite de ${input.density ?? 'N/A'}.`,
          type: NotificationType.TRAFFIC_ALERT,
          userId: input.userId,
        };
      case DomainNotificationEventType.INCIDENT_DECLARED:
        return {
          title: 'Nouvel incident declare',
          message: `Un incident a ete declare pour ${resourceName}.`,
          type: NotificationType.INCIDENT_ALERT,
          userId: input.userId,
        };
      case DomainNotificationEventType.INCIDENT_STATUS_CHANGED:
        return {
          title: 'Statut incident mis a jour',
          message: `Le statut de ${resourceName} est passe de ${input.previousStatus ?? 'N/A'} a ${input.status ?? 'N/A'}.`,
          type: NotificationType.INCIDENT_ALERT,
          userId: input.userId,
        };
      case DomainNotificationEventType.VEHICLE_IN_CONGESTED_ZONE:
        return {
          title: 'Vehicule dans une zone congestionnee',
          message: `Un vehicule a envoye une position dans la zone congestionnee ${resourceName}.`,
          type: NotificationType.TRAFFIC_ALERT,
          userId: input.userId,
        };
    }
  }

  private async emitUnreadCountForUser(userId: string | null): Promise<void> {
    if (!userId) return;

    const count = await this.prisma.notification.count({
      where: {
        OR: [{ userId }, { userId: null }],
        isRead: false,
      },
    });
    this.notificationGateway.emitUnreadCount(userId, count);
  }

  private handlePrismaError(error: unknown, fallbackMessage: string): never {
    if (isPrismaErrorWithCode(error) && error.code === 'P2025') {
      throw new NotFoundException('Notification introuvable.');
    }

    if (isPrismaErrorWithCode(error) && error.code === 'P2003') {
      throw new BadRequestException(
        'La notification reference une donnee invalide.',
      );
    }

    const stack = error instanceof Error ? error.stack : undefined;
    this.logger.error(fallbackMessage, stack);
    throw new InternalServerErrorException(fallbackMessage);
  }
}
