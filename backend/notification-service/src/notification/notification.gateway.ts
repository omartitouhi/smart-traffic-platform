import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
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
  'notification.created': (notification: NotificationEntity) => void;
  'notification.deleted': (notification: NotificationEntity) => void;
  'notification.read': (notification: NotificationEntity) => void;
};

type InterServerEvents = Record<string, never>;

type SocketData = {
  userId?: string;
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
export class NotificationGateway implements OnGatewayConnection {
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  private server!: NotificationServer;

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: NotificationSocket): void {
    const token = this.extractToken(client);
    const secret = process.env.JWT_SECRET;

    if (!secret || !token) {
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
    this.server
      .to(this.userRoom(notification.userId))
      .emit('notification.created', notification);
  }

  emitNotificationDeleted(notification: NotificationEntity): void {
    this.server
      .to(this.userRoom(notification.userId))
      .emit('notification.deleted', notification);
  }

  emitNotificationRead(notification: NotificationEntity): void {
    this.server
      .to(this.userRoom(notification.userId))
      .emit('notification.read', notification);
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
