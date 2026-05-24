import { io, type Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";

export enum SocketStatus {
  CONNECTED = "connected",
  CONNECTING = "connecting",
  DISCONNECTED = "disconnected",
}

export function useSocket({ url }: { url: string }) {
  const socketRef = useRef<Socket | null>(null);
  const [status, setStatus] = useState<SocketStatus>(SocketStatus.DISCONNECTED);

  useEffect(() => {
    if (socketRef.current?.connected) return;

    const socket = io(url);
    socketRef.current = socket;
    setStatus(SocketStatus.CONNECTING);

    socket.on("connect", () => setStatus(SocketStatus.CONNECTED));
    socket.on("disconnect", () => setStatus(SocketStatus.DISCONNECTED));
  }, [url]);

  return {
    status,
    socket: socketRef
  };
}
