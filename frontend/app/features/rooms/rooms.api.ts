import { api } from '~/lib/api';

export interface RoomCreator {
    id: string;
    username: string;
}

export interface Membership {
    id: string;
    userId: string;
}

export interface Room {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    creator: RoomCreator;
    memberships: Membership[];
}

// ── GraphQL helpers ────────────────────────────────────────────────────────────

async function gql<T = unknown>(
    query: string,
    variables?: Record<string, unknown>,
): Promise<T> {
    const res = await api('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
    });

    if (!res.ok) throw new Error(`GraphQL request failed: ${res.status}`);

    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data as T;
}

// ── Rooms API ──────────────────────────────────────────────────────────────────

export async function fetchRooms(): Promise<Room[]> {
    const data = await gql<{ rooms: Room[] }>(`
    query {
      rooms {
        id name description createdAt
        creator { id username }
        memberships { id userId }
      }
    }
  `);
    return data.rooms;
}

export async function searchRooms(name: string): Promise<Room[]> {
    const data = await gql<{ searchRooms: Room[] }>(
        `query SearchRooms($name: String!) {
      searchRooms(name: $name) {
        id name description createdAt
        creator { id username }
        memberships { id userId }
      }
    }`,
        { name },
    );
    return data.searchRooms;
}

export async function createRoom(
    name: string,
    description: string,
): Promise<Room> {
    const data = await gql<{ createRoom: Room }>(
        `mutation CreateRoom($name: String!, $description: String) {
      createRoom(name: $name, description: $description) {
        id name description createdAt
        creator { id username }
        memberships { id userId }
      }
    }`,
        { name, description },
    );
    return data.createRoom;
}

export async function joinRoom(roomId: string): Promise<void> {
    await gql(
        `mutation JoinRoom($roomId: String!) {
      joinRoom(roomId: $roomId) { id }
    }`,
        { roomId },
    );
}

export async function updateRoom(
    roomId: string,
    name: string,
    description: string,
): Promise<Room> {
    const data = await gql<{ updateRoom: Room }>(
        `mutation UpdateRoom($roomId: String!, $name: String, $description: String) {
      updateRoom(roomId: $roomId, name: $name, description: $description) {
        id name description createdAt
        creator { id username }
        memberships { id userId }
      }
    }`,
        { roomId, name, description },
    );
    return data.updateRoom;
}

// ── SSE ────────────────────────────────────────────────────────────────────────

/**
 * Subscribe to server-sent room creation events.
 * Returns a cleanup function to close the connection.
 */
export function subscribeToRoomEvents(onNewRoom: (room: Room) => void): () => void {
    const es = new EventSource('/rooms/events', { withCredentials: true });

    es.addEventListener('room-created', (e: MessageEvent) => {
        try {
            const room: Room = JSON.parse(e.data);
            onNewRoom(room);
        } catch {
            console.error('Failed to parse SSE room event', e.data);
        }
    });

    es.onerror = () => {
        console.warn('SSE connection error — will auto-reconnect');
    };

    return () => es.close();
}