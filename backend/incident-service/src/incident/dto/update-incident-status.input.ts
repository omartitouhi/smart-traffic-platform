import { Field, ID, InputType } from '@nestjs/graphql';
import { IncidentStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class UpdateIncidentStatusInput {
  @Field(() => ID)
  @IsUUID('4', { message: 'L identifiant doit etre un UUID v4.' })
  @IsNotEmpty({ message: 'L identifiant est obligatoire.' })
  id!: string;

  @Field(() => IncidentStatus)
  @IsEnum(IncidentStatus, {
    message: 'Le statut doit etre SIGNALE, EN_COURS ou RESOLU.',
  })
  status!: IncidentStatus;
}
