import {
  Args,
  Field,
  Float,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  registerEnumType,
  Resolver,
} from '@nestjs/graphql';
import { CongestionLevel } from '../generated/prisma/client';
import { CreateTrafficZoneInput } from './dto/create-traffic-zone.input';
import { MeasureTrafficDensityInput } from './dto/measure-traffic-density.input';
import { TrafficService } from './traffic.service';

registerEnumType(CongestionLevel, {
  name: 'CongestionLevel',
  description: 'Niveau de congestion calcule pour une zone de circulation.',
});

@ObjectType()
class TrafficZoneEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field({ nullable: true })
  description?: string | null;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;

  @Field(() => Float)
  radius!: number;

  @Field(() => Int)
  vehicleCount!: number;

  @Field(() => Float)
  density!: number;

  @Field(() => CongestionLevel)
  congestionLevel!: CongestionLevel;

  @Field()
  isCongested!: boolean;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@Resolver(() => TrafficZoneEntity)
export class TrafficResolver {
  constructor(private readonly trafficService: TrafficService) {}

  @Query(() => [TrafficZoneEntity])
  trafficZones(): Promise<TrafficZoneEntity[]> {
    return this.trafficService.getTrafficZones();
  }

  @Query(() => TrafficZoneEntity)
  trafficZone(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<TrafficZoneEntity> {
    return this.trafficService.getTrafficZoneById(id);
  }

  @Query(() => [TrafficZoneEntity])
  congestedTrafficZones(): Promise<TrafficZoneEntity[]> {
    return this.trafficService.getCongestedTrafficZones();
  }

  @Mutation(() => TrafficZoneEntity)
  createTrafficZone(
    @Args('input') input: CreateTrafficZoneInput,
  ): Promise<TrafficZoneEntity> {
    return this.trafficService.createTrafficZone(input);
  }

  @Mutation(() => TrafficZoneEntity)
  measureTrafficDensity(
    @Args('input') input: MeasureTrafficDensityInput,
  ): Promise<TrafficZoneEntity> {
    return this.trafficService.measureTrafficDensity(input);
  }
}
