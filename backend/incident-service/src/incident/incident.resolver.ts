import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IncidentStatus } from '@prisma/client';
import { CreateIncidentInput } from './dto/create-incident.input';
import { UpdateIncidentInput } from './dto/update-incident.input';
import { UpdateIncidentStatusInput } from './dto/update-incident-status.input';
import { IncidentEntity } from './entities/incident.entity';
import { IncidentService } from './incident.service';

@Resolver(() => IncidentEntity)
export class IncidentResolver {
  constructor(private readonly incidentService: IncidentService) {}

  @Query(() => [IncidentEntity])
  incidents(): Promise<IncidentEntity[]> {
    return this.incidentService.getIncidents();
  }

  @Query(() => IncidentEntity)
  incident(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<IncidentEntity> {
    return this.incidentService.getIncidentById(id);
  }

  @Query(() => [IncidentEntity])
  incidentsByStatus(
    @Args('status', { type: () => IncidentStatus }) status: IncidentStatus,
  ): Promise<IncidentEntity[]> {
    return this.incidentService.getIncidentsByStatus(status);
  }

  @Mutation(() => IncidentEntity)
  declareIncident(
    @Args('input') input: CreateIncidentInput,
  ): Promise<IncidentEntity> {
    return this.incidentService.declareIncident(input);
  }

  @Mutation(() => IncidentEntity)
  updateIncident(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateIncidentInput,
  ): Promise<IncidentEntity> {
    return this.incidentService.updateIncident(id, input);
  }

  @Mutation(() => IncidentEntity)
  updateIncidentStatus(
    @Args('input') input: UpdateIncidentStatusInput,
  ): Promise<IncidentEntity> {
    return this.incidentService.updateIncidentStatus(input);
  }

  @Mutation(() => Boolean)
  deleteIncident(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.incidentService.deleteIncident(id);
  }
}
