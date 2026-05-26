import { toast } from 'react-hot-toast';
import { ERROR_MESSAGES } from '../auth.schema';
import { Link, useNavigate } from 'react-router';
import { type FormEvent, useState } from 'react';
import { useAuthStore } from '~/features/auth/auth.store';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      if (err.issues) {
        toast.error(err.issues[0].message);
      } else if (err.response?.data?.errors) {
        for (const code of Object.values(err.response.data.errors) as string[]) {
          toast.error(ERROR_MESSAGES[code] ?? code);
        }
      } else {
        toast.error('failed to login');
      }
      console.log('Login failed', err);
    }
  }

  return (
    <form className='box' onSubmit={handleSubmit}>
      <input
        type="email"
        className='box'
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        className='box'
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        type="submit"
        className='box'
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'login'}
      </button>

      <p style={{ color: 'grey', fontSize: 12 }}>
        don't have an account?{' '}
        <Link to="/auth/register" style={{ color: 'white' }}>
          <u>register here</u>
        </Link>
      </p>
    </form>
  );
}
