import Avatar from './avatar';
import { useState } from 'react';
import UserList from './user-list';
import NotificationList from './notification-list';
import { useAuthStore } from '~/features/auth/auth.store';
import { useSimulationContext } from './simulation-provider';

export default function GUI() {
  const [hoverLeave, setHoverLeave] = useState(false);
  const [hoverAddBody, setHoverAddBody] = useState(false);

  const { isLoading } = useAuthStore();
  const { handleLeave, handleCreate, bodyCount } = useSimulationContext();

  return (
    <>
      <Avatar />

      <button
        type="button"
        disabled={isLoading}
        onClick={handleLeave}
        onMouseEnter={() => setHoverLeave(true)}
        onMouseLeave={() => setHoverLeave(false)}
        style={{
          position: "fixed",
          top: 20,
          right: 80,

          width: 144,
          height: 40,

          overflow: "hidden",
          border: "1px solid white",

          opacity: isLoading ? 0.5 : 1,
          backgroundColor: hoverLeave ? 'white' : 'black',
          color: hoverLeave ? 'black' : 'white',
        }}
      >
        {isLoading ? 'Loading...' : 'leave'}
      </button>

      <button
        type="button"
        disabled={isLoading}
        onClick={handleCreate}
        onMouseEnter={() => setHoverAddBody(true)}
        onMouseLeave={() => setHoverAddBody(false)}
        style={{
          position: "fixed",
          top: 20,
          right: 240,

          width: 144,
          height: 40,

          overflow: "hidden",
          border: "1px solid white",

          opacity: isLoading ? 0.5 : 1,
          backgroundColor: hoverAddBody ? 'white' : 'black',
          color: hoverAddBody ? 'black' : 'white',
        }}
      >
        {isLoading ? 'Loading...' : 'add body'}
      </button>

      <div
        style={{
          position: "fixed",
          top: 20,
          right: 400,

          width: 40,
          height: 40,

          overflow: "hidden",
          border: "2px solid white",

          opacity: isLoading ? 0.5 : 1,
          backgroundColor: 'white',
          color: 'black',

          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
      >
        {isLoading ? 'Loading...' : bodyCount.toString()}
      </div>

      <UserList />

      <NotificationList />
    </>
  );
}
