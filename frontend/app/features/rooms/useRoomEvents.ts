import { useEffect } from 'react';
import { useRoomsStore } from './rooms.store';
import type { Room } from './rooms.schema';

export function useRoomEvents() {
    const addRoom = useRoomsStore((s) => s.addRoom);

    useEffect(() => {
        const es = new EventSource('/rooms/events', { withCredentials: true });

        es.addEventListener('room-created', (e: MessageEvent) => {
            try {
                const room: Room = JSON.parse(e.data);
                addRoom(room);
            } catch {
                console.error('Failed to parse room-created event', e.data);
            }
        });

        es.onerror = () => {
            console.warn('SSE connection lost — browser will auto-reconnect');
        };

        return () => es.close();
    }, [addRoom]);
}