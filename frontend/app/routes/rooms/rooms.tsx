import { useEffect, useState } from 'react';
import { useRoomEvents } from '~/features/rooms/useRoomEvents';
import { useRoomsStore } from '~/features/rooms/rooms.store';
import { useAuthStore } from '~/features/auth/auth.store';
import { RoomCard } from '~/features/rooms/components/room-card';
import { CreateRoomModal } from '~/features/rooms/components/create-room-modal';
import Avatar from '../../features/rooms/components/avatar';
import { getAvatarColor } from '~/features/users/utils/avatarcolor';
import './rooms.css';

export default function RoomsPage() {
    const { getRooms, rooms, isLoading } = useRoomsStore();
    const { user } = useAuthStore();

    const [query, setQuery] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    useRoomEvents();

    useEffect(() => {
        getRooms();
    }, []);

    function handleSearch() {
        getRooms(query);
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') handleSearch();
    }

    // Derive user initials based on firstName/lastName schema
    const initials = user
        ? ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() || '?'
        : '?';

    return (
        <div className="rooms-page">
            {/*Top bar*/}
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

                {/* Avatar circle linking dynamically to profile path */}
                <div
                    className="rooms-avatar"

                    style={{
                        cursor: user ? 'pointer' : 'default',
                    }}
                >
                    <Avatar />
                </div>
            </div>

            {/*Room list*/}
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