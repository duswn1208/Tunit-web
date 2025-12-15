// 알림 관련 API

import { api } from '@/shared/lib/api';

export interface Notification {
  id: number;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface DeviceTokenPayload {
  fcmToken: string;
  deviceType: string;
  deviceId: string;
  deviceModel: string;
  osVersion: string;
  appVersion: string;
}

// 로그인 성공 후 호출: fcmToken 등 전달
export const sendDeviceInfo = async (payload: DeviceTokenPayload) => {
  try {
    await api.post('/api/notifications/device-token', payload);
  } catch (e) {
    console.error('디바이스 토큰 전송 실패:', e);
  }
};
