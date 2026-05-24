import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
import { Room } from './room.entity';
import { pubSub } from '../common/pubsub';

@Resolver(() => Room)
export class RoomsResolver {
  constructor(private service: RoomsService) { }
  @Query(() => [Room])
  rooms(@Args('search', { nullable: true }) search?: string) {
    return this.service.searchRooms(search || '');
  }
  @Mutation(() => Room)
  createRoom(
    @Args('name') name: string,
    @Args('description', { nullable: true }) description: string,
    @Args('creatorId') creatorId: string,
  ) {
    return this.service.createRoom(name, description, creatorId);
  }

  @Mutation(() => Boolean)
  joinRoom(
    @Args('roomId') roomId: string,
    @Args('userId') userId: string,
  ) {
    return this.service.joinRoom(roomId, userId);
  }

  @Mutation(() => Boolean)
  kickUser(
    @Args('roomId') roomId: string,
    @Args('userId') userId: string,
  ) {
    return this.service.kickUser(roomId, userId);
  }
  @Subscription(() => String, {
    resolve: (payload) => payload.roomUpdated,
  })
  roomUpdated() {
    return (pubSub as any).asyncIterator('roomUpdated');
  }
  @Subscription(() => String, {
    resolve: (payload) => payload.memberUpdated,
  })
  memberUpdated() {
    return (pubSub as any).asyncIterator('memberUpdated');
  }
}