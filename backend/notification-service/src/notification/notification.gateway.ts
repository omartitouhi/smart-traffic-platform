import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import type { NotificationEntity } from './entities/notification.entity';

type JwtPayload = {
  sub: string;
  email?: string;
  role?: string;
};

type ClientToServerEvents = {
  'notifications.join': () => void;
  'notifications.ping': (payload: unknown) => void;
};

type ServerToClientEvents = {
  'notification:new': (notification: NotificationEntity) => void;
  'notification.deleted': (notification: NotificationEntity) => void;
  'notification:read': (notification: NotificationEntity) => void;
  'notification:unreadCount': (payload: UnreadCountPayload) => void;
};

type InterServerEvents = Record<string, never>;

type SocketData = {
  userId?: string;
};

type UnreadCountPayload = {
  userId?: string;
  count: number;
};

type NotificationServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type NotificationSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

@WebSocketGateway({
  namespace: 'notifications',
  cors: {
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
      : true,
    credentials: true,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  private server!: NotificationServer;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: NotificationSocket): void {
    const token = this.extractToken(client);
    const secret = process.env.JWT_SECRET;

    if (!token) {
      this.logger.log(`Client notifications connecte sans utilisateur.`);
      return;
    }

    if (!secret) {
      client.disconnect(true);
      return;
    }

    try {
      const payload = this.jwtService.verify<JwtPayload>(token, {
        secret,
      });
      client.data.userId = payload.sub;
      void client.join(this.userRoom(payload.sub));
      this.logger.log(`Client notifications connecte: ${payload.sub}`);
    } catch {
      client.disconnect(true);
    }
  }

  handleDisconnect(client: NotificationSocket): void {
    const userId = client.data.userId;
    this.logger.log(
      userId
        ? `Client notifications deconnecte: ${userId}`
        : 'Client notifications deconnecte sans utilisateur.',
    );
  }

  @SubscribeMessage('notifications.join')
  joinOwnRoom(@ConnectedSocket() client: NotificationSocket): {
    joined: boolean;
  } {
    if (!client.data.userId) return { joined: false };
    void client.join(this.userRoom(client.data.userId));
    return { joined: true };
  }

  @SubscribeMessage('notifications.ping')
  ping(@MessageBody() payload: unknown): { ok: boolean; payload: unknown } {
    return { ok: true, payload };
  }

  emitNotificationCreated(notification: NotificationEntity): void {
    if (notification.userId) {
      this.server
        .to(this.userRoom(notification.userId))
        .emit('notification:new', notification);
      return;
    }

    this.server.emit('notification:new', notification);
  }

  emitNotificationDeleted(notification: NotificationEntity): void {
    if (!notification.userId) {
      this.server.emit('notification.deleted', notification);
      return;
    }

    this.server
      .to(this.userRoom(notification.userId))
      .emit('notification.deleted', notification);
  }

  emitNotificationRead(notification: NotificationEntity): void {
    if (notification.userId) {
      this.server
        .to(this.userRoom(notification.userId))
        .emit('notification:read', notification);
      return;
    }

    this.server.emit('notification:read', notification);
  }

  emitUnreadCount(userId: string | undefined, count: number): void {
    const payload = {
      userId,
      count,
    };

    if (userId) {
      this.server
        .to(this.userRoom(userId))
        .emit('notification:unreadCount', payload);
      return;
    }

    this.server.emit('notification:unreadCount', payload);
  }

  private extractToken(client: NotificationSocket): string | null {
    const auth = client.handshake.auth as { token?: unknown };
    const authToken = auth.token;
    if (typeof authToken === 'string' && authToken.trim()) {
      return this.normalizeBearerToken(authToken);
    }

    const header = client.handshake.headers.authorization;
    if (typeof header === 'string' && header.trim()) {
      return this.normalizeBearerToken(header);
    }

    return null;
  }

  private normalizeBearerToken(value: string): string {
    return value.startsWith('Bearer ') ? value.slice(7) : value;
  }

  private userRoom(userId: string): string {
    return `user:${userId}`;
  }
}
