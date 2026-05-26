import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserModel } from './users.model';
import { UpdateUserDto } from './dto/updateuserdto';

@Resolver(() => UserModel)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserModel])
  async users() {
    return this.usersService.findAll();
  }
  @Query(() => UserModel, { nullable: true })
  async user(@Args('id') id: string) {
    return this.usersService.findById(id);
  }
  @Mutation(() => UserModel)
  async updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserDto,
  ) {
    return this.usersService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    await this.usersService.delete(id);
    return true;
  }
}