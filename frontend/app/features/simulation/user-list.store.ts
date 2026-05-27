import { create } from 'zustand';
import { usersApi } from '../users/users.api';
import type { UserResponse } from '../users/users.schema';

type UsersState = {
  users: UserResponse[] | null;
  load: (roomId: string) => Promise<void>;
  refresh: (roomId: string) => Promise<void>;
};

export const useUsers = create<UsersState>()(
  (set) => ({
    users: null,

    load: async (roomId: string) => {
      set({
        users: await usersApi.getUsersByRoom(roomId),
      })
    },

    refresh: async (roomId: string) => {
      set({
        users: await usersApi.getUsersByRoom(roomId),
      })
    }
  })
);
