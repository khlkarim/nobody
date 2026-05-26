import { z } from 'zod';

export enum Events {
  ROOM_JOIN = 'room.join',
  ROOM_LEAVE = 'room.leave',
  ROOM_USERS = 'room.users',
  SIM_STATE_BROADCAST = 'sim.state.broadcast',
  SIM_STATE_CREATE_BODY = 'sim.state.create.body',
  SIM_STATE_UPDATE_BODY = 'sim.state.update.body',
  SIM_STATE_DELETE_BODY = 'sim.state.remove.body',
}

export enum UserIcon {
  CIRCLE = 'circle',
  CLIENT = 'client',
  CUBE = 'cube',
  OCTAGON = 'octagon',
  SERVER = 'server',
  SQUARE = 'square',
  STAR = 'star',
  SUN = 'sun',
}

export const vec2Schema = z.object({
  x: z.number(),
  y: z.number(),
});
export type Vec2Schema = z.infer<typeof vec2Schema>;

export const roomSchema = z.object({ roomId: z.string() });
export type RoomSchema = z.infer<typeof roomSchema>;

export const bodyRequestSchema = z.object({
  mass: z.number(),
  radius: z.number(),
  position: vec2Schema,
  velocity: vec2Schema,
});
export type BodyRequestSchema = z.infer<typeof bodyRequestSchema>;

export const bodyResponseSchema = z.object({
  id: z.string(),
  mass: z.number(),
  radius: z.number(),
  position: vec2Schema,
  velocity: vec2Schema,
  owner: z.string(),
});
export type BodyResponseSchema = z.infer<typeof bodyResponseSchema>;

export const simStateSchema = z.object({
  tick: z.number(),
  deltatime: z.number(),
  timestamp: z.number(),
  bodies: z.map(z.string(), bodyResponseSchema),
});
export type SimStateSchema = z.infer<typeof simStateSchema>;

export const roomStateSchema = z.object({
  roomId: z.string(),
  clients: z.array(z.string()),
  width: z.number(),
  height: z.number(),
  collisions: z.boolean(),
});
export type RoomStateSchema = z.infer<typeof roomStateSchema>;