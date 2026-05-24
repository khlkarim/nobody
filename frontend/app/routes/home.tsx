import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Protect } from "~/features/auth/components/protect";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "nobody" },
  ];
}

export default function Home() {
  return (
    <Protect>
      <Welcome />
    </Protect>
  );
}
