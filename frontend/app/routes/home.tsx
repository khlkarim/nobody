import { Welcome } from "../welcome/welcome";
import { Protect } from "../features/auth/components/protect";

export default function Home() {
  return (
    <Protect>
      <Welcome />
    </Protect>
  );
}
