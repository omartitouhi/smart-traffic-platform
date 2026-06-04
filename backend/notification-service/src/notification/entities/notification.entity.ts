import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { NotificationType } from '@prisma/client';

registerEnumType(NotificationType, {
  name: 'NotificationType',
  description: 'Type de notification emise par la plateforme.',
});

@ObjectType()
export class NotificationEntity {
  @Field(() => ID)
  id!: string;

  @Field()
  title!: string;

  @Field()
  message!: string;

  @Field(() => NotificationType)
  type!: NotificationType;

  @Field()
  isRead!: boolean;

  @Field(() => ID)
  userId!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}
