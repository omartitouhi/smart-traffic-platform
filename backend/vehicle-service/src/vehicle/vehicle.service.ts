import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AddVehiclePositionInput } from './dto/add-vehicle-position.input';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';

type PrismaError = Error & {
  code?: string;
  meta?: Record<string, unknown>;
};

type VehicleRecord = {
  id: string;
  matricule: string;
  brand: string;
  model: string;
  type: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
};

type VehiclePositionRecord = {
  id: string;
  vehicleId: string;
  latitude: number;
  longitude: number;
  speed: number;
  recordedAt: Date;
};

type VehiclePrismaClient = {
  vehicle: {
    create(args: unknown): Promise<VehicleRecord>;
    findMany(args: unknown): Promise<VehicleRecord[]>;
    findUnique(args: unknown): Promise<VehicleRecord | null>;
    update(args: unknown): Promise<VehicleRecord>;
    delete(args: unknown): Promise<VehicleRecord>;
  };
  vehiclePosition: {
    create(args: unknown): Promise<Record<string, unknown>>;
    findMany(args: unknown): Promise<Record<string, unknown>[]>;
  };
};

@Injectable()
export class VehicleService {
  private readonly logger = new Logger(VehicleService.name);

  constructor(
    @Inject('PrismaService')
    private readonly prisma: VehiclePrismaClient,
  ) {}

  async createVehicle(input: CreateVehicleInput): Promise<VehicleRecord> {
    try {
      return await this.prisma.vehicle.create({
        data: {
          matricule: this.normalizeMatricule(input.matricule),
          brand: input.brand.trim(),
          model: input.model.trim(),
          type: input.type.trim(),
          status: input.status.trim(),
        },
      });
    } catch (error) {
      this.handlePrismaError(error, 'Erreur lors de la creation du vehicule.');
    }
  }

  async getVehicles(take = 50, skip = 0): Promise<VehicleRecord[]> {
    const safeTake = this.clamp(take, 1, 100);
    const safeSkip = Math.max(skip, 0);

    try {
      return await this.prisma.vehicle.findMany({
        orderBy: { createdAt: 'desc' },
        take: safeTake,
        skip: safeSkip,
      });
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la recuperation des vehicules.',
      );
    }
  }

  async getVehicleById(id: string): Promise<VehicleRecord> {
    const vehicle = await this.findVehicleOrThrow(id);
    return vehicle;
  }

  async updateVehicle(
    id: string,
    input: UpdateVehicleInput,
  ): Promise<VehicleRecord> {
    const data = this.buildUpdateData(input);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'Aucun champ valide fourni pour la mise a jour.',
      );
    }

    try {
      return await this.prisma.vehicle.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la mise a jour du vehicule.',
      );
    }
  }

  async deleteVehicle(id: string): Promise<boolean> {
    try {
      await this.prisma.vehicle.delete({ where: { id } });
      return true;
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la suppression du vehicule.',
      );
    }
  }

  async addPosition(
    input: AddVehiclePositionInput,
  ): Promise<VehiclePositionRecord> {
    await this.findVehicleOrThrow(input.vehicleId);

    try {
      const position = await this.prisma.vehiclePosition.create({
        data: {
          vehicleId: input.vehicleId,
          latitude: input.latitude,
          longitude: input.longitude,
          speed: input.speed,
        },
      });

      return this.toVehiclePositionRecord(position);
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de l ajout de la position du vehicule.',
      );
    }
  }

  async simulateVehiclePosition(
    vehicleId: string,
  ): Promise<VehiclePositionRecord> {
    await this.findVehicleOrThrow(vehicleId);

    try {
      const position = await this.prisma.vehiclePosition.create({
        data: {
          vehicleId,
          latitude: this.randomDecimal(-90, 90, 6),
          longitude: this.randomDecimal(-180, 180, 6),
          speed: this.randomDecimal(0, 300, 2),
        },
      });

      return this.toVehiclePositionRecord(position);
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la simulation de la position du vehicule.',
      );
    }
  }

  async getPositionHistory(
    vehicleId: string,
    take = 100,
    skip = 0,
  ): Promise<VehiclePositionRecord[]> {
    await this.findVehicleOrThrow(vehicleId);

    const safeTake = this.clamp(take, 1, 500);
    const safeSkip = Math.max(skip, 0);

    try {
      const positions = await this.prisma.vehiclePosition.findMany({
        where: { vehicleId },
        orderBy: { recordedAt: 'desc' },
        take: safeTake,
        skip: safeSkip,
      });

      return positions.map((position) =>
        this.toVehiclePositionRecord(position),
      );
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la recuperation de l historique des positions.',
      );
    }
  }

  private async findVehicleOrThrow(id: string): Promise<VehicleRecord> {
    try {
      const vehicle = await this.prisma.vehicle.findUnique({ where: { id } });
      if (!vehicle) {
        throw new NotFoundException('Vehicule introuvable.');
      }

      return vehicle;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handlePrismaError(
        error,
        'Erreur lors de la recuperation du vehicule.',
      );
    }
  }

  private buildUpdateData(input: UpdateVehicleInput): Partial<VehicleRecord> {
    const data: Partial<VehicleRecord> = {};

    if (input.matricule !== undefined) {
      data.matricule = this.normalizeMatricule(input.matricule);
    }
    if (input.brand !== undefined) data.brand = input.brand.trim();
    if (input.model !== undefined) data.model = input.model.trim();
    if (input.type !== undefined) data.type = input.type.trim();
    if (input.status !== undefined) data.status = input.status.trim();

    return data;
  }

  private normalizeMatricule(matricule: string): string {
    return matricule.trim().toUpperCase();
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  private randomDecimal(min: number, max: number, precision: number): number {
    const value = Math.random() * (max - min) + min;
    return Number(value.toFixed(precision));
  }

  private toVehiclePositionRecord(
    position: Record<string, unknown>,
  ): VehiclePositionRecord {
    return {
      id: String(position.id),
      vehicleId: String(position.vehicleId),
      latitude: Number(position.latitude),
      longitude: Number(position.longitude),
      speed: Number(position.speed),
      recordedAt: position.recordedAt as Date,
    };
  }

  private handlePrismaError(error: unknown, fallbackMessage: string): never {
    const prismaError = error as PrismaError;

    if (prismaError.code === 'P2002') {
      throw new ConflictException('Un vehicule avec ce matricule existe deja.');
    }

    if (prismaError.code === 'P2025') {
      throw new NotFoundException('Vehicule introuvable.');
    }

    this.logger.error(fallbackMessage, prismaError.stack);
    throw new InternalServerErrorException(fallbackMessage);
  }
}
