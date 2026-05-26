import { useRef, useState } from "react";
import { useAuthStore } from "~/features/auth/auth.store";
import { useSimulationContext } from "./simulation-provider";
import NotificationBadge from "./notification-badge";
import useSSE from "../sim.sse";

export default function NotificationList() {
  const { isLoading } = useAuthStore();
  const { currentRoom } = useSimulationContext();

  const [notifications, setNotifications] = useState<any[]>([]);

  useSSE({
    roomId: currentRoom,
    onMessage: (data) => {
      console.log("Received SSE message:", data);

      setNotifications((prev) => [
        ...prev,
        (data as any).payload,
      ]);
    },
  });

  return (
    <div
      id="notification-list"
      style={{
        position: "fixed",
        top: 8,
        bottom: 8,
        left: 8,
        width: 280,
        display: "flex",
        flexDirection: "column-reverse",
        overflow: "hidden",
        border: "1px solid transparent",
        backgroundColor: "transparent",
        opacity: isLoading ? 0.5 : 1,
      }}
    >
      <NotificationBadge fullname="John Doe" hasJoined={true} />

      {notifications.map((n, i) => (
        <NotificationBadge
          key={i}
          fullname={n.fullname}
          hasJoined={n.hasJoined}
        />
      ))}
    </div>
  );
}
