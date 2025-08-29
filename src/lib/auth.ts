import { useEffect, useState } from 'react';
import { api } from './api';

export type MeResp = {
  authenticated: boolean;
  userRole: 'TUTOR' | 'STUDENT' | 'NONE';
  onboardingDone?: boolean;
};

export async function getMe(): Promise<MeResp> {
  try {
    return await api<MeResp>('/api/users/auth/me', { method: 'GET' });
  } catch {
    return { authenticated: false, userRole: 'NONE' };
  }
}

// 로그인된 사용자만 접근 가능한 페이지에서 공통적으로 사용할 수 있는 훅
export function useRequireAuth(options?: {
  requiredRole?: MeResp['userRole'];
  redirectTo?: string;
}) {
  const [me, setMe] = useState<MeResp | null>(null);
  useEffect(() => {
    (async () => {
      const user = await getMe();
      alert(JSON.stringify(user));
      if (!user || (typeof user === 'object' && Object.keys(user).length === 0)) {
        window.location.replace('/auth/login');
        return;
      }
      alert(JSON.stringify(options));
      if (options?.requiredRole && user.userRole !== options.requiredRole) {
        window.location.replace(options.redirectTo || '/');
        return;
      }
      setMe(user);
    })();
  }, []);
  return me;
}
