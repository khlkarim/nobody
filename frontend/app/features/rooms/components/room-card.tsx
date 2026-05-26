import { useState } from 'react';
import type { Room } from '../rooms.api';
import { useNavigate } from 'react-router';
import { EditRoomModal } from './edit-room-modal';
import { useAuthStore } from '~/features/auth/auth.store';

interface Props {
    room: Room;
}

export function RoomCard({ room }: Props) {
    const { user } = useAuthStore();
    const [editOpen, setEditOpen] = useState(false);

    const navigate = useNavigate();
    const memberCount = room.memberships.length;
    const isCreator = user?.id === room.creator.id;
    const formattedDate = new Date(room.createdAt).toISOString().slice(0, 10).replace(/-/g, '.');

    async function handleJoin() {
        navigate('/simulation?room=' + room.name);
    }

    return (
        <>
            <div className="room-card">
                <div className="room-card__header">
                    <div className="room-card__meta">
                        <div className="box">{room.name}</div>

                        <div className="box">
                            {memberCount >= 1000
                                ? `${(memberCount / 1000).toFixed(0)}k`
                                : memberCount}
                        </div>

                        {isCreator && (
                            <>
                                <div className='box'>{formattedDate}</div>
                                <div className='box'>creator</div>
                            </>
                        )}
                    </div>

                    <div className="room-card__actions">
                        {isCreator && (
                            <button
                                className="box"
                                onClick={() => setEditOpen(true)}
                            >
                                edit
                            </button>
                        )}
                        <button
                            className="box"
                            onClick={handleJoin}
                        >
                            join
                        </button>
                    </div>
                </div>

                {room.description && (
                    <div>{room.description}</div>
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
