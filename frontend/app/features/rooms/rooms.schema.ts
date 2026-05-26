import { z } from 'zod';

export const roomCreatorSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
});

export const membershipSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
});

export const roomSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable().optional(),
  createdAt: z.string(),
  creator: roomCreatorSchema,
  memberships: z.array(membershipSchema),
});

export const roomListSchema = z.array(roomSchema);

export type Room = z.infer<typeof roomSchema>;
export type Membership = z.infer<typeof membershipSchema>;

export const createRoomRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  creatorId: z.string().uuid(),
});
export type CreateRoomRequest = z.infer<typeof createRoomRequestSchema>;

export const updateRoomRequestSchema = z.object({
  roomId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
});
export type UpdateRoomRequest = z.infer<typeof updateRoomRequestSchema>;

export const joinRoomRequestSchema = z.object({
  roomId: z.string().uuid(),
  userId: z.string().uuid(),
});
export type JoinRoomRequest = z.infer<typeof joinRoomRequestSchema>;

export const kickUserRequestSchema = z.object({
  roomId: z.string().uuid(),
  userId: z.string().uuid(),
});
export type KickUserRequest = z.infer<typeof kickUserRequestSchema>;