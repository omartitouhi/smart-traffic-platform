import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MaxLength, IsStrongPassword } from 'class-validator';

/**
 * DTO d'entrée GraphQL pour la mutation register.
 * Validation assurée par class-validator + ValidationPipe global.
 */
@InputType()
export class RegisterInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Le mot de passe doit contenir au minimum 8 caractères, dont 1 majuscule, 1 minuscule, 1 chiffre et 1 symbole.',
    },
  )
  password!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  lastName!: string;
}
