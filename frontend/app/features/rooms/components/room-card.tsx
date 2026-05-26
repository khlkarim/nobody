import { useState } from 'react';
import { useAuthStore } from '~/features/auth/auth.store';
import { useRoomsStore } from '../rooms.store';
import type { Room } from '../rooms.api';
import { EditRoomModal } from './edit-room-modal';

interface Props {
    room: Room;
}

export function RoomCard({ room }: Props) {
    const { user } = useAuthStore();
    const { joinRoom } = useRoomsStore();
    const [joining, setJoining] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const isCreator = user?.id === room.creator.id;
    const memberCount = room.memberships.length;
    const formattedDate = new Date(room.createdAt).toISOString().slice(0, 10).replace(/-/g, '.');

    async function handleJoin() {
        setJoining(true);
        try {
            await joinRoom(room.id);
        } finally {
            setJoining(false);
        }
    }

    return (
        <>
            <div className="room-card">
                <div className="room-card__header">
                    <div className="room-card__meta">
                        <span className="room-card__name">{room.name}</span>

                        <div className="room-card__bubble">
                            <span className="room-card__count">
                                {memberCount >= 1000
                                    ? `${(memberCount / 1000).toFixed(0)}k`
                                    : memberCount}
                            </span>
                        </div>

                        <span className="room-card__tag">
                        {room.creator.firstName} {room.creator.lastName}
                        </span>

                        {isCreator && (
                        <span className="room-card__tag">you</span>
                        )}
                    </div>

                    <div className="room-card__actions">
                        {isCreator && (
                            <button
                                className="room-card__btn"
                                onClick={() => setEditOpen(true)}
                            >
                                Edit
                            </button>
                        )}
                        <button
                            className="room-card__btn room-card__btn--join"
                            onClick={handleJoin}
                            disabled={joining}
                        >
                            {joining ? '...' : 'Join'}
                        </button>
                    </div>
                </div>

                {room.description && (
                    <div className="room-card__description">{room.description}</div>
                )}
            </div>

            {editOpen && (
                <EditRoomModal
                    room={room}
                    onClose={() => setEditOpen(false)}
                />
            )}
        </>
    );
}