import { useAuthStore } from "~/features/auth/auth.store";
import { Protect } from "~/features/auth/components/protect";
import { UserProfile } from "~/features/users/components/user-profile";

export default function Profile() {
  const { user } = useAuthStore();

  return (
    <Protect>
      <div
        style={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {user && <UserProfile user={user} />}
      </div>
    </Protect>
  )
};