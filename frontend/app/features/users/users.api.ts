import api from '../../lib/api';
import type { UserRequest } from './users.schema';

export const usersApi = {
  edit: async (userId: string, data: UserRequest): Promise<void> => {
    await api.patch(`/users/${userId}`, data);
  },
  delete: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  }
}
