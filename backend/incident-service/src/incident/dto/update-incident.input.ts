import { Field, Float, InputType } from '@nestjs/graphql';
import { IncidentType } from '@prisma/client';
import {
  IsEnum,
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class UpdateIncidentInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Le titre doit etre une chaine de caracteres.' })
  @MaxLength(200, { message: 'Le titre ne doit pas depasser 200 caracteres.' })
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La description doit etre une chaine de caracteres.' })
  @MaxLength(2000, {
    message: 'La description ne doit pas depasser 2000 caracteres.',
  })
  description?: string;

  @Field(() => IncidentType, { nullable: true })
  @IsOptional()
  @IsEnum(IncidentType, {
    message:
      'Le type d incident doit etre ACCIDENT, TRAVAUX, ROUTE_FERMEE ou EMBOUTEILLAGE.',
  })
  type?: IncidentType;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsLatitude({ message: 'La latitude doit etre comprise entre -90 et 90.' })
  latitude?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsLongitude({
    message: 'La longitude doit etre comprise entre -180 et 180.',
  })
  longitude?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'L adresse doit etre une chaine de caracteres.' })
  @MaxLength(300, {
    message: 'L adresse ne doit pas depasser 300 caracteres.',
  })
  address?: string;
}
