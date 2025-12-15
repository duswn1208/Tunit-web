import { useEffect, useState } from 'react';
import { fetchAllNotifications } from '../api/notificationApi';
import NotificationList from '../components/NotificationList';
import type { Notification } from '../types/notification';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAllNotifications()
      .then(setNotifications)
      .catch((e) => setError(e.message || '알림을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4 flex items-center gap-2">
        모든 알림
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs font-bold rounded px-2 py-0.5">
            {unreadCount}
          </span>
        )}
      </h1>
      {loading && <div>로딩 중...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && <NotificationList notifications={notifications} />}
    </div>
  );
}
