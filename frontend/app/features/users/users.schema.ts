import { z } from 'zod';
import { UserIcon } from '../simulation/sim.schema';

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  color: z.string().default('#ffffff'),
  icon: z.enum(UserIcon).default(UserIcon.CIRCLE),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

export const userRequestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  color: z.string().optional(),
  icon: z.enum(UserIcon).optional(),
});

export type UserRequest = z.infer<typeof userRequestSchema>;