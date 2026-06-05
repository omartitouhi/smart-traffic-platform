import { Field, Float, ID, InputType, registerEnumType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export enum DomainNotificationEventType {
  INCIDENT_DECLARED = 'INCIDENT_DECLARED',
  INCIDENT_STATUS_CHANGED = 'INCIDENT_STATUS_CHANGED',
  TRAFFIC_ZONE_HIGH = 'TRAFFIC_ZONE_HIGH',
  VEHICLE_IN_CONGESTED_ZONE = 'VEHICLE_IN_CONGESTED_ZONE',
}

registerEnumType(DomainNotificationEventType, {
  name: 'DomainNotificationEventType',
  description: 'Evenement metier transforme en notification.',
});

@InputType()
export class CreateDomainNotificationEventInput {
  @Field(() => DomainNotificationEventType)
  @IsEnum(DomainNotificationEventType, {
    message: 'Le type d evenement notification est invalide.',
  })
  eventType!: DomainNotificationEventType;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4', {
    message: 'L identifiant utilisateur doit etre un UUID valide.',
  })
  userId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsString({ message: 'L identifiant de ressource doit etre une chaine.' })
  @MaxLength(120, {
    message: 'L identifiant de ressource ne doit pas depasser 120 caracteres.',
  })
  resourceId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Le nom de ressource doit etre une chaine.' })
  @MaxLength(120, {
    message: 'Le nom de ressource ne doit pas depasser 120 caracteres.',
  })
  resourceName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Le statut precedent doit etre une chaine.' })
  @MaxLength(80, {
    message: 'Le statut precedent ne doit pas depasser 80 caracteres.',
  })
  previousStatus?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Le statut doit etre une chaine.' })
  @MaxLength(80, {
    message: 'Le statut ne doit pas depasser 80 caracteres.',
  })
  status?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'La densite doit etre un nombre.' })
  density?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Le nombre de vehicules doit etre un nombre.' })
  vehicleCount?: number;
}
