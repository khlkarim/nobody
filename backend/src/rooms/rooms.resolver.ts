import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Room } from './room.entity';
import { RoomsService } from './rooms.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Room)
export class RoomsResolver {
    constructor(private roomsService: RoomsService) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => Room, { nullable: true })
    room(@Args('id') id: string): Promise<Room> {
        return this.roomsService.findRoom(id);
    }
}