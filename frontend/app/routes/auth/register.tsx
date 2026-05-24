import RegisterForm from "~/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <RegisterForm />
    </div>
  );
}
