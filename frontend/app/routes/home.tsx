import { redirect } from "react-router";
import { useAuthStore } from "../features/auth/auth.store";
import { Protect } from "../features/auth/components/protect";
import { Welcome } from "../welcome/welcome";

export function loader() {
  const token = useAuthStore.getState().token;

  if (!token) {
    return redirect("/auth/login");
  }

  return redirect("/rooms");
}

export default function Home() {
  return (
    <Protect>
      <Welcome />
    </Protect>
  );
}
