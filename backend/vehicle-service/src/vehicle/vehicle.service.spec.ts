import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { VehicleService } from './vehicle.service';

type PrismaMock = {
  vehicle: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };
  vehiclePosition: {
    create: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
  };
};

type VehiclePositionCreateArgs = {
  data: {
    vehicleId: string;
    latitude: number;
    longitude: number;
    speed: number;
  };
};

describe('VehicleService', () => {
  let service: VehicleService;
  let prisma: PrismaMock;

  const createdAt = new Date('2026-06-02T00:00:00.000Z');
  const updatedAt = new Date('2026-06-02T00:05:00.000Z');
  const recordedAt = new Date('2026-06-02T00:10:00.000Z');

  const vehicle = {
    id: '9f1b7b62-8f40-4fb1-9d72-7d3462321f11',
    matricule: 'TN-1234',
    brand: 'Toyota',
    model: 'Corolla',
    type: 'SEDAN',
    status: 'ACTIVE',
    createdAt,
    updatedAt,
  };

  const position = {
    id: '91f7dfd0-1a59-4a53-9c6f-6299fc8caa91',
    vehicleId: vehicle.id,
    latitude: 36.8065,
    longitude: 10.1815,
    speed: 45.5,
    recordedAt,
  };

  beforeEach(async () => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation();

    prisma = {
      vehicle: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      vehiclePosition: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehicleService,
        {
          provide: 'PrismaService',
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create a vehicle', async () => {
    prisma.vehicle.create.mockResolvedValue(vehicle);

    const result = await service.createVehicle({
      matricule: ' tn-1234 ',
      brand: ' Toyota ',
      model: ' Corolla ',
      type: ' SEDAN ',
      status: ' ACTIVE ',
    });

    expect(result).toEqual(vehicle);
    expect(prisma.vehicle.create).toHaveBeenCalledWith({
      data: {
        matricule: 'TN-1234',
        brand: 'Toyota',
        model: 'Corolla',
        type: 'SEDAN',
        status: 'ACTIVE',
      },
    });
  });

  it('should get vehicles list', async () => {
    prisma.vehicle.findMany.mockResolvedValue([vehicle]);

    const result = await service.getVehicles();

    expect(result).toEqual([vehicle]);
    expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      take: 50,
      skip: 0,
    });
  });

  it('should clamp pagination when getting vehicles list', async () => {
    prisma.vehicle.findMany.mockResolvedValue([vehicle]);

    await service.getVehicles(1000, -10);

    expect(prisma.vehicle.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
      take: 100,
      skip: 0,
    });
  });

  it('should get vehicle details by id', async () => {
    prisma.vehicle.findUnique.mockResolvedValue(vehicle);

    const result = await service.getVehicleById(vehicle.id);

    expect(result).toEqual(vehicle);
    expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
      where: { id: vehicle.id },
    });
  });

  it('should throw NotFoundException when vehicle detail does not exist', async () => {
    prisma.vehicle.findUnique.mockResolvedValue(null);

    await expect(service.getVehicleById(vehicle.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should update a vehicle', async () => {
    const updatedVehicle = {
      ...vehicle,
      matricule: 'TN-5678',
      brand: 'Honda',
    };
    prisma.vehicle.update.mockResolvedValue(updatedVehicle);

    const result = await service.updateVehicle(vehicle.id, {
      matricule: ' tn-5678 ',
      brand: ' Honda ',
    });

    expect(result).toEqual(updatedVehicle);
    expect(prisma.vehicle.update).toHaveBeenCalledWith({
      where: { id: vehicle.id },
      data: {
        matricule: 'TN-5678',
        brand: 'Honda',
      },
    });
  });

  it('should throw BadRequestException when update has no fields', async () => {
    await expect(service.updateVehicle(vehicle.id, {})).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('should throw ConflictException when vehicle matricule already exists', async () => {
    prisma.vehicle.create.mockRejectedValue({ code: 'P2002' });

    await expect(
      service.createVehicle({
        matricule: 'TN-1234',
        brand: 'Toyota',
        model: 'Corolla',
        type: 'SEDAN',
        status: 'ACTIVE',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('should add a GPS position', async () => {
    prisma.vehicle.findUnique.mockResolvedValue(vehicle);
    prisma.vehiclePosition.create.mockResolvedValue(position);

    const result = await service.addPosition({
      vehicleId: vehicle.id,
      latitude: position.latitude,
      longitude: position.longitude,
      speed: position.speed,
    });

    expect(result).toEqual(position);
    expect(prisma.vehiclePosition.create).toHaveBeenCalledWith({
      data: {
        vehicleId: vehicle.id,
        latitude: position.latitude,
        longitude: position.longitude,
        speed: position.speed,
      },
    });
  });

  it('should throw NotFoundException when adding a position for a missing vehicle', async () => {
    prisma.vehicle.findUnique.mockResolvedValue(null);

    await expect(
      service.addPosition({
        vehicleId: vehicle.id,
        latitude: position.latitude,
        longitude: position.longitude,
        speed: position.speed,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('should simulate a GPS position within Grand Tunis bounds', async () => {
    jest
      .spyOn(Math, 'random')
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5);
    prisma.vehicle.findUnique.mockResolvedValue(vehicle);
    prisma.vehiclePosition.create.mockResolvedValue(position);

    const result = await service.simulateVehiclePosition(vehicle.id);

    expect(result).toEqual(position);
    const createCalls = prisma.vehiclePosition.create.mock.calls as [
      VehiclePositionCreateArgs,
    ][];
    const createCall = createCalls[0][0].data;
    expect(createCall.vehicleId).toBe(vehicle.id);
    // latitude doit etre dans la zone du Grand Tunis
    expect(createCall.latitude).toBeGreaterThanOrEqual(36.7);
    expect(createCall.latitude).toBeLessThanOrEqual(36.95);
    // longitude doit etre dans la zone du Grand Tunis
    expect(createCall.longitude).toBeGreaterThanOrEqual(10.05);
    expect(createCall.longitude).toBeLessThanOrEqual(10.35);
    // valeurs exactes avec Math.random() = 0.5
    expect(createCall.latitude).toBeCloseTo(36.825, 3);
    expect(createCall.longitude).toBeCloseTo(10.2, 3);
    expect(createCall.speed).toBe(150);
  });

  it('should get GPS position history', async () => {
    prisma.vehicle.findUnique.mockResolvedValue(vehicle);
    prisma.vehiclePosition.findMany.mockResolvedValue([position]);

    const result = await service.getPositionHistory(vehicle.id);

    expect(result).toEqual([position]);
    expect(prisma.vehiclePosition.findMany).toHaveBeenCalledWith({
      where: { vehicleId: vehicle.id },
      orderBy: { recordedAt: 'desc' },
      take: 100,
      skip: 0,
    });
  });

  it('should count GPS positions', async () => {
    prisma.vehiclePosition.count.mockResolvedValue(12);

    const result = await service.getVehiclePositionCount();

    expect(result).toBe(12);
    expect(prisma.vehiclePosition.count).toHaveBeenCalledWith();
  });

  it('should delete a vehicle', async () => {
    prisma.vehicle.delete.mockResolvedValue(vehicle);

    const result = await service.deleteVehicle(vehicle.id);

    expect(result).toBe(true);
    expect(prisma.vehicle.delete).toHaveBeenCalledWith({
      where: { id: vehicle.id },
    });
  });

  it('should throw NotFoundException when deleting a missing vehicle', async () => {
    prisma.vehicle.delete.mockRejectedValue({ code: 'P2025' });

    await expect(service.deleteVehicle(vehicle.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should map unknown prisma errors to InternalServerErrorException', async () => {
    prisma.vehicle.findMany.mockRejectedValue(new Error('database down'));

    await expect(service.getVehicles()).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
