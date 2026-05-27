import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Room } from './room.entity';
import { RoomsService } from './rooms.service';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { CreateRoomDto } from './dto/createroomdto';
import { UpdateRoomDto } from './dto/updateroomdto';

@Resolver(() => Room)
export class RoomsResolver {
    constructor(private roomsService: RoomsService) { }

    @UseGuards(GqlAuthGuard)
    @Query(() => Room, { nullable: true })
    room(@Args('id') id: string): Promise<Room> {
        return this.roomsService.findRoom(id);
    }

    @UseGuards(GqlAuthGuard)
    @Query(() => [Room])
    searchRooms(@Args('search', { nullable: true }) search?: string): Promise<Room[]> {
        return this.roomsService.searchRooms(search ?? '');
    }

    @Mutation(() => Room)
    createRoom(
    @Args('input') input: CreateRoomDto,
    ): Promise<Room> {
        return this.roomsService.createRoom(
            input.name,
            input.description ?? '',
            input.creatorId,
        );
    }

    @Mutation(() => Room)
    updateRoom(
    @Args('roomId') roomId: string,
    @Args('input') input: UpdateRoomDto,
    ): Promise<Room> {
        return this.roomsService.updateRoom(
            roomId,
            input.name,
            input.description,
        );
    }

    @Mutation(() => Boolean)
    deleteRoom(
    @Args('roomId') roomId: string,
    ): Promise<boolean> {
        return this.roomsService.deleteRoom(roomId);
    }
}