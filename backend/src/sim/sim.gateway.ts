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

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  },
})
export class SimGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly simService: SimService) { }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    client.emit('connected', { socketId: client.id });
  }

  handleDisconnect(client: Socket) {
    this.simService.remove(client.id);
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage(Events.ROOM_JOIN)
  handleJoin(@ConnectedSocket() client: Socket, @MessageBody() dto: RoomDto) {
    const { id: roomId } = dto;

    this.simService.join(client.id, roomId, (simState) => {
      this.broadcast(roomId, Events.SIM_STATE_BROADCAST, {
        ...simState,
        bodies: [...simState.bodies.entries()]
      });
    });

    client.join(roomId);
    this.broadcast(roomId, Events.ROOM_JOIN, {
      roomId,
      clientId: client.id,
    });

    console.log(`"${client.id} joined room "${roomId}"`);
  }

  @SubscribeMessage(Events.ROOM_LEAVE)
  handleLeave(@ConnectedSocket() client: Socket, @MessageBody() dto: RoomDto) {
    const { id: roomId } = dto;

    this.simService.leave(client.id, roomId);
    client.leave(roomId);

    this.broadcast(roomId, Events.ROOM_LEAVE, {
      roomId,
      clientId: client.id,
    });

    console.log(`Client ${client.id} explicitly left room "${roomId}"`);
  }

  @SubscribeMessage(Events.SIM_STATE_CREATE_BODY)
  handleCreateBody(@ConnectedSocket() client: Socket, @MessageBody() dto: {
    roomId: string,
    bodyDto: BodyDto
  }) {
    const { roomId, bodyDto } = dto;
    this.simService.createBody(roomId, client.id, bodyDto);
  }

  @SubscribeMessage(Events.SIM_STATE_UPDATE_BODY)
  handleUpdateBody(@MessageBody() dto: {
    roomId: string,
    bodyId: string,
    bodyDto: BodyDto
  }) {
    const { roomId, bodyId, bodyDto } = dto;
    this.simService.updateBody(roomId, bodyId, bodyDto);
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
