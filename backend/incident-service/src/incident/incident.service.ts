import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { IncidentStatus, IncidentType, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentInput } from './dto/create-incident.input';
import { UpdateIncidentInput } from './dto/update-incident.input';
import { UpdateIncidentStatusInput } from './dto/update-incident-status.input';
import { NotificationEventPublisher } from './notification-event.publisher';

export type IncidentRecord = {
  id: string;
  title: string;
  description: string | null;
  type: IncidentType;
  status: IncidentStatus;
  latitude: number;
  longitude: number;
  address: string | null;
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
export class IncidentService {
  private readonly logger = new Logger(IncidentService.name);

  constructor(
    @Inject('PrismaService')
    private readonly prisma: PrismaService,
    private readonly notificationPublisher: NotificationEventPublisher,
  ) {}

  async declareIncident(input: CreateIncidentInput): Promise<IncidentRecord> {
    try {
      const incident = await this.prisma.incident.create({
        data: {
          title: input.title.trim(),
          description: input.description?.trim() || null,
          type: input.type,
          latitude: input.latitude,
          longitude: input.longitude,
          address: input.address?.trim() || null,
        },
      });

      const record = this.toIncidentRecord(incident);
      await this.notificationPublisher.publish({
        eventType: 'INCIDENT_DECLARED',
        resourceId: record.id,
        resourceName: record.title,
        status: record.status,
      });
      return record;
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la declaration de l incident.',
      );
    }
  }

  async getIncidents(): Promise<IncidentRecord[]> {
    try {
      const incidents = await this.prisma.incident.findMany({
        orderBy: { createdAt: 'desc' },
      });

      return incidents.map((incident) => this.toIncidentRecord(incident));
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la recuperation des incidents.',
      );
    }
  }

  async getIncidentById(id: string): Promise<IncidentRecord> {
    const incident = await this.findIncidentOrThrow(id);
    return this.toIncidentRecord(incident);
  }

  async getIncidentsByStatus(
    status: IncidentStatus,
  ): Promise<IncidentRecord[]> {
    try {
      const incidents = await this.prisma.incident.findMany({
        where: { status },
        orderBy: { createdAt: 'desc' },
      });

      return incidents.map((incident) => this.toIncidentRecord(incident));
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors du filtrage des incidents par statut.',
      );
    }
  }

  async updateIncident(
    id: string,
    input: UpdateIncidentInput,
  ): Promise<IncidentRecord> {
    await this.findIncidentOrThrow(id);
    const data = this.buildUpdateData(input);

    if (Object.keys(data).length === 0) {
      throw new BadRequestException(
        'Aucun champ valide fourni pour la mise a jour de l incident.',
      );
    }

    try {
      const updated = await this.prisma.incident.update({
        where: { id },
        data,
      });

      return this.toIncidentRecord(updated);
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la mise a jour de l incident.',
      );
    }
  }

  async updateIncidentStatus(
    input: UpdateIncidentStatusInput,
  ): Promise<IncidentRecord> {
    const current = await this.findIncidentOrThrow(input.id);

    try {
      const updated = await this.prisma.incident.update({
        where: { id: input.id },
        data: { status: input.status },
      });

      const record = this.toIncidentRecord(updated);
      if (current.status !== record.status) {
        await this.notificationPublisher.publish({
          eventType: 'INCIDENT_STATUS_CHANGED',
          resourceId: record.id,
          resourceName: record.title,
          previousStatus: current.status,
          status: record.status,
        });
      }
      return record;
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors du changement de statut de l incident.',
      );
    }
  }

  async deleteIncident(id: string): Promise<boolean> {
    try {
      await this.prisma.incident.delete({ where: { id } });
      return true;
    } catch (error) {
      this.handlePrismaError(
        error,
        'Erreur lors de la suppression de l incident.',
      );
    }
  }

  private async findIncidentOrThrow(
    id: string,
  ): Promise<Prisma.IncidentGetPayload<object>> {
    try {
      const incident = await this.prisma.incident.findUnique({ where: { id } });
      if (!incident) {
        throw new NotFoundException('Incident introuvable.');
      }

      return incident;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handlePrismaError(
        error,
        'Erreur lors de la recuperation de l incident.',
      );
    }
  }

  private buildUpdateData(
    input: UpdateIncidentInput,
  ): Prisma.IncidentUpdateInput {
    const data: Prisma.IncidentUpdateInput = {};

    if (input.title !== undefined) data.title = input.title.trim();
    if (input.description !== undefined) {
      data.description = input.description.trim() || null;
    }
    if (input.type !== undefined) data.type = input.type;
    if (input.latitude !== undefined) data.latitude = input.latitude;
    if (input.longitude !== undefined) data.longitude = input.longitude;
    if (input.address !== undefined) {
      data.address = input.address.trim() || null;
    }

    return data;
  }

  private toIncidentRecord(incident: {
    id: string;
    title: string;
    description: string | null;
    type: IncidentType;
    status: IncidentStatus;
    latitude: Prisma.Decimal;
    longitude: Prisma.Decimal;
    address: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): IncidentRecord {
    return {
      id: incident.id,
      title: incident.title,
      description: incident.description,
      type: incident.type,
      status: incident.status,
      latitude: Number(incident.latitude),
      longitude: Number(incident.longitude),
      address: incident.address,
      createdAt: incident.createdAt,
      updatedAt: incident.updatedAt,
    };
  }

  private handlePrismaError(error: unknown, fallbackMessage: string): never {
    if (isPrismaErrorWithCode(error) && error.code === 'P2025') {
      throw new NotFoundException('Incident introuvable.');
    }

    const stack = error instanceof Error ? error.stack : undefined;
    this.logger.error(fallbackMessage, stack);
    throw new InternalServerErrorException(fallbackMessage);
  }
}
