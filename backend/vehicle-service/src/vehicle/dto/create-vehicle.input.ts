import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

@InputType()
export class CreateVehicleInput {
  @Field()
  @IsString({ message: 'Le matricule doit etre une chaine de caracteres.' })
  @IsNotEmpty({ message: 'Le matricule est obligatoire.' })
  @MaxLength(50, {
    message: 'Le matricule ne doit pas depasser 50 caracteres.',
  })
  @Matches(/^[A-Z0-9-]+$/, {
    message:
      'Le matricule doit contenir uniquement des lettres majuscules, des chiffres ou des tirets.',
  })
  matricule!: string;

  @Field()
  @IsString({ message: 'La marque doit etre une chaine de caracteres.' })
  @IsNotEmpty({ message: 'La marque est obligatoire.' })
  @MaxLength(100, { message: 'La marque ne doit pas depasser 100 caracteres.' })
  brand!: string;

  @Field()
  @IsString({ message: 'Le modele doit etre une chaine de caracteres.' })
  @IsNotEmpty({ message: 'Le modele est obligatoire.' })
  @MaxLength(100, { message: 'Le modele ne doit pas depasser 100 caracteres.' })
  model!: string;

  @Field()
  @IsString({ message: 'Le type doit etre une chaine de caracteres.' })
  @IsNotEmpty({ message: 'Le type de vehicule est obligatoire.' })
  @MaxLength(50, { message: 'Le type ne doit pas depasser 50 caracteres.' })
  type!: string;

  @Field()
  @IsString({ message: 'Le statut doit etre une chaine de caracteres.' })
  @IsNotEmpty({ message: 'Le statut du vehicule est obligatoire.' })
  @MaxLength(50, { message: 'Le statut ne doit pas depasser 50 caracteres.' })
  status!: string;
}
