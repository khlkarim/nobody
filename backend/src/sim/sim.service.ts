import { BodyDto } from './sim.dto';
import { SimLoop } from './sim.loop';
import { Injectable } from '@nestjs/common';
import { Client, SimState, Room } from './sim.domain';
import { Subject } from 'rxjs';
import { UserIcon } from 'src/users/users.enums';

@Injectable()
export class SimService {
  private rooms: Map<string, Room> = new Map<string, Room>();
  private clients: Map<string, Client> = new Map<string, Client>();
  private streams = new Map<string, Subject<any>>();

  // Maps userId to socketId for duplicate session detection
  private userSockets: Map<string, string> = new Map<string, string>();

  registerClient(userId: string, socketId: string, color: string, icon: UserIcon) {
    this.userSockets.set(userId, socketId);

    if (!this.clients.has(userId)) {
      this.clients.set(userId, { id: userId, color, icon });
    } else {
      const client = this.clients.get(userId);
      if (client) {
        client.color = color;
        client.icon = icon;
      }
    }
  }

  getClient(userId: string): Client | undefined {
    return this.clients.get(userId);
  }

  getSocketIdByUserId(userId: string): string | null {
    return this.userSockets.get(userId) || null;
  }

  join(userId: string, roomId: string, broadcast: (gameState: SimState) => void) {
    let room = this.rooms.get(roomId);

    if (!room) {
      room = {
        id: roomId,
        members: new Set<string>(),
        simLoop: new SimLoop(broadcast),
      };

      room.simLoop.start();

      this.rooms.set(roomId, room);
      console.log(`Room created: "${roomId}"`);
    }

    room.members.add(userId);
    return room;
  }

  leave(userId: string, roomId: string) {
    const room = this.rooms.get(roomId);

    if (room) {
      room.simLoop.deleteBodiesByOwner(userId);
      room.members.delete(userId);

      if (room.members.size === 0) {
        room.simLoop.stop();
        this.rooms.delete(roomId);
        console.log(`Room deleted (empty): "${roomId}"`);
      }
    }
  }

  createBody(roomId: string, userId: string, bodyDto: BodyDto) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.simLoop.createBody(userId, bodyDto);
  }

  updateBody(roomId: string, bodyId: string, bodyDto: BodyDto) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.simLoop.updateBody(bodyId, bodyDto);
  }

  deleteBody(roomId: string, bodyId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.simLoop.deleteBody(bodyId);
  }

  remove(userId: string) {
    this.userSockets.delete(userId);

    const client = this.clients.get(userId);
    if (!client) return;

    for (const room of this.rooms.values()) {
      this.leave(userId, room.id);
    }

    this.clients.delete(userId);
  }

  private getOrCreate(roomId: string) {
    if (!this.streams.has(roomId)) {
      this.streams.set(roomId, new Subject<any>());
    }
    return this.streams.get(roomId)!;
  }

  getStream(roomId: string) {
    return this.getOrCreate(roomId).asObservable();
  }

  emitEvent(roomId: string, data: any) {
    this.getOrCreate(roomId).next(data);
  }
}
