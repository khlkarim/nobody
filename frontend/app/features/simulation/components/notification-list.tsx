import { useAuthStore } from "~/features/auth/auth.store";
import NotificationBadge from "./notification-badge";

export default function NotificationList() {
	const { isLoading } = useAuthStore();
	
	return <>
    <div
      style={{
        position: "fixed",
        top: 8,
        bottom: 8,
        left: 8,

        width: 280,

        display: "flex",
        flexDirection: "column-reverse",

        overflow: "hidden",
        border: "2px solid transparent",
        backgroundColor: "transparent",
      
        opacity: isLoading ? 0.5 : 1
      }}
    >
      <NotificationBadge username="John Doe" hasJoined={true} />
      <NotificationBadge username="Jane Doe" hasJoined={false} />
      <NotificationBadge username="Jordan Doe" hasJoined={true} />
    </div>
  </>;
}