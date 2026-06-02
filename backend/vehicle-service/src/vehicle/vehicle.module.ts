import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleResolver } from './vehicle.resolver';
import { VehicleService } from './vehicle.service';

@Module({
  providers: [
    VehicleResolver,
    VehicleService,
    {
      provide: 'PrismaService',
      useExisting: PrismaService,
    },
    PrismaService,
  ],
})
export class VehicleModule {}
