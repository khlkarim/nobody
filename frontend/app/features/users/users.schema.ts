import { z } from 'zod';
import { UserIcon } from '../simulation/sim.schema';

export const userResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  createdAt: z.string().datetime().transform((v) => new Date(v)),
  updatedAt: z.string().datetime().transform((v) => new Date(v)),
  deletedAt: z.string().datetime().nullable().optional().transform((v) =>
    v ? new Date(v) : null
  ),
  color: z.string().default('#ffffff'),
  icon: z.enum(UserIcon).default(UserIcon.CIRCLE),
  memberships: z.array(z.any()).default([]),
});

export type UserResponse = z.infer<typeof userResponseSchema>;

export const userRequestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  color: z.string().optional(),
  icon: z.enum(UserIcon).optional(),
});

export type UserRequest = z.infer<typeof userRequestSchema>;