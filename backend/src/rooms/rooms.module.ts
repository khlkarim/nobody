import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Room } from './room.entity';
import { Membership } from './membership.entity';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Membership])
  ],
  providers: [RoomsService],
  controllers: [RoomsController],
})
export class RoomsModule {}