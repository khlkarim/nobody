import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';


import { Room } from './room.entity';
import { Membership } from './membership.entity';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { RoomsResolver } from './rooms.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Membership]),
    EventEmitterModule,
  ],
  providers: [RoomsService, RoomsResolver],
  controllers: [RoomsController],
})
export class RoomsModule { }