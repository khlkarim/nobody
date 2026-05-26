import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Observable, fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Room } from './room.entity';
import { Membership } from './membership.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room) private roomRepo: Repository<Room>,
    @InjectRepository(Membership) private memRepo: Repository<Membership>,
    private emitter: EventEmitter2,
  ) { }

  async findRoom(id: string): Promise<Room> {
    const room = await this.roomRepo.findOne({
      where: { id },
      relations: { creator: true, memberships: true },
    });
    if (!room) throw new NotFoundException(`Room ${id} not found`);
    return room;
  }

  getStream(): Observable<MessageEvent> {
    return fromEvent(this.emitter, 'rooms-changed').pipe(
      map(
        () =>
          ({
            type: 'rooms-changed',
            data: {},
          }) as MessageEvent,
      ),
    );
  }

  async createRoom(name: string, description: string, creatorId: string): Promise<Room> {
    const saved = await this.roomRepo.save({ name, description, creatorId });
    await this.memRepo.save({ roomId: saved.id, userId: creatorId });
    const room = await this.findRoom(saved.id);
    this.emitter.emit('rooms-changed');
    return room;
  }

  async updateRoom(roomId: string, name: string, description?: string): Promise<Room> {
    const room = await this.findRoom(roomId);
    room.name = name;
    if (description !== undefined) room.description = description;
    await this.roomRepo.save(room);
    this.emitter.emit('rooms-changed');
    return this.findRoom(roomId);
  }

  async deleteRoom(roomId: string): Promise<boolean> {
    const room = await this.findRoom(roomId);
    await this.roomRepo.remove(room);
    this.emitter.emit('rooms-changed');
    return true;
  }

  async joinRoom(roomId: string, userId: string): Promise<Room> {
    const existing = await this.memRepo.findOne({ where: { roomId, userId } });
    if (!existing) await this.memRepo.save({ roomId, userId });
    return this.findRoom(roomId);
  }

  async kickUser(roomId: string, userId: string): Promise<Room> {
    await this.memRepo.delete({ roomId, userId });
    return this.findRoom(roomId);
  }

  async searchRooms(name: string): Promise<Room[]> {
    return this.roomRepo.find({
      where: name ? { name: ILike(`%${name}%`) } : {},
      relations: { creator: true, memberships: true },
    });
  }
}