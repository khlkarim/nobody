import { useEffect, useState } from "react";
import { SocketStatus, useSocket } from "~/lib/use-socket";
import { Events, type BodyResponseSchema, type SimStateSchema } from "./sim.schema";

export function useSim({ url }: { url: string }) {
  const { status, socket } = useSocket({ url });
  const [simState, setSimState] = useState<SimStateSchema>({
    tick: 0,
    deltatime: 0,
    timestamp: 0,
    bodies: new Map<string, BodyResponseSchema>(),
  });

  const [colors, setColors] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    if (status !== SocketStatus.CONNECTED || !socket.current) return;

    socket.current.on(Events.ROOM_USERS, (data) => {
      setColors(prev => {
        const next = new Map(prev);
        data.users.forEach((u: { id: string, color: string }) => {
          next.set(u.id, u.color);
        });
        return next;
      });
    });

    socket.current.on(Events.ROOM_JOIN, (data) => {
      console.log(data);
      if (data.userId && data.color) {
        setColors(prev => {
          const next = new Map(prev);
          next.set(data.userId, data.color);
          return next;
        });
      }
    });

    socket.current.on(Events.ROOM_LEAVE, (data) => {
      console.log(data)
    });

    socket.current.on(Events.SIM_STATE_BROADCAST, (data) => {
      const simState = {
        ...data,
        bodies: new Map(data.bodies)
      }

      setSimState(simState);
    });
  }, [url, status]);

  return {
    status,
    socket,
    simState,
    colors,
  };
}
