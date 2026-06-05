import { Test, TestingModule } from '@nestjs/testing';
import { CongestionLevel } from '../generated/prisma/client';
import { TrafficResolver } from './traffic.resolver';
import { TrafficService } from './traffic.service';

describe('TrafficResolver', () => {
  let resolver: TrafficResolver;
  let trafficService: Pick<TrafficService, 'measureTrafficDensity'>;

  const updatedZone = {
    id: '9f1b7b62-8f40-4fb1-9d72-7d3462321f11',
    name: 'Centre Ville',
    description: 'Zone centrale',
    latitude: 36.8065,
    longitude: 10.1815,
    radius: 10,
    vehicleCount: 160,
    density: 16,
    congestionLevel: CongestionLevel.HIGH,
    isCongested: true,
    createdAt: new Date('2026-06-03T00:00:00.000Z'),
    updatedAt: new Date('2026-06-03T00:05:00.000Z'),
  };

  beforeEach(async () => {
    trafficService = {
      measureTrafficDensity: jest.fn().mockResolvedValue(updatedZone),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficResolver,
        {
          provide: TrafficService,
          useValue: trafficService,
        },
      ],
    }).compile();

    resolver = module.get<TrafficResolver>(TrafficResolver);
  });

  it('exposes measureTrafficDensity and delegates to TrafficService', async () => {
    const input = {
      zoneId: updatedZone.id,
      vehicleCount: updatedZone.vehicleCount,
    };

    const result = await resolver.measureTrafficDensity(input);

    expect(trafficService.measureTrafficDensity).toHaveBeenCalledWith(input);
    expect(result).toEqual(updatedZone);
  });
});
