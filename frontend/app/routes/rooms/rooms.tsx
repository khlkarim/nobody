import { useEffect, useState, useRef } from 'react';
import { useRoomsStore } from '~/features/rooms/rooms.store';
import { useAuthStore } from '~/features/auth/auth.store';
import { RoomCard } from '~/features/rooms/components/room-card';
import { CreateRoomModal } from '~/features/rooms/components/create-room-modal';
import './rooms.css';

export default function RoomsPage() {
    const { loadRooms, search, rooms, isLoading, startSSE } = useRoomsStore();
    const { user } = useAuthStore();

    const [query, setQuery] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const sseCleanupRef = useRef<(() => void) | null>(null);

    // Initial load + SSE
    useEffect(() => {
        loadRooms();
        sseCleanupRef.current = startSSE();
        return () => sseCleanupRef.current?.();
    }, []);

    function handleSearch() {
        search(query);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') handleSearch();
    }

    return (
        <div className="rooms-page">
            {/* ── Top bar ─────────────────────────────────────────────── */}
            <div className="rooms-topbar">
                <input
                    className="rooms-search-input"
                    placeholder="Search for a room...."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <button className="rooms-btn" onClick={handleSearch}>
                    Search
                </button>

                <button
                    className="rooms-btn"
                    onClick={() => setCreateOpen(true)}
                >
                    Create new Room
                </button>

                {/* Avatar circle */}
                <div className="rooms-avatar">
                    {user?.username?.[0]?.toUpperCase() ?? '?'}
                </div>
            </div>

            {/* ── Room list ───────────────────────────────────────────── */}
            <div className="rooms-list">
                {isLoading && rooms.length === 0 && (
                    <p className="rooms-empty">Loading rooms…</p>
                )}

                {!isLoading && rooms.length === 0 && (
                    <p className="rooms-empty">No rooms found. Create one!</p>
                )}

                {rooms.map((room) => (
                    <RoomCard key={room.id} room={room} />
                ))}
            </div>

            {createOpen && (
                <CreateRoomModal onClose={() => setCreateOpen(false)} />
            )}
        </div>
    );
}