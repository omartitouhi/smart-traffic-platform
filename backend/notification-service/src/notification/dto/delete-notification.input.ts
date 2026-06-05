import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

@InputType()
export class DeleteNotificationInput {
  @Field(() => ID)
  @IsUUID('4', {
    message: 'L identifiant de la notification doit etre un UUID valide.',
  })
  @IsNotEmpty({ message: 'L identifiant de la notification est obligatoire.' })
  id!: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4', {
    message: 'L identifiant utilisateur doit etre un UUID valide.',
  })
  userId?: string;
}
