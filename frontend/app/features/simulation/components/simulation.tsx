import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import Scene from '~/features/simulation/components/scene';
import GUI from '~/features/simulation/components/gui';
import { useSimulationContext } from '~/features/simulation/components/simulation-provider';
import { SocketStatus } from '~/lib/use-socket';

export default function Simulation() {
  const { status, isJoined, currentRoom, setCurrentRoom, handleJoin } = useSimulationContext();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const roomId = searchParams.get('room');
    if (roomId && status === SocketStatus.CONNECTED && currentRoom !== roomId) {
      setCurrentRoom(roomId);
    }
  }, [status, searchParams]);

  useEffect(() => {
    const roomId = searchParams.get('room');
    if (roomId && currentRoom === roomId && status === SocketStatus.CONNECTED && !isJoined) {
      handleJoin();
    }
  }, [currentRoom, status, isJoined]);

  if (status === SocketStatus.DISCONNECTED) {
    return <div style={{ color: 'white', padding: '2rem' }}>Socket is disconnected</div>;
  }
  if (status === SocketStatus.CONNECTING) {
    return <div style={{ color: 'white', padding: '2rem' }}>Connecting...</div>;
  }

  return (
    <>
      {!isJoined &&
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'black',
        }}>
          {/*<form className="box" onSubmit={(e) => { e.preventDefault(); handleJoin(); }}>
            <input
              type='text'
              className='box'
              value={currentRoom}
              onChange={(e) => setCurrentRoom(e.target.value)}
              placeholder="Room ID"
            />
            <button className='box'>join</button>
          </form>*/}
        </div>
      }
      {isJoined &&
        <>
          <Scene />
          <GUI />
        </>
      }
    </>
  );
}
