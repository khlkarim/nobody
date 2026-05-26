import { useAuthStore } from "~/features/auth/auth.store";
import { Protect } from "~/features/auth/components/protect";
import { EditProfile } from "~/features/users/components/edit-profile";

export default function Edit() {
  const { user } = useAuthStore();

  return (
    <Protect>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {user && <EditProfile user={user} />}
      </div>
    </Protect>
  );
};