import { AuthConfig } from '../auth/config.type';
import { DatabaseConfig } from 'src/database/config.type';

export type AllConfigType = {
  auth: AuthConfig;
  database: DatabaseConfig;
};
