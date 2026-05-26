import { toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router';
import { type FormEvent, useState } from 'react';
import { useAuthStore } from '~/features/auth/auth.store';
import { ERROR_MESSAGES } from '../auth.schema';

export default function RegisterForm() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
      });

      navigate('/auth/login');
    } catch (err: any) {
      if (err.issues) {
        toast.error(err.issues[0].message);
      } else if (err.response?.data?.errors) {
        for (const code of Object.values(err.response.data.errors) as string[]) {
          toast.error(ERROR_MESSAGES[code] ?? code);
        }
      } else {
        toast.error('failed to register');
      }
      console.log('Failed to register', err);
    }
  }

  return (
    <form className='box' onSubmit={handleSubmit}>
      <input
        type="text"
        className='box'
        placeholder="first name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        type="text"
        className='box'
        placeholder="last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

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
        {isLoading ? 'Loading...' : 'register'}
      </button>

      <p style={{ color: 'grey', fontSize: 12 }}>
        already have an account?{' '}
        <Link to="/auth/login" style={{ color: 'white' }}>
          <u>login here</u>
        </Link>
      </p>
    </form>
  );
}
