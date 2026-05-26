import api from '../../lib/api';
import {
    roomSchema,
    roomListSchema,
    createRoomRequestSchema,
    updateRoomRequestSchema,
    joinRoomRequestSchema,
    kickUserRequestSchema,
    type Room,
    type CreateRoomRequest,
    type UpdateRoomRequest,
    type JoinRoomRequest,
    type KickUserRequest,
} from './rooms.schema';

export type { Room };

export const roomsApi = {
    getRooms: async (search?: string): Promise<Room[]> => {
        const res = await api.get('/rooms', { params: search ? { search } : {} });
        return roomListSchema.parse(res.data);
    },

    createRoom: async (request: CreateRoomRequest): Promise<Room> => {
        createRoomRequestSchema.parse(request);
        const res = await api.post('/rooms', request);
        return roomSchema.parse(res.data);
    },

    updateRoom: async (request: UpdateRoomRequest): Promise<Room> => {
        updateRoomRequestSchema.parse(request);
        const res = await api.patch(`/rooms/${request.roomId}`, {
            name: request.name,
            description: request.description,
        });
        return roomSchema.parse(res.data);
    },

    deleteRoom: async (roomId: string): Promise<void> => {
        await api.delete(`/rooms/${roomId}`);
    },

    joinRoom: async (request: JoinRoomRequest): Promise<void> => {
        joinRoomRequestSchema.parse(request);
        await api.post(`/rooms/${request.roomId}/join`, { userId: request.userId });
    },

    kickUser: async (request: KickUserRequest): Promise<void> => {
        kickUserRequestSchema.parse(request);
        await api.delete(`/rooms/${request.roomId}/members/${request.userId}`);
    },
};