import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrafficResolver } from './traffic.resolver';
import { TrafficService } from './traffic.service';

@Module({
  providers: [
    TrafficResolver,
    TrafficService,
    {
      provide: 'PrismaService',
      useExisting: PrismaService,
    },
  ],
})
export class TrafficModule {}
