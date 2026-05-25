import { randomUUID } from 'crypto';
import { BodyDto } from './sim.dto';
import { Body, SimState } from './sim.domain';

const TICK_RATE = 1000 / 60;

export class SimLoop {
  private intervalId: NodeJS.Timeout | null = null;

  private gameState: SimState = {
    tick: 0,
    deltatime: 0,
    timestamp: Date.now(),
    bodies: new Map<string, Body>(),
  };

  constructor(private broadcast: (gameState: SimState) => void) { }

  start(): void {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => this.tick(), TICK_RATE);
    console.log('Simulation started');
  }

  stop(): void {
    if (!this.intervalId) return;

    clearInterval(this.intervalId);
    this.intervalId = null;
    console.log('Simulation stopped');
  }

  reset(): void {
    this.gameState = {
      tick: 0,
      deltatime: 0,
      timestamp: Date.now(),
      bodies: new Map<string, Body>(),
    };
  }

  createBody(clientId: string, bodyDto: BodyDto): void {
    const body = {
      ...bodyDto,
      id: randomUUID(),
      owner: clientId,
    }

    this.gameState.bodies.set(body.id, body);
  }

  updateBody(id: string, bodyDto: BodyDto): void {
    const body = this.gameState.bodies.get(id);
    if (!body) return;

    this.gameState.bodies.set(id, {
      ...body,
      ...bodyDto
    });
  }

  deleteBody(id: string): void {
    this.gameState.bodies.delete(id);
  }

  private tick(): void {
    const now = Date.now();
    this.gameState.deltatime = Math.min((now - this.gameState.timestamp) / 1000, 0.05);

    this.broadcast(this.gameState);

    this.gameState.tick++;
    this.gameState.timestamp = now;
  }
}
