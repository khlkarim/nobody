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
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { SimService } from './sim.service';
import { BodyDto, RoomDto } from './sim.dto';
import { UserIcon } from 'src/users/users.enums';
import { UsersService } from '../users/users.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
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
        client.emit('error', { message: 'Authentication required' });
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);

      if (!payload?.id) {
        client.emit('error', { message: 'Invalid token' });
        client.disconnect();
        return;
      }

      const userId = payload.id;
      const user = await this.usersService.findById(userId);

      if (!user) {
        client.emit('error', { message: 'User not found' });
        client.disconnect();
        return;
      }

      (client as any).userId = userId;

      // Register the new connection
      this.simService.registerClient(userId, client.id, user.color, user.icon);

      console.log(`Client connected: socket "${client.id}" (user: "${userId}")`);
      client.emit('connected', {
        userId,
        socketId: client.id,
        color: user.color,
        icon: user.icon,
      });
    } catch {
      client.emit('error', { message: 'Authentication failed' });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = (client as any).userId;
    this.simService.remove(client.id);
    console.log(`Client disconnected: socket "${client.id}" (user: "${userId ?? 'unauthenticated'}")`);
  }

  @SubscribeMessage(Events.ROOM_JOIN)
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: RoomDto,
  ) {
    const userId = (client as any).userId as string | undefined;
    if (!userId) return;

    const { id: roomId } = dto;

    const room = this.simService.join(client.id, roomId, (simState) => {
      this.broadcast(roomId, Events.SIM_STATE_BROADCAST, {
        ...simState,
        bodies: [...simState.bodies.entries()],
      });
    });

    client.join(roomId);

    const membersInfo = Array.from(room.members).map((socketId) => {
      const c = this.simService.getClient(socketId);
      console.log(c);

      return {
        socketId,
        userId: c?.userId,
        color: c?.color ?? '#ffffff',
        icon: c?.icon ?? UserIcon.CIRCLE,
      };
    });
    client.emit(Events.ROOM_USERS, { roomId, users: membersInfo });

    const clientData = this.simService.getClient(client.id);
    this.broadcast(roomId, Events.ROOM_JOIN, {
      roomId,
      socketId: client.id,
      userId,
      color: clientData?.color ?? '#ffffff',
      icon: clientData?.icon ?? UserIcon.CIRCLE,
    });

    const user = await this.usersService.findById(userId);
    const fullName = `${user?.firstName ?? 'Unknown'} ${user?.lastName ?? 'Unknown'}`;
    this.simService.emitEvent(roomId, {
      data: { payload: { hasJoined: true, fullName } },
    });

    console.log(`Socket "${client.id}" (user: "${userId}") joined room "${roomId}"`);
  }

  @SubscribeMessage(Events.ROOM_LEAVE)
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: RoomDto,
  ) {
    const userId = (client as any).userId as string | undefined;
    if (!userId) return;

    const { id: roomId } = dto;

    this.simService.leave(client.id, roomId);
    client.leave(roomId);

    this.broadcast(roomId, Events.ROOM_LEAVE, {
      roomId,
      userId,
      socketId: client.id,
    });

    const user = await this.usersService.findById(userId);
    const fullName = `${user?.firstName ?? 'Unknown'} ${user?.lastName ?? 'Unknown'}`;
    this.simService.emitEvent(roomId, {
      data: { payload: { hasJoined: false, fullName } },
    });

    console.log(`Socket "${client.id}" (user: "${userId}") left room "${roomId}"`);
  }

  @SubscribeMessage(Events.SIM_STATE_CREATE_BODY)
  handleCreateBody(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: { roomId: string; bodyDto: BodyDto },
  ) {
    if (!(client as any).userId) return;
    const { roomId, bodyDto } = dto;
    this.simService.createBody(roomId, client.id, bodyDto);
  }

  @SubscribeMessage(Events.SIM_STATE_UPDATE_BODY)
  handleUpdateBody(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: { roomId: string; bodies: BodyDto[] },
  ) {
    if (!(client as any).userId) return;
    const { roomId, bodies } = dto;
    for (const body of bodies) {
      this.simService.updateBody(roomId, body.id, body);
    }
  }

  @SubscribeMessage(Events.SIM_STATE_DELETE_BODY)
  handleDeleteBody(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: { roomId: string; bodyId: string },
  ) {
    if (!(client as any).userId) return;
    const { roomId, bodyId } = dto;
    this.simService.deleteBody(roomId, bodyId);
  }

  broadcast(roomId: string, event: string, payload: any) {
    this.server.to(roomId).emit(event, payload);
  }
}
