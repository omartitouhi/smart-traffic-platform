import {
  Args,
  Field,
  Float,
  ID,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Roles } from '../common/auth/decorators/roles.decorator';
import { GqlJwtAuthGuard } from '../common/auth/guards/gql-jwt-auth.guard';
import { RolesGuard } from '../common/auth/guards/roles.guard';
import { Role } from '../common/enums/role.enum';
import { AddVehiclePositionInput } from './dto/add-vehicle-position.input';
import { CreateVehicleInput } from './dto/create-vehicle.input';
import { UpdateVehicleInput } from './dto/update-vehicle.input';
import { VehicleService } from './vehicle.service';

@ObjectType()
class VehicleEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  matricule!: string;

  @Field()
  brand!: string;

  @Field()
  model!: string;

  @Field()
  type!: string;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
class VehiclePositionEntity {
  @Field(() => ID)
  id!: string;

  @Field(() => ID)
  vehicleId!: string;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;

  @Field(() => Float)
  speed!: number;

  @Field()
  recordedAt!: Date;
}

@Resolver(() => VehicleEntity)
@UseGuards(GqlJwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.OPERATOR)
export class VehicleResolver {
  constructor(private readonly vehicleService: VehicleService) {}

  @Query(() => [VehicleEntity])
  vehicles(): Promise<VehicleEntity[]> {
    return this.vehicleService.getVehicles();
  }

  @Query(() => VehicleEntity)
  vehicle(@Args('id', { type: () => ID }) id: string): Promise<VehicleEntity> {
    return this.vehicleService.getVehicleById(id);
  }

  @Query(() => [VehiclePositionEntity])
  vehiclePositions(
    @Args('vehicleId', { type: () => ID }) vehicleId: string,
  ): Promise<VehiclePositionEntity[]> {
    return this.vehicleService.getPositionHistory(vehicleId);
  }

  @Query(() => Int)
  vehiclePositionCount(): Promise<number> {
    return this.vehicleService.getVehiclePositionCount();
  }

  @Mutation(() => VehicleEntity)
  createVehicle(
    @Args('input') input: CreateVehicleInput,
  ): Promise<VehicleEntity> {
    return this.vehicleService.createVehicle(input);
  }

  @Mutation(() => VehicleEntity)
  updateVehicle(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateVehicleInput,
  ): Promise<VehicleEntity> {
    return this.vehicleService.updateVehicle(id, input);
  }

  @Mutation(() => Boolean)
  deleteVehicle(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.vehicleService.deleteVehicle(id);
  }

  @Mutation(() => VehiclePositionEntity)
  addVehiclePosition(
    @Args('input') input: AddVehiclePositionInput,
  ): Promise<VehiclePositionEntity> {
    return this.vehicleService.addPosition(input);
  }

  @Mutation(() => VehiclePositionEntity)
  simulateVehiclePosition(
    @Args('vehicleId', { type: () => ID }) vehicleId: string,
  ): Promise<VehiclePositionEntity> {
    return this.vehicleService.simulateVehiclePosition(vehicleId);
  }
}
