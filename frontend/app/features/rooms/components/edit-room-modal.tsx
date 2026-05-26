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
                <label className="modal__label">
                    name
                    <input
                        className="modal__input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>

                <label className="modal__label">
                    description
                    <textarea
                        className="modal__input modal__textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                    />
                </label>

                <div className="modal__actions" style={{ justifyContent: 'space-between', }}>
                    <button
                        className="box"
                        onClick={handleDelete}
                        disabled={deleting || saving}
                    >
                        {deleting ? 'Deleting…' : 'delete'}
                    </button>

                    <div style={{ display: "flex", gap: 8 }}>
                        <button className="box" onClick={onClose}>
                            cancel
                        </button>

                        <button
                            className="box"
                            onClick={handleSave}
                            disabled={saving || deleting || !name.trim()}
                        >
                            {saving ? 'Saving…' : 'save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
