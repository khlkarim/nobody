import {
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Events } from './sim.domain';
import { Server, Socket } from 'socket.io';
import { SimService } from './sim.service';
import { BodyDto, RoomDto } from './sim.dto';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  },
})
export class SimGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly simService: SimService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) { }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;

      if (!token) {
        console.log(`Client ${client.id} rejected: no token`);
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);

      if (!payload?.id) {
        console.log(`Client ${client.id} rejected: invalid token payload`);
        client.emit('error', { message: 'Invalid token' });
        client.disconnect();
        return;
      }

      const userId = payload.id;
      const user = await this.usersService.findById(userId);

      if (!user) {
        console.log(`Client ${client.id} rejected: user not found`);
        client.emit('error', { message: 'User not found' });
        client.disconnect();
        return;
      }

      // Store the userId on the socket for later use
      (client as any).userId = userId;

      // Kick any existing session for this user
      const existingSocketId = this.simService.getSocketIdByUserId(userId);
      if (existingSocketId) {
        const existingSocket = this.server.sockets.sockets.get(existingSocketId);
        if (existingSocket) {
          console.log(`Kicking duplicate session for user "${userId}" (old socket: ${existingSocketId})`);
          existingSocket.emit('error', { message: 'Session replaced by a new login' });
          existingSocket.disconnect(true);
        }
      }

      // Register the new connection
      this.simService.registerClient(userId, client.id, user.color);

      console.log(`Client connected: ${client.id} (user: ${userId})`);
      client.emit('connected', { socketId: client.id, userId, color: user.color });
    } catch (err) {
      console.log(`Client ${client.id} rejected: token verification failed`);
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client as any).userId;

    if (userId) {
      this.simService.remove(userId);
      console.log(`Client disconnected: ${client.id} (user: ${userId})`);
    } else {
      console.log(`Client disconnected: ${client.id} (unauthenticated)`);
    }
  }

  private getUserId(client: Socket): string | null {
    return (client as any).userId || null;
  }

  @SubscribeMessage(Events.ROOM_JOIN)
  async handleJoin(@ConnectedSocket() client: Socket, @MessageBody() dto: RoomDto) {
    const userId = this.getUserId(client);
    if (!userId) return;

    const { id: roomId } = dto;

    const room = this.simService.join(userId, roomId, (simState) => {
      this.broadcast(roomId, Events.SIM_STATE_BROADCAST, {
        ...simState,
        bodies: [...simState.bodies.entries()]
      });
    });

    client.join(roomId);

    // Send the current users and their colors to the joined client
    const membersColors = Array.from(room.members).map(mId => ({
      id: mId,
      color: this.simService.getClient(mId)?.color || '#ffffff'
    }));
    client.emit(Events.ROOM_USERS, { roomId, users: membersColors });

    const clientColor = this.simService.getClient(userId)?.color || '#ffffff';
    this.broadcast(roomId, Events.ROOM_JOIN, {
      roomId,
      userId,
      color: clientColor,
    });

    const user = await this.usersService.findById(userId);

    const firstName = user?.firstName || 'Unknown';
    const lastName = user?.lastName || 'Unknown';
    const fullname = `${firstName} ${lastName}`;

    this.simService.emitEvent(roomId, {
      data: {
        payload: {
          hasJoined: true,
          fullName: fullname,
        }
      }
    });

    console.log(`User "${userId}" joined room "${roomId}"`);
  }

  @SubscribeMessage(Events.ROOM_LEAVE)
  async handleLeave(@ConnectedSocket() client: Socket, @MessageBody() dto: RoomDto) {
    const userId = this.getUserId(client);
    if (!userId) return;

    const { id: roomId } = dto;

    this.simService.leave(userId, roomId);
    client.leave(roomId);

    this.broadcast(roomId, Events.ROOM_LEAVE, {
      roomId,
      userId,
    });

    const user = await this.usersService.findById(userId);

    const firstName = user?.firstName || 'Unknown';
    const lastName = user?.lastName || 'Unknown';
    const fullname = `${firstName} ${lastName}`;

    this.simService.emitEvent(roomId, {
      data: {
        payload: {
          hasJoined: false,
          fullName: fullname,
        }
      }
    });

    console.log(`User "${userId}" left room "${roomId}"`);
  }

  @SubscribeMessage(Events.SIM_STATE_CREATE_BODY)
  handleCreateBody(@ConnectedSocket() client: Socket, @MessageBody() dto: {
    roomId: string,
    bodyDto: BodyDto
  }) {
    const userId = this.getUserId(client);
    if (!userId) return;

    const { roomId, bodyDto } = dto;
    this.simService.createBody(roomId, userId, bodyDto);
  }

  @SubscribeMessage(Events.SIM_STATE_UPDATE_BODY)
  handleUpdateBody(@MessageBody() dto: {
    roomId: string,
    bodies: BodyDto[]
  }) {
    const { roomId, bodies } = dto;

    for (let i = 0; i < bodies.length; i++) {
      this.simService.updateBody(roomId, bodies[i].id, bodies[i]);
    }
  }


  @SubscribeMessage(Events.SIM_STATE_DELETE_BODY)
  handleDeleteBody(@MessageBody() dto: {
    roomId: string,
    bodyId: string,
  }) {
    const { roomId, bodyId } = dto;
    this.simService.deleteBody(roomId, bodyId);
  }

  broadcast(roomId: string, event: string, payload: any) {
    this.server.to(roomId).emit(event, payload);
  }
}
