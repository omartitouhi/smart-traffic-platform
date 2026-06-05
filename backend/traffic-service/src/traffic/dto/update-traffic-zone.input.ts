import { Field, Float, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class UpdateTrafficZoneInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({
    message: 'Le nom de la zone doit etre une chaine de caracteres.',
  })
  @MaxLength(120, {
    message: 'Le nom de la zone ne doit pas depasser 120 caracteres.',
  })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({
    message: 'La description de la zone doit etre une chaine de caracteres.',
  })
  @MaxLength(1000, {
    message: 'La description de la zone ne doit pas depasser 1000 caracteres.',
  })
  description?: string;

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

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'Le rayon doit etre un nombre.' })
  @Min(0.01, { message: 'Le rayon doit etre strictement superieur a 0.' })
  @Max(100000, { message: 'Le rayon ne doit pas depasser 100000.' })
  radius?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'Le nombre de vehicules doit etre un entier.' })
  @Min(0, { message: 'Le nombre de vehicules ne peut pas etre negatif.' })
  @Max(1000000, {
    message: 'Le nombre de vehicules ne doit pas depasser 1000000.',
  })
  vehicleCount?: number;
}
