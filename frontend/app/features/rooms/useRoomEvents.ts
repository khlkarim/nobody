import { useEffect } from 'react';
import { useRoomsStore } from './rooms.store';

export function useRoomEvents() {
    const getRooms = useRoomsStore((s) => s.getRooms);

    useEffect(() => {
        const es = new EventSource('http://localhost:3000/rooms/events', {
            withCredentials: true,
        });

        es.addEventListener('rooms-changed', () => {
            console.log("room change detected");
            getRooms();
        });

        es.onerror = () => {
            console.warn('SSE connection lost — browser will auto-reconnect');
        };

        return () => es.close();
    }, [getRooms]);
}