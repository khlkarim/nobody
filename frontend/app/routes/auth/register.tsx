import { Allow } from "~/features/auth/components/allow";
import RegisterForm from "~/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      <Allow>
        <RegisterForm />
      </Allow>
    </div>
  );
}
