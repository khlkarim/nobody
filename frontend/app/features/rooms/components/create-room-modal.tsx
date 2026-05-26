import { useState } from 'react';
import { useRoomsStore } from '../rooms.store';
import { useAuthStore } from '~/features/auth/auth.store'; // 1. Import Auth Store

interface Props {
    onClose: () => void;
}

export function CreateRoomModal({ onClose }: Props) {
    const { createRoom } = useRoomsStore();
    const { user } = useAuthStore(); // 2. Get the current user

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState('');

    async function handleCreate() {
        if (!name.trim() || !user) return;

        setCreating(true);
        setError('');
        try {
            await createRoom(name.trim(), user.id, description.trim());
            onClose();
        } catch (err) {
            setError(String(err));
        } finally {
            setCreating(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <label className="modal__label">
                    room name
                    <input
                        className="modal__input"
                        placeholder="e.g. solar system"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </label>

                <label className="modal__label">
                    description
                    <textarea
                        className="modal__input modal__textarea"
                        placeholder="what's this simulation about?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </label>

                {error && <p className="modal__error">{error}</p>}

                <div className="modal__actions">
                    <button className="box" onClick={onClose}>
                        cancel
                    </button>
                    <button
                        className="box"
                        onClick={handleCreate}
                        disabled={creating || !name.trim() || !user}
                    >
                        {creating ? 'Creating…' : 'create'}
                    </button>
                </div>
            </div>
        </div>
    );
}
