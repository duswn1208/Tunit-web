// src/auth/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api.ts';
import { requestFcmToken } from '../lib/firebase';
import { sendDeviceInfo } from '@/domain/home/api/notifications/notificationApi.ts';

type User = {
  userNo: number;
  name: string;
  nickname?: string;
  userRole?: { label: string; tutor?: boolean; student?: boolean; admin?: boolean };
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
        console.log('Auth check error:', error);
        if (!isPublicPath) {
          console.error('Auth check failed:', error);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  console.log('Current User:', user);

  // 로그인 후, 알림 권한이 허용된 경우에만 FCM 토큰 요청
  useEffect(() => {
    if (!user) return;

    let deviceInfo = {
      deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'ANDROID' : 'WEB',
      deviceId: localStorage.getItem('deviceId') || 'unknown',
      deviceModel: navigator.userAgent,
      osVersion: navigator.platform,
      appVersion: 'web',
    };

    if (Notification.permission === 'granted') {
      requestFcmToken().then((token) => {
        if (token) {
          sendDeviceInfo({ ...deviceInfo, fcmToken: token });
        }
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          requestFcmToken().then((token) => {
            if (token) {
              sendDeviceInfo({ ...deviceInfo, fcmToken: token });
            }
          });
        }
      });
    }
  }, [user, loading]);

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
