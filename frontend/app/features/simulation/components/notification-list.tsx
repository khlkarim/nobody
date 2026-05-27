import { useRef, useState } from "react";
import { useAuthStore } from "~/features/auth/auth.store";
import { useSimulationContext } from "./simulation-provider";
import NotificationBadge from "./notification-badge";
import useSSE from "../sim.sse";
import { useUsers } from "../user-list.store";

export default function NotificationList() {
  const { isLoading } = useAuthStore();
  const { currentRoom } = useSimulationContext();

  const { refresh } = useUsers();
  const [notifications, setNotifications] = useState<any[]>([]);

  useSSE({
    roomId: currentRoom,
    onMessage: (data) => {
      refresh(currentRoom);

      setNotifications((prev) => [...prev, data]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n !== data));
      }, 4000);
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
      {notifications.map((n, i) => {
        return (
          <NotificationBadge
            key={i}
            fullname={n.payload.fullName}
            hasJoined={n.payload.hasJoined}
          />
        );
      })}
    </div>
  );
}
