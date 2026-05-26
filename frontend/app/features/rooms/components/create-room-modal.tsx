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
                <h2 className="modal__title">Create New Room</h2>

                <label className="modal__label">
                    Room Name
                    <input
                        className="modal__input"
                        placeholder="e.g. Solar System"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </label>

                <label className="modal__label">
                    Description
                    <textarea
                        className="modal__input modal__textarea"
                        placeholder="What's this simulation about?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </label>

                {error && <p className="modal__error">{error}</p>}

                <div className="modal__actions">
                    <button className="modal__btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className="modal__btn modal__btn--primary"
                        onClick={handleCreate}
                        disabled={creating || !name.trim() || !user}
                    >
                        {creating ? 'Creating…' : 'Create Room'}
                    </button>
                </div>
            </div>
        </div>
    );
}