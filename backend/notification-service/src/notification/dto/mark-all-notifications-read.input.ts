import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class MarkAllNotificationsReadInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4', {
    message: 'L identifiant utilisateur doit etre un UUID valide.',
  })
  userId?: string;
}
