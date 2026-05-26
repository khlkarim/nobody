import Scene from '~/features/simulation/components/scene';
import GUI from '~/features/simulation/components/gui';
import { useSimulationContext } from '~/features/simulation/components/simulation-provider';
import { SocketStatus } from '~/lib/use-socket';

export default function Simulation() {
  const { status, isJoined, currentRoom, setCurrentRoom, handleJoin } = useSimulationContext();

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
          <form className="form" onSubmit={(e) => { e.preventDefault(); handleJoin(); }}>
            <input
              type='text'
              value={currentRoom}
              onChange={(e) => setCurrentRoom(e.target.value)}
              placeholder="Room ID"
            />
            <button>join</button>
          </form>
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