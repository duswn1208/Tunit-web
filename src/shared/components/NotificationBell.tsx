import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { fetchUnreadNotificationCount } from '@/domain/home/api/notifications/notificationApi';

export default function NotificationBell() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    fetchUnreadNotificationCount()
      .then(setCount)
      .catch(() => setCount(0));
  }, []);

  console.log('Unread notification count:', count);

  return (
    <div className="notification-bell">
      <span role="img" aria-label="알림">
        <FontAwesomeIcon icon={faBell} className="text-2xl text-gray-500" />
      </span>
      {count >= 10 && <span className="notification-count">'10+'</span>}
      {count < 10 && count > 0 && <span className="notification-count">{count}</span>}
    </div>
  );
}
