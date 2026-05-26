import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { RoomsService } from './rooms.service';

import { UpdateRoomDto } from './dto/updateroomdto';
import { CreateRoomDto, JoinRoomDto} from './dto/createroomdto';


@Controller('rooms')
export class RoomsController {
  constructor(private readonly service: RoomsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getRooms(@Query('search') search?: string) {
    return this.service.searchRooms(search ?? '');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createRoom(@Body() dto: CreateRoomDto) {
    return this.service.createRoom(
      dto.name,
      dto.description ?? '',
      dto.creatorId,
    );
  }

  @Patch(':roomId')
  updateRoom(
    @Param('roomId') roomId: string,
    @Body() dto: UpdateRoomDto,
  ) {
    return this.service.updateRoom(
      roomId,
      dto.name,
      dto.description,
    );
  }

  @Delete(':roomId')
  deleteRoom(@Param('roomId') roomId: string) {
    return this.service.deleteRoom(roomId);
  }

  @Post(':roomId/join')
  joinRoom(
    @Param('roomId') roomId: string,
    @Body() dto: JoinRoomDto,
  ) {
    return this.service.joinRoom(roomId, dto.userId);
  }

  @Delete(':roomId/members/:userId')
  kickUser(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
  ) {
    return this.service.kickUser(roomId, userId);
  }
}