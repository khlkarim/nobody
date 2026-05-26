import { Allow } from '~/features/auth/components/allow';
import LoginForm from '~/features/auth/components/login-form';

export default function LoginPage() {
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
        <LoginForm />
      </Allow>
    </div>
  );
}
