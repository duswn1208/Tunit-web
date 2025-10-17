// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.ts';

type User = {
  userNo: number;
  name: string;
  nickname?: string;
  userRole?: 'STUDENT' | 'TUTOR';
} | null;
type AuthCtx = { user: User; loading: boolean; login: () => void; logout: () => Promise<void> };

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 메인 페이지와 로그인 페이지에서는 로그인 체크를 조용히 처리
    const isPublicPath = ['/', '/auth/login'].includes(window.location.pathname);

    api
      .get('/api/users/auth/me')
      .then(setUser)
      .catch((error) => {
        if (!isPublicPath) {
          console.error('Auth check failed:', error);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    // 필요에 맞게 프로바이더 선택(예: 네이버)
    window.location.href = '/oauth2/authorization/naver';
  };

  const logout = async () => {
    api.post('/api/users/logout').then(() => {
      setUser(null);
      window.location.href = '/'; // 세션 정리 후 홈으로
    });
  };

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error('AuthProvider missing');
  return v;
};
