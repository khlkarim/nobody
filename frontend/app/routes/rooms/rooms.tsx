import { useEffect, useState } from 'react';
import { useRoomEvents } from '~/features/rooms/useRoomEvents';
import { useRoomsStore } from '~/features/rooms/rooms.store';
import { useAuthStore } from '~/features/auth/auth.store';
import { RoomCard } from '~/features/rooms/components/room-card';
import { CreateRoomModal } from '~/features/rooms/components/create-room-modal';
import { useNavigate } from 'react-router-dom';
import { getAvatarColor } from '~/features/users/utils/avatarcolor';
import './rooms.css';
import { Navbar } from '~/components/navbar';
import { Protect } from '~/features/auth/components/protect';

export default function RoomsPage() {
    const { getRooms, rooms, isLoading } = useRoomsStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

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
        <Protect>
            <div className="rooms-page">
                <Navbar />

                {/*Top bar*/}
                <div className="rooms-topbar">
                    <input
                        className="rooms-search-input"
                        placeholder="search for a room...."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />

                    <button className="box" onClick={handleSearch}>
                        search
                    </button>

                    <button
                        className="box"
                        onClick={() => setCreateOpen(true)}
                    >
                        create new room
                    </button>

                    {/* Avatar circle linking dynamically to profile path */}
                    <div
                        className="rooms-avatar"
                        onClick={() => user && navigate(`/user`)}
                        style={{
                            backgroundColor: user ? user.color : '#6366f1', // Dynamically matching the profile page
                            cursor: user ? 'pointer' : 'default',
                        }}
                        title={user ? `${user.firstName} ${user.lastName}` : 'Profile'}
                    >
                        {initials}
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
        </Protect>
    );
}
