import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CongestionLevel, Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrafficZoneInput } from './dto/create-traffic-zone.input';
import { MeasureTrafficDensityInput } from './dto/measure-traffic-density.input';

type TrafficZoneRecord = {
  id: string;
  name: string;
  description: string | null;
  latitude: number;
  longitude: number;
  radius: number;
  vehicleCount: number;
  density: number;
  congestionLevel: CongestionLevel;
  isCongested: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function isPrismaErrorWithCode(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string'
  );
}

@Injectable()
export class TrafficService {
  private readonly logger = new Logger(TrafficService.name);

  constructor(
    @Inject('PrismaService')
    private readonly prisma: PrismaService,
  ) {}

  async createTrafficZone(
    input: CreateTrafficZoneInput,
  ): Promise<TrafficZoneRecord> {
    const vehicleCount = input.vehicleCount ?? 0;
    const trafficMetrics = this.calculateTrafficMetrics(
      vehicleCount,
      input.radius,
    );

    try {
      const zone = await this.prisma.trafficZone.create({
        data: {
          name: input.name.trim(),
          description: input.description?.trim() || null,
          latitude: input.latitude,
          longitude: input.longitude,
          radius: input.radius,
          vehicleCount,
          ...trafficMetrics,
        },
      });

      return this.toTrafficZoneRecord(zone);
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la creation de la zone de circulation.',
      );
    }
  }

  async getTrafficZones(take = 50, skip = 0): Promise<TrafficZoneRecord[]> {
    const safeTake = this.clamp(take, 1, 100);
    const safeSkip = Math.max(skip, 0);

    try {
      const zones = await this.prisma.trafficZone.findMany({
        orderBy: { createdAt: 'desc' },
        take: safeTake,
        skip: safeSkip,
      });

      return zones.map((zone) => this.toTrafficZoneRecord(zone));
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la recuperation des zones de circulation.',
      );
    }
  }

  async getTrafficZoneById(id: string): Promise<TrafficZoneRecord> {
    const zone = await this.findTrafficZoneOrThrow(id);
    return this.toTrafficZoneRecord(zone);
  }

  async measureTrafficDensity(
    input: MeasureTrafficDensityInput,
  ): Promise<TrafficZoneRecord> {
    const zone = await this.findTrafficZoneOrThrow(input.zoneId);
    const trafficMetrics = this.calculateTrafficMetrics(
      input.vehicleCount,
      Number(zone.radius),
    );

    try {
      const updatedZone = await this.prisma.trafficZone.update({
        where: { id: input.zoneId },
        data: {
          vehicleCount: input.vehicleCount,
          ...trafficMetrics,
        },
      });

      return this.toTrafficZoneRecord(updatedZone);
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la mesure de la densite du trafic.',
      );
    }
  }

  async getCongestedTrafficZones(): Promise<TrafficZoneRecord[]> {
    try {
      const zones = await this.prisma.trafficZone.findMany({
        where: { isCongested: true },
        orderBy: [{ density: 'desc' }, { createdAt: 'desc' }],
      });

      return zones.map((zone) => this.toTrafficZoneRecord(zone));
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la detection des zones congestionnees.',
      );
    }
  }

  private async findTrafficZoneOrThrow(
    id: string,
  ): Promise<Prisma.TrafficZoneGetPayload<object>> {
    try {
      const zone = await this.prisma.trafficZone.findUnique({ where: { id } });
      if (!zone) {
        throw new NotFoundException('Zone de circulation introuvable.');
      }

      return zone;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handlePrismaError(
        error,
        'Erreur lors de la recuperation de la zone de circulation.',
      );
    }
  }

  private calculateTrafficMetrics(
    vehicleCount: number,
    radius: number,
  ): {
    density: number;
    congestionLevel: CongestionLevel;
    isCongested: boolean;
  } {
    if (radius <= 0) {
      throw new BadRequestException(
        'Le rayon doit etre strictement superieur a 0.',
      );
    }

    const density = Number((vehicleCount / radius).toFixed(2));
    const congestionLevel = this.classifyCongestionLevel(density);

    return {
      density,
      congestionLevel,
      isCongested: congestionLevel === CongestionLevel.HIGH,
    };
  }

  private classifyCongestionLevel(density: number): CongestionLevel {
    if (density < 5) return CongestionLevel.LOW;
    if (density <= 15) return CongestionLevel.MEDIUM;
    return CongestionLevel.HIGH;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private toTrafficZoneRecord(zone: {
    id: string;
    name: string;
    description: string | null;
    latitude: Prisma.Decimal;
    longitude: Prisma.Decimal;
    radius: Prisma.Decimal;
    vehicleCount: number;
    density: Prisma.Decimal;
    congestionLevel: CongestionLevel;
    isCongested: boolean;
    createdAt: Date;
    updatedAt: Date;
  }): TrafficZoneRecord {
    return {
      id: zone.id,
      name: zone.name,
      description: zone.description,
      latitude: Number(zone.latitude),
      longitude: Number(zone.longitude),
      radius: Number(zone.radius),
      vehicleCount: zone.vehicleCount,
      density: Number(zone.density),
      congestionLevel: zone.congestionLevel,
      isCongested: zone.isCongested,
      createdAt: zone.createdAt,
      updatedAt: zone.updatedAt,
    };
  }

  private handlePrismaError(error: unknown, fallbackMessage: string): never {
    if (isPrismaErrorWithCode(error) && error.code === 'P2002') {
      throw new ConflictException(
        'Une zone de circulation avec ce nom existe deja.',
      );
    }

    if (isPrismaErrorWithCode(error) && error.code === 'P2025') {
      throw new NotFoundException('Zone de circulation introuvable.');
    }

    const stack = error instanceof Error ? error.stack : undefined;
    this.logger.error(fallbackMessage, stack);
    throw new InternalServerErrorException(fallbackMessage);
  }
}
