import z from 'zod';
import api from '../../lib/api';
import type { UserRequest } from './users.schema';
import { userResponseSchema, type UserResponse } from './users.schema';

export const usersApi = {
  getSocketIdsByUserId: async (userId: string): Promise<string[]> => {
    const res = await api.get(`simulation/sockets/${userId}`);
    console.log(res);
    return z.array(z.string()).parse(res);
  },

  getUsersByRoom: async (roomId: string): Promise<UserResponse[]> => {
    const res = await api.get(`/simulation/users/${roomId}`);
    console.log(res.data);
    return z.array(userResponseSchema).parse(res.data);
  },

  edit: async (userId: string, data: UserRequest): Promise<void> => {
    await api.patch(`/users/${userId}`, data);
  },
  delete: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },
  updateProfile: async (id: string, request: UserRequest): Promise<UserResponse> => {
    const res = await api.patch(`/users/${id}`, request);
    return userResponseSchema.parse(res.data);
  },
}
