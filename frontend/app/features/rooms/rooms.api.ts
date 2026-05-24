import api from '../../lib/api';
import {
    roomSchema,
    roomListSchema,
    createRoomRequestSchema,
    joinRoomRequestSchema,
    kickUserRequestSchema,
    type Room,
    type CreateRoomRequest,
    type JoinRoomRequest,
    type KickUserRequest,
} from './rooms.schema';

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

    joinRoom: async (request: JoinRoomRequest): Promise<void> => {
        joinRoomRequestSchema.parse(request);
        await api.post(`/rooms/${request.roomId}/join`);
    },

    kickUser: async (request: KickUserRequest): Promise<void> => {
        kickUserRequestSchema.parse(request);
        await api.delete(`/rooms/${request.roomId}/members/${request.userId}`);
    },
};