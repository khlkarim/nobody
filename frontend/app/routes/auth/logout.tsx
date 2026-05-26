import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '~/features/auth/auth.store';

export default function LogoutPage() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    logout();
    navigate('/auth/login', { replace: true });
  }, [logout, navigate]);

  return null;
}