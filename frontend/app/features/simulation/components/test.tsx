import { useSim } from "../use-sim";
import { Events } from "../sim.schema";
import { SocketStatus } from "~/lib/use-socket";
import { broadcast, update } from "..//sim.utils";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "~/features/auth/auth.store";

const RADIUS = 20;
const CONTAINER = {
  x: 800,
  y: 600,
}

export function SimTest() {
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [currentRoom, setCurrentRoom] = useState<string>('');
  const { status, socket, simState, colors } = useSim({ url: "http://localhost:3000" });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || !simState) {
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const [, body] of simState.bodies.entries()) {
      const x = body.position.x + canvas.width / 2;
      const y = body.position.y + canvas.height / 2;

      ctx.beginPath();
      ctx.arc(x, y, body.radius, 0, Math.PI * 2);

      const color = colors.get(body.owner) || '#00ff00';
      ctx.fillStyle = color;
      ctx.fill();

      ctx.closePath();
    }

    if (socket.current) {
      const all = [...simState.bodies.entries()].map(p => p[1]);
      const userId = useAuthStore.getState().user?.id;
      let mine = all.filter(b => b.owner === userId);
      mine = update(simState.deltatime, CONTAINER, mine, all);
      broadcast(socket.current, currentRoom, mine);
    }
  }, [simState]);

  function handleJoin() {
    if (!socket.current) {
      return;
    }

    socket.current.emit(Events.ROOM_JOIN, { id: currentRoom });
    setIsJoined(true);
  }

  function handleLeave() {
    if (!socket.current) {
      return;
    }

    socket.current.emit(Events.ROOM_LEAVE, { id: currentRoom });
    setIsJoined(false);
  }

  function handleCreate() {
    if (!socket.current) {
      return;
    }

    socket.current.emit(Events.SIM_STATE_CREATE_BODY, {
      roomId: currentRoom,
      bodyDto: {
        mass: 100 * RADIUS,
        radius: RADIUS,
        position: {
          x: (Math.random() - 0.5) * (CONTAINER.x - 2 * RADIUS),
          y: (Math.random() - 0.5) * (CONTAINER.y - 2 * RADIUS),
        },
        velocity: {
          x: 0.0,
          y: 0.0,
        }
      }
    });
  }

  if (status === SocketStatus.DISCONNECTED) {
    return <>Socket is disconnected</>;
  }

  if (status === SocketStatus.CONNECTING) {
    return <>Socket is connecting...</>;
  }

  return (
    <div>
      <p>Socket is connected</p>

      {!isJoined ?
        <form className="form" onSubmit={handleJoin}>
          <input
            type='text'
            value={currentRoom}
            onChange={(e) => setCurrentRoom(e.target.value)}
          />
          <button>join</button>
        </form>
        :
        <div className="form">
          <p>Current room: {currentRoom}</p>

          <button onClick={handleLeave}>leave</button>
          <button onClick={handleCreate}>create body</button>

          <canvas
            ref={canvasRef}
            width={CONTAINER.x}
            height={CONTAINER.y}
            style={{
              border: "1px solid white",
              marginTop: "1rem",
            }}
          />
        </div>
      }
    </div>
  );
}
