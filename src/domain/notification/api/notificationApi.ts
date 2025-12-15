import { api } from '@/shared/lib/api';
import type { Notification } from '../types/notification';
// 읽지 않은 모든 알림 조회
export async function fetchUnreadNotifications(): Promise<Notification[]> {
  return api.get<Notification[]>('/api/notifications', { params: { read: false } });
}

export async function fetchAllNotifications(): Promise<Notification[]> {
  return api.get<Notification[]>('/api/notifications');
}

export async function markNotificationRead(notifyNo: number) {
  return api.put(`/api/notifications/${notifyNo}/read`);
}

export async function fetchUnreadNotificationCount(): Promise<number> {
  return await api.get<number>('/api/notifications/unread-count');
}
