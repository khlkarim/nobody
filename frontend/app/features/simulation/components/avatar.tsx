import { useState } from 'react';
import { Events } from '../sim.schema';
import { useNavigate } from 'react-router';
import { useAuthStore } from '~/features/auth/auth.store';
import { useSimulationContext } from './simulation-provider';

export default function Avatar() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [hover, setHover] = useState(false);
  const { socket, currentRoom } = useSimulationContext();

  const handleClick = () => {
    if (!socket.current) {
      return;
    }

    socket.current.emit(Events.ROOM_LEAVE, { id: currentRoom });

    navigate("/user");
  }

  const initials = user
    ? ((user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')).toUpperCase() || '?'
    : '?';

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 16,
      }}
    >
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        {/*<img
          src="/avatar.png"
          alt="avatar"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />*/}
        <div
          className="rooms-avatar"
          onClick={() => user && navigate(`/user`)}
          style={{
            height: 40,
            backgroundColor: user ? user.color : '#6366f1', // Dynamically matching the profile page
            cursor: user ? 'pointer' : 'default',
          }}
          title={user ? `${user.firstName} ${user.lastName}` : 'Profile'}
        >
          {initials}
        </div>
      </div>

      {/*{hover && (
        <div
          style={{
            position: "absolute",
            top: 54,
            right: -8,

            backgroundColor: "black",
            color: "white",
            padding: "4px 8px",
            borderRadius: 4,

            whiteSpace: "nowrap",
            fontSize: 12,
          }}
        >
          go to profile
        </div>
      )*/}
    </div>
  );
}
