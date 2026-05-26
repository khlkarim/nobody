import { UserIcon } from "src/users/users.enums";
import { SimLoop } from "./sim.loop";

export enum Events {
  ROOM_JOIN = 'room.join',
  ROOM_LEAVE = 'room.leave',
  ROOM_USERS = 'room.users',
  SIM_STATE_BROADCAST = 'sim.state.broadcast',
  SIM_STATE_UPDATE_BODY = 'sim.state.update.body',
  SIM_STATE_CREATE_BODY = 'sim.state.create.body',
  SIM_STATE_DELETE_BODY = 'sim.state.remove.body',
}

export interface Vec2 {
  x: number;
  y: number;
}

export interface Body {
  id: string;
  mass: number;
  radius: number;
  position: Vec2;
  velocity: Vec2;
  owner: string;
}

export interface SimState {
  tick: number;
  deltatime: number;
  timestamp: number;
  bodies: Map<string, Body>;
}

export interface Client {
  id: string;
  userId: string;
  color: string;
  icon: UserIcon;
}

export interface Room {
  id: string;
  simLoop: SimLoop;
  members: Set<string>;
}
