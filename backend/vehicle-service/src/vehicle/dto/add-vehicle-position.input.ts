import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsNumber, IsUUID, Max, Min } from 'class-validator';

@InputType()
export class AddVehiclePositionInput {
  @Field(() => ID)
  @IsUUID('4', {
    message: 'L identifiant du vehicule doit etre un UUID valide.',
  })
  vehicleId!: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'La latitude doit etre un nombre.' })
  @Min(-90, { message: 'La latitude doit etre superieure ou egale a -90.' })
  @Max(90, { message: 'La latitude doit etre inferieure ou egale a 90.' })
  latitude!: number;

  @Field(() => Float)
  @IsNumber({}, { message: 'La longitude doit etre un nombre.' })
  @Min(-180, { message: 'La longitude doit etre superieure ou egale a -180.' })
  @Max(180, { message: 'La longitude doit etre inferieure ou egale a 180.' })
  longitude!: number;

  @Field(() => Float)
  @IsNumber({}, { message: 'La vitesse doit etre un nombre.' })
  @Min(0, { message: 'La vitesse ne peut pas etre negative.' })
  @Max(300, { message: 'La vitesse ne doit pas depasser 300 km/h.' })
  speed!: number;
}
