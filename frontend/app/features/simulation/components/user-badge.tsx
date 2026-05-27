import { useNavigate } from "react-router";
import { useAuthStore } from "~/features/auth/auth.store";

type UserBadgeProps = {
  username: string;
  bodycount: number;
  icon: string;
  color: string;
};

export default function UserBadge({
  username,
  bodycount,
  icon,
  color
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
      <div
        style={{
          backgroundColor: color,
          maskImage: `url(/icons/${icon}.svg)`,
          WebkitMaskImage: `url(/icons/${icon}.svg)`,
          maskRepeat: 'no-repeat',
          maskPosition: 'center',
          maskSize: 'contain',
          width: 24,   // set to your icon's size
          height: 24,
        }}
      />
      <div>
        <div>{username}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          {bodycount} bodies
        </div>
      </div>
    </div>
  );
}
