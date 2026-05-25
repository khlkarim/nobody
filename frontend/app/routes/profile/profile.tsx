import { Protect } from "~/features/auth/components/protect";
import ProfilePage from "~/features/users/components/profilepage";

export function meta() {
  return [
    { title: " Profile " },
  ];
}

export default function Profile() {
  return (
    <Protect>
      <ProfilePage />
    </Protect>
  );
}