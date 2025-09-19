// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

type User = {
  userNo: number;
  name: string;
  nickname?: string;
  userRole?: 'student' | 'tutor';
} | null;
type AuthCtx = { user: User; loading: boolean; login: () => void; logout: () => Promise<void> };

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/api/users/auth/me', { credentials: 'include' })
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    // 필요에 맞게 프로바이더 선택(예: 네이버)
    window.location.href = '/oauth2/authorization/naver';
  };

  const logout = async () => {
    api('/api/users/logout', { method: 'POST', credentials: 'include' }).then(() => {
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
