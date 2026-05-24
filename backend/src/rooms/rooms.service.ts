import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Room } from './room.entity';
import { Membership } from './membership.entity';
import { pubSub } from 'src/common/pubsub';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomRepo: Repository<Room>,

    @InjectRepository(Membership)
    private memRepo: Repository<Membership>,

  ) {}

  async createRoom(name: string, description: string, creatorId: string) {
    const room = await this.roomRepo.save({
      name,
      description,
    });

    pubSub.publish('roomUpdated', {
      roomUpdated: { roomId: room.id },
    });

    return room;
  }

  async joinRoom(roomId: string, userId: string) {
    const membership = await this.memRepo.save({
      room: { id: roomId } as any,
      user: { id: userId } as any,
    });

    const memberCount = await this.memRepo.count({
      where: { room: { id: roomId } },
    });

    pubSub.publish('memberUpdated', {
      memberUpdated: { roomId, memberCount },
    });

    return membership;
  }

  async kickUser(roomId: string, userId: string) {
    await this.memRepo.delete({
      room: { id: roomId } as any,
      user: { id: userId } as any,
    });

    const memberCount = await this.memRepo.count({
      where: { room: { id: roomId } },
    });

    pubSub.publish('memberUpdated', {
      memberUpdated: { roomId, memberCount },
    });

    return true;
  }

  searchRooms(name: string) {
    return this.roomRepo
      .createQueryBuilder('room')
      .where('room.name LIKE :name', { name: `%${name}%` })
      .getMany();
  }
}