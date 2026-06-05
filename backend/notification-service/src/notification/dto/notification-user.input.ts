import { Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class NotificationUserInput {
  @Field(() => ID)
  @IsUUID('4', {
    message: 'L identifiant utilisateur doit etre un UUID valide.',
  })
  @IsNotEmpty({ message: 'L identifiant utilisateur est obligatoire.' })
  userId!: string;
}
