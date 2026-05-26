import { Navbar } from "~/components/navbar";
import { useAuthStore } from "~/features/auth/auth.store";
import { Protect } from "~/features/auth/components/protect";
import { UserProfile } from "~/features/users/components/user-profile";

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <div style={{
      paddingTop: 32,
      paddingLeft: 48,
      paddingRight: 48,
    }}>
      <Protect>
        <Navbar />
        <div
          style={{
            paddingTop: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {user && <UserProfile user={user} />}
        </div>
      </Protect>
    </div>
  )
};
