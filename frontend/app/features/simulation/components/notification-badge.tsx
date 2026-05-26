type NotificationBadgeProps = {
  username: string;
  hasJoined: boolean;
};

export default function NotificationBadge({
  username,
  hasJoined,
}: NotificationBadgeProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,

        padding: 8,
        margin: 4,
        marginBottom: 8,

        border: "2px solid white",

        color: "white",
        backgroundColor: "black",
      }}
    >
      <div>
        <div style={{ fontWeight: "bold" }}>{username}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {hasJoined ? "has joined the server" : "has left the server"}
        </div>
      </div>
    </div>
  );
}