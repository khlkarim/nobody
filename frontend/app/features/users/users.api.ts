import api from '../../lib/api';
import { userResponseSchema, type UserResponse, type UpdateUserRequest } from './users.schema';

export const usersApi = {
    updateProfile: async (id: string, request: UpdateUserRequest): Promise<UserResponse> => {
        const res = await api.patch(`/users/${id}`, request);
        return userResponseSchema.parse(res.data);
    },
};