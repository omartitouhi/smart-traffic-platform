import { Test, TestingModule } from '@nestjs/testing';
import {
    BadRequestException,
    ConflictException,
    InternalServerErrorException,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { CongestionLevel } from '../generated/prisma/client';
import { TrafficService } from './traffic.service';

type PrismaMock = {
    trafficZone: {
        create: jest.Mock;
        findMany: jest.Mock;
        findUnique: jest.Mock;
        update: jest.Mock;
        delete: jest.Mock;
    };
};

type TrafficZoneCreateCall = {
    data: {
        density: number;
        congestionLevel: CongestionLevel;
        isCongested: boolean;
    };
};

function getTrafficZoneCreateCall(prisma: PrismaMock): TrafficZoneCreateCall {
    const [call] = prisma.trafficZone.create.mock.calls.at(-1) as [
        TrafficZoneCreateCall,
    ];

    return call;
}

describe('TrafficService', () => {
    let service: TrafficService;
    let prisma: PrismaMock;

    const createdAt = new Date('2026-06-03T00:00:00.000Z');
    const updatedAt = new Date('2026-06-03T00:05:00.000Z');

    const trafficZone = {
        id: '9f1b7b62-8f40-4fb1-9d72-7d3462321f11',
        name: 'Centre Ville',
        description: 'Zone centrale',
        latitude: 36.8065,
        longitude: 10.1815,
        radius: 10,
        vehicleCount: 40,
        density: 4,
        congestionLevel: CongestionLevel.LOW,
        isCongested: false,
        createdAt,
        updatedAt,
    };

    beforeEach(async () => {
        jest.spyOn(Logger.prototype, 'error').mockImplementation();

        prisma = {
            trafficZone: {
                create: jest.fn(),
                findMany: jest.fn(),
                findUnique: jest.fn(),
                update: jest.fn(),
                delete: jest.fn(),
            },
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TrafficService,
                {
                    provide: 'PrismaService',
                    useValue: prisma,
                },
            ],
        }).compile();

        service = module.get<TrafficService>(TrafficService);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create a traffic zone', async () => {
        prisma.trafficZone.create.mockResolvedValue(trafficZone);

        const result = await service.createTrafficZone({
            name: ' Centre Ville ',
            description: ' Zone centrale ',
            latitude: 36.8065,
            longitude: 10.1815,
            radius: 10,
            vehicleCount: 40,
        });

        expect(result).toEqual(trafficZone);
        expect(prisma.trafficZone.create).toHaveBeenCalledWith({
            data: {
                name: 'Centre Ville',
                description: 'Zone centrale',
                latitude: 36.8065,
                longitude: 10.1815,
                radius: 10,
                vehicleCount: 40,
                density: 4,
                congestionLevel: CongestionLevel.LOW,
                isCongested: false,
            },
        });
    });

    it('should get traffic zones list', async () => {
        prisma.trafficZone.findMany.mockResolvedValue([trafficZone]);

        const result = await service.getTrafficZones();

        expect(result).toEqual([trafficZone]);
        expect(prisma.trafficZone.findMany).toHaveBeenCalledWith({
            orderBy: { createdAt: 'desc' },
            take: 50,
            skip: 0,
        });
    });

    it('should get traffic zone details by id', async () => {
        prisma.trafficZone.findUnique.mockResolvedValue(trafficZone);

        const result = await service.getTrafficZoneById(trafficZone.id);

        expect(result).toEqual(trafficZone);
        expect(prisma.trafficZone.findUnique).toHaveBeenCalledWith({
            where: { id: trafficZone.id },
        });
    });

    it('should throw NotFoundException when traffic zone does not exist', async () => {
        prisma.trafficZone.findUnique.mockResolvedValue(null);

        await expect(
            service.getTrafficZoneById(trafficZone.id),
        ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should update a traffic zone and recalculate density when radius changes', async () => {
        const updatedZone = {
            ...trafficZone,
            name: 'Nouvelle Zone',
            radius: 5,
            density: 8,
            congestionLevel: CongestionLevel.MEDIUM,
            isCongested: false,
        };
        prisma.trafficZone.findUnique.mockResolvedValue(trafficZone);
        prisma.trafficZone.update.mockResolvedValue(updatedZone);

        const result = await service.updateTrafficZone(trafficZone.id, {
            name: ' Nouvelle Zone ',
            radius: 5,
        });

        expect(result).toEqual(updatedZone);
        expect(prisma.trafficZone.update).toHaveBeenCalledWith({
            where: { id: trafficZone.id },
            data: {
                name: 'Nouvelle Zone',
                radius: 5,
                density: 8,
                congestionLevel: CongestionLevel.MEDIUM,
                isCongested: false,
            },
        });
    });

    it('should update traffic density', async () => {
        const updatedZone = {
            ...trafficZone,
            vehicleCount: 160,
            density: 16,
            congestionLevel: CongestionLevel.HIGH,
            isCongested: true,
        };
        prisma.trafficZone.findUnique.mockResolvedValue(trafficZone);
        prisma.trafficZone.update.mockResolvedValue(updatedZone);

        const result = await service.updateTrafficDensity({
            zoneId: trafficZone.id,
            vehicleCount: 160,
        });

        expect(result).toEqual(updatedZone);
        expect(prisma.trafficZone.update).toHaveBeenCalledWith({
            where: { id: trafficZone.id },
            data: {
                vehicleCount: 160,
                density: 16,
                congestionLevel: CongestionLevel.HIGH,
                isCongested: true,
            },
        });
    });

    it('should get congested zones', async () => {
        const congestedZone = {
            ...trafficZone,
            density: 20,
            congestionLevel: CongestionLevel.HIGH,
            isCongested: true,
        };
        prisma.trafficZone.findMany.mockResolvedValue([congestedZone]);

        const result = await service.getCongestedZones();

        expect(result).toEqual([congestedZone]);
        expect(prisma.trafficZone.findMany).toHaveBeenCalledWith({
            where: { isCongested: true },
            orderBy: [{ density: 'desc' }, { createdAt: 'desc' }],
        });
    });

    it('should delete a traffic zone', async () => {
        prisma.trafficZone.delete.mockResolvedValue(trafficZone);

        const result = await service.deleteTrafficZone(trafficZone.id);

        expect(result).toBe(true);
        expect(prisma.trafficZone.delete).toHaveBeenCalledWith({
            where: { id: trafficZone.id },
        });
    });

    it('should classify LOW when density is lower than 5', async () => {
        prisma.trafficZone.create.mockResolvedValue({
            ...trafficZone,
            density: 4.99,
            congestionLevel: CongestionLevel.LOW,
            isCongested: false,
        });

        await service.createTrafficZone({
            name: 'Low Zone',
            latitude: 36.8065,
            longitude: 10.1815,
            radius: 10,
            vehicleCount: 49.9,
        });

        expect(getTrafficZoneCreateCall(prisma).data).toMatchObject({
            density: 4.99,
            congestionLevel: CongestionLevel.LOW,
            isCongested: false,
        });
    });

    it('should classify MEDIUM when density is between 5 and 15', async () => {
        prisma.trafficZone.create.mockResolvedValue({
            ...trafficZone,
            density: 15,
            congestionLevel: CongestionLevel.MEDIUM,
            isCongested: false,
        });

        await service.createTrafficZone({
            name: 'Medium Zone',
            latitude: 36.8065,
            longitude: 10.1815,
            radius: 10,
            vehicleCount: 150,
        });

        expect(getTrafficZoneCreateCall(prisma).data).toMatchObject({
            density: 15,
            congestionLevel: CongestionLevel.MEDIUM,
            isCongested: false,
        });
    });

    it('should classify HIGH and mark zone as congested when density is higher than 15', async () => {
        prisma.trafficZone.create.mockResolvedValue({
            ...trafficZone,
            density: 15.01,
            congestionLevel: CongestionLevel.HIGH,
            isCongested: true,
        });

        await service.createTrafficZone({
            name: 'High Zone',
            latitude: 36.8065,
            longitude: 10.1815,
            radius: 10,
            vehicleCount: 150.1,
        });

        expect(getTrafficZoneCreateCall(prisma).data).toMatchObject({
            density: 15.01,
            congestionLevel: CongestionLevel.HIGH,
            isCongested: true,
        });
    });

    it('should throw BadRequestException when radius is invalid', async () => {
        await expect(
            service.createTrafficZone({
                name: 'Invalid Zone',
                latitude: 36.8065,
                longitude: 10.1815,
                radius: 0,
                vehicleCount: 10,
            }),
        ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException when update has no fields', async () => {
        prisma.trafficZone.findUnique.mockResolvedValue(trafficZone);

        await expect(
            service.updateTrafficZone(trafficZone.id, {}),
        ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw ConflictException when traffic zone name already exists', async () => {
        prisma.trafficZone.create.mockRejectedValue({ code: 'P2002' });

        await expect(
            service.createTrafficZone({
                name: 'Centre Ville',
                latitude: 36.8065,
                longitude: 10.1815,
                radius: 10,
                vehicleCount: 40,
            }),
        ).rejects.toBeInstanceOf(ConflictException);
    });

    it('should throw NotFoundException when deleting a missing traffic zone', async () => {
        prisma.trafficZone.delete.mockRejectedValue({ code: 'P2025' });

        await expect(
            service.deleteTrafficZone(trafficZone.id),
        ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should map unknown prisma errors to InternalServerErrorException', async () => {
        prisma.trafficZone.findMany.mockRejectedValue(new Error('database down'));

        await expect(service.getTrafficZones()).rejects.toBeInstanceOf(
            InternalServerErrorException,
        );
    });
});
