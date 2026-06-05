import { Field, ID, InputType, Int } from '@nestjs/graphql';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

@InputType()
export class NotificationsQueryInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4', {
    message: 'L identifiant utilisateur doit etre un UUID valide.',
  })
  userId?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'Le filtre isRead doit etre un booleen.' })
  isRead?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'take doit etre un entier.' })
  @Min(1, { message: 'take doit etre superieur ou egal a 1.' })
  @Max(100, { message: 'take ne doit pas depasser 100.' })
  take?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: 'skip doit etre un entier.' })
  @Min(0, { message: 'skip ne peut pas etre negatif.' })
  skip?: number;
}
