import { Controller, Param, Sse } from '@nestjs/common';
import { SimService } from './sim.service';

@Controller('simulation')
export class SimController {
  constructor(private readonly simService: SimService) {}

@Sse('userstream/:roomId')
  stream(@Param('roomId') roomId: string) {
    return this.simService.getStream(roomId);
  }
}