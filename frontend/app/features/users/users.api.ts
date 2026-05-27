import api from '../../lib/api';
import type { UserRequest } from './users.schema';
import { userResponseSchema, type UserResponse } from './users.schema';

export const usersApi = {
  edit: async (userId: string, data: UserRequest): Promise<void> => {
    await api.patch(`/users/${userId}`, data);
  },

  editGQL: async (userId: string, data: UserRequest): Promise<UserResponse> => {
    const mutation = `
      mutation UpdateUser($id: String!, $input: UpdateUserDto!) {
        updateUser(id: $id, input: $input) {
          id
          email
          firstName
          lastName
          createdAt
          updatedAt
          color
          icon
          memberships {
            id
          }
        }
      }
    `;

    const variables = { id: userId, input: data };
    const res = await api.post('/graphql', { query: mutation, variables });

    console.log(res.data);

    return userResponseSchema.parse(res.data.data.updateUser);
  },

  delete: async (userId: string): Promise<void> => {
    await api.delete(`/users/${userId}`);
  },

  deleteGQL: async (userId: string): Promise<void> => {
    const mutation = `
      mutation DeleteUser($id: String!) {
        deleteUser(id: $id)
      }
    `;

    const variables = { id: userId };

    await api.post('/graphql', { query: mutation, variables });
  },
}