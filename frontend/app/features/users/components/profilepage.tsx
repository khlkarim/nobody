import React, { useState } from 'react';
import { useAuthStore } from '~/features/auth/auth.store';
import { usersApi } from '~/features/users/users.api';
import { useNavigate } from 'react-router-dom';
import { getAvatarColor } from '~/features/users/utils/avatarcolor';
import './profilepage.css';

export default function ProfilePage() {
  const { user, hydrateUser } = useAuthStore();
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!user) {
    return <div className="profile-fallback">Please log in to edit your profile.</div>;
  }
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';

  const avatarColor = getAvatarColor(user.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(false);
    setIsLoading(true);
    try {
      await usersApi.updateProfile(user.id, { firstName, lastName });
      await hydrateUser(); 
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="profile-page">
      <div className="profile-card">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back to Rooms
        </button>

        <h2>Edit Profile</h2>
        <p className="subtitle">Update your personal details</p>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="avatar-selector-container">
            <div className="avatar-ball-preview" style={{ backgroundColor: avatarColor, cursor: 'default' }}>
              {initials}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="save-btn" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>

          {success && <p className="success-message">Profile updated successfully!</p>}
        </form>
      </div>
    </div>
  );
}