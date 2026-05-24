import { registerAs } from '@nestjs/config';

export type AuthConfig = {
  secret?: string;
  expiresIn?: number;
};

export default registerAs<AuthConfig>('auth', () => {
  return {
    secret: process.env.AUTH_JWT_SECRET,
    expiresIn: parseInt(process.env.AUTH_JWT_TOKEN_EXPIRES_IN || "60", 10),
  };
});
