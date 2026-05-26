import { useNavigate } from "react-router";
import { useAuthStore } from "../auth.store";
import { useEffect, type ReactNode } from "react";

interface AllowProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const Allow = ({ children, fallback = null }: AllowProps) => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
    if (isLoading) return;

    if (isAuthenticated) {
      navigate("/");
    }
  }, [isHydrated, isLoading, isAuthenticated, navigate]);

  if (!isHydrated) return null;
  if (isLoading) return fallback;
  if (isAuthenticated) return null;

  return <>{children}</>;
};
