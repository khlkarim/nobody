import { Controller, Get, Param, Sse } from '@nestjs/common';
import { SimService } from './sim.service';

@Controller('simulation')
export class SimController {
  constructor(private readonly simService: SimService) { }

  @Get("/sockets/:userId")
  getSocketIdsByUserId(@Param('userId') userId: string) {
    return this.simService.getSocketIdsByUserIdArray(userId);
  }

  @Get("/users/:roomId")
  getUsersByRoom(@Param('roomId') roomId: string) {
    return this.simService.getUsersByRoom(roomId);
  }

  @Sse('userstream/:roomId')
  stream(@Param('roomId') roomId: string) {
    return this.simService.getStream(roomId);
  }
}
