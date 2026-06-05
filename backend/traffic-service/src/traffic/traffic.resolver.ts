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
import { UpdateTrafficDensityInput } from './dto/update-traffic-density.input';
import { UpdateTrafficZoneInput } from './dto/update-traffic-zone.input';
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

  @Field(() => String, { nullable: true })
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
  congestedZones(): Promise<TrafficZoneEntity[]> {
    return this.trafficService.getCongestedZones();
  }

  @Mutation(() => TrafficZoneEntity)
  createTrafficZone(
    @Args('input') input: CreateTrafficZoneInput,
  ): Promise<TrafficZoneEntity> {
    return this.trafficService.createTrafficZone(input);
  }

  @Mutation(() => TrafficZoneEntity)
  updateTrafficZone(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateTrafficZoneInput,
  ): Promise<TrafficZoneEntity> {
    return this.trafficService.updateTrafficZone(id, input);
  }

  @Mutation(() => TrafficZoneEntity)
  updateTrafficDensity(
    @Args('input') input: UpdateTrafficDensityInput,
  ): Promise<TrafficZoneEntity> {
    return this.trafficService.updateTrafficDensity(input);
  }

  @Mutation(() => Boolean)
  deleteTrafficZone(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.trafficService.deleteTrafficZone(id);
  }
}
