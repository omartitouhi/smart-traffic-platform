import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsUUID, Max, Min } from 'class-validator';

@InputType()
export class UpdateTrafficDensityInput {
  @Field(() => ID)
  @IsUUID('4', {
    message: 'L identifiant de la zone doit etre un UUID valide.',
  })
  @IsNotEmpty({ message: 'L identifiant de la zone est obligatoire.' })
  zoneId!: string;

  @Field(() => Int)
  @IsInt({ message: 'Le nombre de vehicules doit etre un entier.' })
  @Min(0, { message: 'Le nombre de vehicules ne peut pas etre negatif.' })
  @Max(1000000, {
    message: 'Le nombre de vehicules ne doit pas depasser 1000000.',
  })
  vehicleCount!: number;
}
