import { createContext, useContext, useState, type ReactNode, type MutableRefObject } from "react";
import { useSim } from "../use-sim";
import { Events, type SimStateSchema, type BodyResponseSchema, UserIcon } from "../sim.schema";
import { SocketStatus } from "~/lib/use-socket";
import type { Socket } from "socket.io-client";
import { useEffect } from 'react';
import { useNavigate } from "react-router";

const WIDTH = 12;
const HEIGHT = 8;
const RADIUS = 0.1;

type SimulationContextType = {
  status: SocketStatus;
  socket: MutableRefObject<Socket | null>;
  simState: SimStateSchema;
  colors: Map<string, string>;
  icons: Map<string, UserIcon>;
  isJoined: boolean;
  currentRoom: string;
  setCurrentRoom: (v: string) => void;
  handleJoin: () => void;
  handleLeave: () => void;
  handleCreate: () => void;
  bodyCount: number;
  setBodyCount: (v: number) => void;
};

const SimulationContext = createContext<SimulationContextType>({
  status: SocketStatus.DISCONNECTED,
  socket: { current: null },
  simState: {
    tick: 0,
    deltatime: 0,
    timestamp: 0,
    bodies: new Map<string, BodyResponseSchema>(),
  },
  colors: new Map(),
  icons: new Map(),
  isJoined: false,
  currentRoom: '',
  setCurrentRoom: () => { },
  handleJoin: () => { },
  handleLeave: () => { },
  handleCreate: () => { },
  bodyCount: 0,
  setBodyCount: () => { },
});

export function SimulationProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isJoined, setIsJoined] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [bodyCount, setBodyCount] = useState(0);
  const { status, socket, simState, colors, icons } = useSim({ url: "http://localhost:3000" });

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
    setCurrentRoom('');
    navigate('/');
  }

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isJoined && socket.current) {
        socket.current.emit(Events.ROOM_LEAVE, { id: currentRoom });
        setIsJoined(false);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isJoined, currentRoom, socket]);

  function handleCreate() {
    if (!socket.current) {
      return;
    }

    socket.current.emit(Events.SIM_STATE_CREATE_BODY, {
      roomId: currentRoom,
      bodyDto: {
        mass: 1,
        radius: RADIUS,
        position: {
          x: (Math.random() - 0.5) * (WIDTH - RADIUS * 2),
          y: (Math.random() - 0.5) * (HEIGHT - RADIUS * 2),
        },
        velocity: { x: 0.01, y: 0.01 }
      }
    });
    setBodyCount((prev) => prev + 1);
  }

  return (
    <SimulationContext.Provider value={{
      status, socket, simState, colors, icons,
      isJoined, currentRoom, setCurrentRoom,
      handleJoin, handleLeave, handleCreate,
      bodyCount, setBodyCount
    }}>
      {children}
    </SimulationContext.Provider>
  );
}

export const useSimulationContext = () => useContext(SimulationContext);
