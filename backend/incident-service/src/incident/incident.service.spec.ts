import {
  BadRequestException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IncidentStatus, IncidentType } from '@prisma/client';
import { IncidentService } from './incident.service';
import { NotificationEventPublisher } from './notification-event.publisher';

type PrismaMock = {
  incident: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
};

describe('IncidentService', () => {
  let service: IncidentService;
  let prisma: PrismaMock;
  let notificationPublisher: Pick<NotificationEventPublisher, 'publish'>;

  const createdAt = new Date('2026-06-05T10:00:00.000Z');
  const updatedAt = new Date('2026-06-05T10:05:00.000Z');

  const incident = {
    id: '9f1b7b62-8f40-4fb1-9d72-7d3462321f11',
    title: 'Accident sur autoroute A1',
    description: 'Collision a hauteur de la sortie 12',
    type: IncidentType.ACCIDENT,
    status: IncidentStatus.SIGNALE,
    latitude: 36.8065,
    longitude: 10.1815,
    address: 'Autoroute A1, sortie 12',
    createdAt,
    updatedAt,
  };

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();

    prisma = {
      incident: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    notificationPublisher = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentService,
        {
          provide: NotificationEventPublisher,
          useValue: notificationPublisher,
        },
        {
          provide: 'PrismaService',
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<IncidentService>(IncidentService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should declare an incident with default status SIGNALE', async () => {
    prisma.incident.create.mockResolvedValue(incident);

    const result = await service.declareIncident({
      title: ' Accident sur autoroute A1 ',
      description: ' Collision a hauteur de la sortie 12 ',
      type: IncidentType.ACCIDENT,
      latitude: 36.8065,
      longitude: 10.1815,
      address: ' Autoroute A1, sortie 12 ',
    });

    expect(result).toEqual(incident);
    expect(prisma.incident.create).toHaveBeenCalledWith({
      data: {
        title: 'Accident sur autoroute A1',
        description: 'Collision a hauteur de la sortie 12',
        type: IncidentType.ACCIDENT,
        latitude: 36.8065,
        longitude: 10.1815,
        address: 'Autoroute A1, sortie 12',
      },
    });
    expect(notificationPublisher.publish).toHaveBeenCalledWith({
      eventType: 'INCIDENT_DECLARED',
      resourceId: incident.id,
      resourceName: incident.title,
      status: IncidentStatus.SIGNALE,
    });
  });

  it('should declare an incident without optional fields', async () => {
    const minimalIncident = {
      ...incident,
      description: null,
      address: null,
    };
    prisma.incident.create.mockResolvedValue(minimalIncident);

    const result = await service.declareIncident({
      title: 'Travaux ponctuels',
      type: IncidentType.TRAVAUX,
      latitude: 36.8065,
      longitude: 10.1815,
    });

    expect(result.description).toBeNull();
    expect(result.address).toBeNull();
    expect(prisma.incident.create).toHaveBeenCalledWith({
      data: {
        title: 'Travaux ponctuels',
        description: null,
        type: IncidentType.TRAVAUX,
        latitude: 36.8065,
        longitude: 10.1815,
        address: null,
      },
    });
  });

  it('should get all incidents ordered by createdAt desc', async () => {
    prisma.incident.findMany.mockResolvedValue([incident]);

    const result = await service.getIncidents();

    expect(result).toEqual([incident]);
    expect(prisma.incident.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should get an incident by id', async () => {
    prisma.incident.findUnique.mockResolvedValue(incident);

    const result = await service.getIncidentById(incident.id);

    expect(result).toEqual(incident);
    expect(prisma.incident.findUnique).toHaveBeenCalledWith({
      where: { id: incident.id },
    });
  });

  it('should throw NotFoundException when incident is missing', async () => {
    prisma.incident.findUnique.mockResolvedValue(null);

    await expect(service.getIncidentById(incident.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should filter incidents by status', async () => {
    prisma.incident.findMany.mockResolvedValue([incident]);

    const result = await service.getIncidentsByStatus(IncidentStatus.SIGNALE);

    expect(result).toEqual([incident]);
    expect(prisma.incident.findMany).toHaveBeenCalledWith({
      where: { status: IncidentStatus.SIGNALE },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should update incident status and publish a status change event', async () => {
    const updated = { ...incident, status: IncidentStatus.EN_COURS };
    prisma.incident.findUnique.mockResolvedValue(incident);
    prisma.incident.update.mockResolvedValue(updated);

    const result = await service.updateIncidentStatus({
      id: incident.id,
      status: IncidentStatus.EN_COURS,
    });

    expect(result.status).toBe(IncidentStatus.EN_COURS);
    expect(prisma.incident.update).toHaveBeenCalledWith({
      where: { id: incident.id },
      data: { status: IncidentStatus.EN_COURS },
    });
    expect(notificationPublisher.publish).toHaveBeenCalledWith({
      eventType: 'INCIDENT_STATUS_CHANGED',
      resourceId: incident.id,
      resourceName: incident.title,
      previousStatus: IncidentStatus.SIGNALE,
      status: IncidentStatus.EN_COURS,
    });
  });

  it('should not publish an event when the status is unchanged', async () => {
    prisma.incident.findUnique.mockResolvedValue(incident);
    prisma.incident.update.mockResolvedValue(incident);

    await service.updateIncidentStatus({
      id: incident.id,
      status: IncidentStatus.SIGNALE,
    });

    expect(notificationPublisher.publish).not.toHaveBeenCalled();
  });

  it('should update non-status fields of an incident', async () => {
    const updated = {
      ...incident,
      title: 'Nouveau titre',
      type: IncidentType.EMBOUTEILLAGE,
    };
    prisma.incident.findUnique.mockResolvedValue(incident);
    prisma.incident.update.mockResolvedValue(updated);

    const result = await service.updateIncident(incident.id, {
      title: ' Nouveau titre ',
      type: IncidentType.EMBOUTEILLAGE,
    });

    expect(result.title).toBe('Nouveau titre');
    expect(result.type).toBe(IncidentType.EMBOUTEILLAGE);
    expect(prisma.incident.update).toHaveBeenCalledWith({
      where: { id: incident.id },
      data: {
        title: 'Nouveau titre',
        type: IncidentType.EMBOUTEILLAGE,
      },
    });
  });

  it('should throw BadRequestException when update has no fields', async () => {
    prisma.incident.findUnique.mockResolvedValue(incident);

    await expect(
      service.updateIncident(incident.id, {}),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('should delete an incident', async () => {
    prisma.incident.delete.mockResolvedValue(incident);

    const result = await service.deleteIncident(incident.id);

    expect(result).toBe(true);
    expect(prisma.incident.delete).toHaveBeenCalledWith({
      where: { id: incident.id },
    });
  });

  it('should map P2025 to NotFoundException when deleting a missing incident', async () => {
    prisma.incident.delete.mockRejectedValue({ code: 'P2025' });

    await expect(service.deleteIncident(incident.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should map unknown prisma errors to InternalServerErrorException', async () => {
    prisma.incident.findMany.mockRejectedValue(new Error('db down'));

    await expect(service.getIncidents()).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
