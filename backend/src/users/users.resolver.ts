import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { UserEntity } from './users.entity';

import { CreateUserDto, UpdateUserDto } from './users.dto';

@Resolver(() => UserEntity)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [UserEntity])
  getUsers(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @Query(() => UserEntity, { nullable: true })
  getUser(
    @Args('id') id: string,
  ): Promise<UserEntity | null> {
    return this.usersService.findById(id);
  }

  @Mutation(() => UserEntity)
  createUser(
    @Args('input') input: CreateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.create(input);
  }

  @Mutation(() => UserEntity)
  updateUser(
    @Args('id') id: string,
    @Args('input') input: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.usersService.update(id, input);
  }

  @Mutation(() => Boolean)
  deleteUser(
    @Args('id') id: string,
  ): Promise<boolean> {
    return this.usersService.delete(id);
  }
}