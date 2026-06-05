import { Field, ID, InputType } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateNotificationInput {
  @Field()
  @IsString({ message: 'Le titre doit etre une chaine de caracteres.' })
  @IsNotEmpty({ message: 'Le titre est obligatoire.' })
  @MaxLength(120, {
    message: 'Le titre ne doit pas depasser 120 caracteres.',
  })
  title!: string;

  @Field()
  @IsString({ message: 'Le message doit etre une chaine de caracteres.' })
  @IsNotEmpty({ message: 'Le message est obligatoire.' })
  @MaxLength(2000, {
    message: 'Le message ne doit pas depasser 2000 caracteres.',
  })
  message!: string;

  @Field(() => NotificationType)
  @IsEnum(NotificationType, {
    message:
      'Le type de notification doit etre INFO, WARNING, SUCCESS, ERROR, TRAFFIC_ALERT ou INCIDENT_ALERT.',
  })
  type!: NotificationType;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4', {
    message: 'L identifiant utilisateur doit etre un UUID valide.',
  })
  userId?: string;
}
