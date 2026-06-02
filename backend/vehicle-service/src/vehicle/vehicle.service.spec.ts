import { Test, TestingModule } from '@nestjs/testing';
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

  it('should get vehicle details by id', async () => {
    prisma.vehicle.findUnique.mockResolvedValue(vehicle);

    const result = await service.getVehicleById(vehicle.id);

    expect(result).toEqual(vehicle);
    expect(prisma.vehicle.findUnique).toHaveBeenCalledWith({
      where: { id: vehicle.id },
    });
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

  it('should delete a vehicle', async () => {
    prisma.vehicle.delete.mockResolvedValue(vehicle);

    const result = await service.deleteVehicle(vehicle.id);

    expect(result).toBe(true);
    expect(prisma.vehicle.delete).toHaveBeenCalledWith({
      where: { id: vehicle.id },
    });
  });
});
