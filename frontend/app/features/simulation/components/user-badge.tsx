type UserBadgeProps = {
  username: string;
  bodycount: number;
  image: string;
};

export default function UserBadge({
  username,
  bodycount,
  image,
}: UserBadgeProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,

        padding: 10,
        margin: 4,
        marginBottom: 8,

        border: "1px solid white",

        color: "white",
        backgroundColor: "black",
      }}
    >
      {/*<img
        src={image}
        alt={username}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          objectFit: "cover",
        }}
      />*/}

      <div>
        <div>{username}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {bodycount} bodies
        </div>
      </div>
    </div>
  );
}
