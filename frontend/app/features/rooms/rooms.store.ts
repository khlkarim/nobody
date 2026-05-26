import { create } from 'zustand';
import { roomsApi } from './rooms.api';
import type { Room } from './rooms.schema';
import { useAuthStore } from '../auth/auth.store';

type RoomsState = {
    rooms: Room[];
    isLoading: boolean;
    error: string | null;

    getRooms: (search?: string) => Promise<void>;
    createRoom: (name: string, creatorId: string, description?: string) => Promise<void>;
    updateRoom: (roomId: string, name: string, description?: string) => Promise<void>;
    deleteRoom: (roomId: string) => Promise<void>;
    joinRoom: (roomId: string) => Promise<void>;
    kickUser: (roomId: string, userId: string) => Promise<void>;
    addRoom: (room: Room) => void;
};

export const useRoomsStore = create<RoomsState>()((set) => ({
    rooms: [],
    isLoading: false,
    error: null,

    getRooms: async (search?) => {
        set({ isLoading: true, error: null });
        try {
            const rooms = await roomsApi.getRooms(search);
            set({ rooms, isLoading: false });
        } catch (err) {
            set({ error: String(err), isLoading: false });
        }
    },

    createRoom: async (name, creatorId, description?) => {
        set({ isLoading: true, error: null });
        try {
            const room = await roomsApi.createRoom({ name, description, creatorId });
            set((s) => ({ rooms: [room, ...s.rooms], isLoading: false }));
        } catch (err) {
            set({ error: String(err), isLoading: false });
            throw err;
        }
    },

    updateRoom: async (roomId, name, description?) => {
        set({ error: null });
        try {
            const updated = await roomsApi.updateRoom({ roomId, name, description });
            set((s) => ({
                rooms: s.rooms.map((r) => (r.id === roomId ? updated : r)),
            }));
        } catch (err) {
            set({ error: String(err) });
            throw err;
        }
    },

    deleteRoom: async (roomId) => {
        set({ error: null });
        try {
            await roomsApi.deleteRoom(roomId);
            set((s) => ({ rooms: s.rooms.filter((r) => r.id !== roomId) }));
        } catch (err) {
            set({ error: String(err) });
            throw err;
        }
    },

    joinRoom: async (roomId) => {
        set({ error: null });
        try {
            const userId = useAuthStore.getState().user?.id;
            if (!userId) throw new Error('Not authenticated');
            await roomsApi.joinRoom({ roomId, userId });
            set((s) => ({
                rooms: s.rooms.map((r) =>
                    r.id === roomId
                        ? { ...r, memberships: [...r.memberships, { id: 'tmp', userId }] }
                        : r,
                ),
            }));
        } catch (err) {
            set({ error: String(err) });
            throw err;
        }
    },

    kickUser: async (roomId, userId) => {
        set({ error: null });
        try {
            await roomsApi.kickUser({ roomId, userId });
            set((s) => ({
                rooms: s.rooms.map((r) =>
                    r.id === roomId
                        ? { ...r, memberships: r.memberships.filter((m) => m.userId !== userId) }
                        : r,
                ),
            }));
        } catch (err) {
            set({ error: String(err) });
            throw err;
        }
    },

    addRoom: (room) => {
        set((s) => {
            if (s.rooms.some((r) => r.id === room.id)) return s;
            return { rooms: [room, ...s.rooms] };
        });
    },
}));