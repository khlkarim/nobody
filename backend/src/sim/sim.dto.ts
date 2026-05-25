import { Vec2 } from "./sim.domain";

export class RoomDto {
  id: string;
}

export class BodyDto {
  mass: number;
  radius: number;
  position: Vec2;
  velocity: Vec2;
}
