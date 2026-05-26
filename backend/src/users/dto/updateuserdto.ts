import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { UserIcon } from '../users.enums';
registerEnumType(UserIcon, {
  name: 'UserIcon',
});

@InputType()
export class UpdateUserDto {
  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true })
  newPassword?: string;

  @Field({ nullable: true })
  firstName?: string;

  @Field({ nullable: true })
  lastName?: string;

  @Field({ nullable: true })
  color?: string;

  @Field(() => UserIcon, { nullable: true })
  icon?: UserIcon;
}