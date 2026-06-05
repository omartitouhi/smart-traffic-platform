import {
  Field,
  Float,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { IncidentStatus, IncidentType } from '@prisma/client';

registerEnumType(IncidentType, {
  name: 'IncidentType',
  description: 'Categorie metier d un incident sur la voirie.',
});

registerEnumType(IncidentStatus, {
  name: 'IncidentStatus',
  description: 'Statut courant d un incident: Signale, En cours, Resolu.',
});

@ObjectType()
export class IncidentEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => IncidentType)
  type!: IncidentType;

  @Field(() => IncidentStatus)
  status!: IncidentStatus;

  @Field(() => Float)
  latitude!: number;

  @Field(() => Float)
  longitude!: number;

  @Field(() => String, { nullable: true })
  address?: string | null;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
