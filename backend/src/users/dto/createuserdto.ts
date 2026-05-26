import { InputType, Field } from '@nestjs/graphql';
import { UserIcon } from '../users.enums';

@InputType()
export class CreateUserDto {
  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field()
  password!: string;
}