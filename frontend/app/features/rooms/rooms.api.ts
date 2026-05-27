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
import { gqlQueries } from './rooms.queries';

export type { Room };

export const roomsApi = {
    getRooms: async (search?: string): Promise<Room[]> => {
        const res = await api.get('/rooms', { params: search ? { search } : {} });
        return roomListSchema.parse(res.data);
    },

    getRoomsGQL: async (search?: string): Promise<Room[]> => {
        const query = gqlQueries['get'];

        const variables = search ? { search } : {};
        const res = await api.post('/graphql', { query, variables });

        return res.data.data.searchRooms;
    },

    createRoom: async (request: CreateRoomRequest): Promise<Room> => {
        createRoomRequestSchema.parse(request);
        const res = await api.post('/rooms', request);
        return roomSchema.parse(res.data);
    },

	createRoomGQL: async (request: CreateRoomRequest): Promise<Room> => {
		createRoomRequestSchema.parse(request);
		const mutation = gqlQueries['create'];

		const variables = { input: request };
		const res = await api.post('/graphql', { query: mutation, variables });
		
		return res.data.data.createRoom;
	},

    updateRoom: async (request: UpdateRoomRequest): Promise<Room> => {
        updateRoomRequestSchema.parse(request);
        const res = await api.patch(`/rooms/${request.roomId}`, {
            name: request.name,
            description: request.description,
        });
        return roomSchema.parse(res.data);
    },

	updateRoomGQL: async (request: UpdateRoomRequest): Promise<Room> => {
		updateRoomRequestSchema.parse(request);
		const mutation = gqlQueries['edit'];

		const variables = { roomId: request.roomId, input: { name: request.name, description: request.description } };
		const res = await api.post('/graphql', { query: mutation, variables });

		return res.data.data.updateRoom;
	},

    deleteRoom: async (roomId: string): Promise<void> => {
        await api.delete(`/rooms/${roomId}`);
    },

	deleteRoomGQL: async (roomId: string): Promise<void> => {
		const mutation = gqlQueries['delete'];

		const variables = { roomId };
		await api.post('/graphql', { query: mutation, variables });
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