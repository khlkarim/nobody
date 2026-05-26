type NotificationBadgeProps = {
  fullname: string;
  hasJoined: boolean;
};

export default function NotificationBadge({
  fullname,
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

        border: "1px solid white",

        color: "white",
        backgroundColor: "black",
      }}
    >
      <div>
        <div>{fullname}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {hasJoined ? "has joined the server" : "has left the server"}
        </div>
      </div>
    </div>
  );
}
