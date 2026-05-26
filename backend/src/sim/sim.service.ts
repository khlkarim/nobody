import { Subject } from 'rxjs';
import { BodyDto } from './sim.dto';
import { SimLoop } from './sim.loop';
import { Injectable } from '@nestjs/common';
import { UserIcon } from 'src/users/users.enums';
import { Client, SimState, Room } from './sim.domain';

@Injectable()
export class SimService {
  private streams = new Map<string, Subject<any>>();
  private rooms: Map<string, Room> = new Map<string, Room>();
  private clients: Map<string, Client> = new Map<string, Client>();
  private userSockets: Map<string, Set<string>> = new Map<string, Set<string>>();

  registerClient(userId: string, socketId: string, color: string, icon: UserIcon) {
    this.clients.set(socketId, { id: socketId, userId, color, icon });

    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set<string>());
    }
    this.userSockets.get(userId)!.add(socketId);
  }

  getClient(socketId: string): Client | undefined {
    return this.clients.get(socketId);
  }

  getSocketIdsByUserId(userId: string): Set<string> {
    return this.userSockets.get(userId) ?? new Set();
  }

  join(socketId: string, roomId: string, broadcast: (gameState: SimState) => void) {
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
    room.members.add(socketId);
    return room;
  }

  leave(socketId: string, roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.simLoop.deleteBodiesByOwner(socketId);
    room.members.delete(socketId);

    if (room.members.size === 0) {
      room.simLoop.stop();
      this.rooms.delete(roomId);
      console.log(`Room deleted (empty): "${roomId}"`);
    }
  }

  createBody(roomId: string, socketId: string, bodyDto: BodyDto) {
    const room = this.rooms.get(roomId);
    if (!room) return;
    room.simLoop.createBody(socketId, bodyDto);
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

  remove(socketId: string) {
    const client = this.clients.get(socketId);
    if (!client) return;

    const { userId } = client;

    for (const room of this.rooms.values()) {
      if (room.members.has(socketId)) {
        this.leave(socketId, room.id);
      }
    }

    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }

    this.clients.delete(socketId);
    console.log(`Client removed: socket "${socketId}" (user: "${userId}")`);
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
