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
import { userResponseSchema, type UserResponse, type UpdateUserRequest } from './users.schema';

export const usersApi = {
    updateProfile: async (id: string, request: UpdateUserRequest): Promise<UserResponse> => {
        const res = await api.patch(`/users/${id}`, request);
        return userResponseSchema.parse(res.data);
    },
};
