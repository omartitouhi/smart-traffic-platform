import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IncidentResolver } from './incident.resolver';
import { IncidentService } from './incident.service';
import { NotificationEventPublisher } from './notification-event.publisher';

@Module({
  providers: [
    IncidentResolver,
    IncidentService,
    NotificationEventPublisher,
    {
      provide: 'PrismaService',
      useExisting: PrismaService,
    },
  ],
})
export class IncidentModule {}
