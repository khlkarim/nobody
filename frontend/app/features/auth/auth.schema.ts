import { z } from 'zod';

export const ERROR_MESSAGES: Record<string, string> = {
  notFound: 'email not found',
  emailAlreadyExists: 'email already exists',
  incorrectPassword: 'incorrect password',
};

export const loginRequestSchema = z.object({
  email: z.email({ message: "invalid email address" }),
  password: z.string().min(6, { message: "password must be at least 6 characters" }),
});
export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const registerRequestSchema = z.object({
  firstName: z.string().min(1, { message: "firstname cannot be empty" }),
  lastName: z.string().min(1, { message: "lastname cannot be empty" }),
  email: z.email({ message: "invalid email address" }),
  password: z.string().min(6, { message: "password must be at least 6 characters" }),
});
export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export const loginResponseSchema = z.object({
  token: z.string(),
  expiresIn: z.number(),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;
