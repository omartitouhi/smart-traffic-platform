import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationEventPublisher } from './notification-event.publisher';
import { TrafficResolver } from './traffic.resolver';
import { TrafficService } from './traffic.service';

@Module({
  providers: [
    TrafficResolver,
    TrafficService,
    NotificationEventPublisher,
    {
      provide: 'PrismaService',
      useExisting: PrismaService,
    },
  ],
})
export class TrafficModule {}
