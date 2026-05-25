import { BodyDto } from './sim.dto';
import { SimLoop } from './sim.loop';
import { Injectable } from '@nestjs/common';
import { Client, SimState, Room } from './sim.domain';

@Injectable()
export class SimService {
  private rooms: Map<string, Room> = new Map<string, Room>();
  private clients: Map<string, Client> = new Map<string, Room>();

  join(clientId: string, roomId: string, broadcast: (gameState: SimState) => void) {
    let room = this.rooms.get(roomId);
    let client = this.clients.get(clientId);

    if (!client) {
      client = { id: clientId };
      this.clients.set(clientId, client);
    }

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

    room.members.add(clientId);
    return room;
  }

  leave(clientId: string, roomId: string) {
    const room = this.rooms.get(roomId);

    if (room) {
      room.members.delete(clientId);

      if (room.members.size === 0) {
        room.simLoop.stop();
        this.rooms.delete(roomId);
        console.log(`Room deleted (empty): "${roomId}"`);
      }
    }
  }

  createBody(roomId: string, clientId: string, bodyDto: BodyDto) {
    const room = this.rooms.get(roomId);
    if (!room) return;

    room.simLoop.createBody(clientId, bodyDto);
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

  remove(clientId: string) {
    const client = this.clients.get(clientId);
    if (!client) return [];

    for (const room of this.rooms.values()) {
      this.leave(clientId, room.id);
    }

    this.clients.delete(clientId);
  }
}
