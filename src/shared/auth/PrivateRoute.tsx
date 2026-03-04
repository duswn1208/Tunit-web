import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useToast } from '@/shared/contexts/ToastContext';

export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { showToast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      showToast('로그인이 필요한 서비스입니다.', 'info');
    }
  }, [loading, user]);

  if (loading) return null;
  if (!user) return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;

  return <>{children}</>;
}
