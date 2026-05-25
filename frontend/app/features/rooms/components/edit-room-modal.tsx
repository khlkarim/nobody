import { useState } from 'react';
import { useRoomsStore } from '../rooms.store';
import type { Room } from '../rooms.api';

interface Props {
    room: Room;
    onClose: () => void;
}

export function EditRoomModal({ room, onClose }: Props) {
    const { updateRoom, deleteRoom } = useRoomsStore();
    const [name, setName] = useState(room.name);
    const [description, setDescription] = useState(room.description ?? '');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    async function handleSave() {
        setSaving(true);
        try {
            await updateRoom(room.id, name, description);
            onClose();
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!confirm(`Delete "${room.name}"? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            await deleteRoom(room.id);
            onClose();
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="modal__title">Edit Room</h2>

                <label className="modal__label">
                    Name
                    <input
                        className="modal__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <label className="modal__label">
                    Description
                    <textarea
                        className="modal__input modal__textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </label>

                <div className="modal__actions">
                    <button
                        className="modal__btn modal__btn--danger"
                        onClick={handleDelete}
                        disabled={deleting || saving}
                    >
                        {deleting ? 'Deleting…' : 'Delete Room'}
                    </button>

                    <button className="modal__btn" onClick={onClose}>
                        Cancel
                    </button>

                    <button
                        className="modal__btn modal__btn--primary"
                        onClick={handleSave}
                        disabled={saving || deleting || !name.trim()}
                    >
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}