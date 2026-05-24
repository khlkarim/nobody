import { create } from 'zustand';
import {
    fetchRooms,
    searchRooms,
    createRoom,
    joinRoom,
    updateRoom,
    subscribeToRoomEvents,
    type Room,
} from './rooms.api';

interface RoomsState {
    rooms: Room[];
    isLoading: boolean;
    error: string | null;

    // actions
    loadRooms: () => Promise<void>;
    search: (query: string) => Promise<void>;
    createRoom: (name: string, description: string) => Promise<Room>;
    joinRoom: (roomId: string) => Promise<void>;
    updateRoom: (roomId: string, name: string, description: string) => Promise<void>;
    addRoom: (room: Room) => void;           // called by SSE
    startSSE: () => () => void;              // returns cleanup fn
}

export const useRoomsStore = create<RoomsState>((set, get) => ({
    rooms: [],
    isLoading: false,
    error: null,

    loadRooms: async () => {
        set({ isLoading: true, error: null });
        try {
            const rooms = await fetchRooms();
            set({ rooms, isLoading: false });
        } catch (err) {
            set({ error: String(err), isLoading: false });
        }
    },

    search: async (query: string) => {
        set({ isLoading: true, error: null });
        try {
            const rooms = query.trim()
                ? await searchRooms(query)
                : await fetchRooms();
            set({ rooms, isLoading: false });
        } catch (err) {
            set({ error: String(err), isLoading: false });
        }
    },

    createRoom: async (name, description) => {
        set({ isLoading: true, error: null });
        try {
            const room = await createRoom(name, description);
            // SSE will add the room for other clients; add locally for creator
            set((s) => ({ rooms: [room, ...s.rooms], isLoading: false }));
            return room;
        } catch (err) {
            set({ error: String(err), isLoading: false });
            throw err;
        }
    },

    joinRoom: async (roomId) => {
        try {
            await joinRoom(roomId);
            // optimistically bump membership count
            set((s) => ({
                rooms: s.rooms.map((r) =>
                    r.id === roomId
                        ? { ...r, memberships: [...r.memberships, { id: 'tmp', userId: '' }] }
                        : r,
                ),
            }));
        } catch (err) {
            set({ error: String(err) });
            throw err;
        }
    },

    updateRoom: async (roomId, name, description) => {
        try {
            const updated = await updateRoom(roomId, name, description);
            set((s) => ({
                rooms: s.rooms.map((r) => (r.id === roomId ? { ...r, ...updated } : r)),
            }));
        } catch (err) {
            set({ error: String(err) });
            throw err;
        }
    },

    addRoom: (room) => {
        set((s) => {
            // avoid duplicates (creator already added it)
            if (s.rooms.some((r) => r.id === room.id)) return s;
            return { rooms: [room, ...s.rooms] };
        });
    },

    startSSE: () => {
        const cleanup = subscribeToRoomEvents((room) => get().addRoom(room));
        return cleanup;
    },
}));