import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { UserIcon } from './users.enums';

registerEnumType(UserIcon, {
  name: 'UserIcon',
});

@ObjectType()
export class UserModel {
  @Field(() => ID)
  id!: string;

  @Field()
  email!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  color!: string;

  @Field(() => UserIcon)
  icon!: UserIcon;
}