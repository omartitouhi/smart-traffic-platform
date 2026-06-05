import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IncidentResolver } from './incident.resolver';
import { IncidentService } from './incident.service';

@Module({
  providers: [
    IncidentResolver,
    IncidentService,
    {
      provide: 'PrismaService',
      useExisting: PrismaService,
    },
  ],
})
export class IncidentModule {}
