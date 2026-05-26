import { io, type Socket } from "socket.io-client";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "~/features/auth/auth.store";

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

    const token = useAuthStore.getState().token;

    const socket = io(url, {
      auth: {
        token
      }
    });
    socketRef.current = socket;
    setStatus(SocketStatus.CONNECTING);

    socket.on("connect", () => setStatus(SocketStatus.CONNECTED));
    socket.on("disconnect", () => setStatus(SocketStatus.DISCONNECTED));
    socket.on("error", (err) => {
      console.error("Socket error:", err);
      setStatus(SocketStatus.DISCONNECTED);
    });
  }, [url]);

  return {
    status,
    socket: socketRef
  };
}
