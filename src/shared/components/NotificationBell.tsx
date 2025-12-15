import { useEffect, useState, useRef } from 'react';
import './notification-bell.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-regular-svg-icons';
import { fetchUnreadNotificationCount } from '@/domain/notification/api/notificationApi';
import { api } from '@/shared/lib/api';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const [count, setCount] = useState<number>(0);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();
  const popupRef = useRef<HTMLDivElement>(null);
  // 팝업 외부 클릭 시 닫힘
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    fetchUnreadNotificationCount()
      .then(setCount)
      .catch(() => setCount(0));
  }, []);

  const handleClick = async () => {
    if (count > 0) {
      try {
        const list = await api.get<any[]>('/api/notifications/unread');
        setNotifications(list);
        console.log('Fetched Notifications:', list);
        setOpen(true);
      } catch (e) {
        setNotifications([]);
        setOpen(false);
      }
    }
  };

  // 상단 버튼 핸들러
  const handleViewAll = () => {
    navigate('/notifications');
    setOpen(false);
  };
  const handleReadAll = async () => {
    try {
      await api.post('/api/notifications/read-all');
      setNotifications([]);
      setCount(0);
      setOpen(false);
    } catch (e) {}
  };
  const handleDeleteAll = async () => {
    try {
      await api.post('/api/notifications/delete-all');
      setNotifications([]);
      setCount(0);
      setOpen(false);
    } catch (e) {}
  };

  // 개별 읽음 처리
  const handleReadOne = async (notification: any) => {
    try {
      await api.put(`/api/notifications/${notification.notifyNo}/read`);
      setNotifications((prev) => prev.filter((n) => n.notifyNo !== notification.notifyNo));
      setCount((prev) => Math.max(prev - 1, 0));
      console.log('Navigating to:', notification.deepLink || '/notifications');
      navigate(notification.deepLink || '/notifications');
    } catch (e) {}
  };

  return (
    <div className="notification-bell">
      <span
        role="img"
        aria-label="알림"
        onClick={handleClick}
        className={count > 0 ? 'clickable' : ''}
      >
        <FontAwesomeIcon icon={faBell} className="text-2xl text-gray-500" />
      </span>
      {count >= 10 && <span className="notification-count">'10+'</span>}
      {count < 10 && count > 0 && <span className="notification-count">{count}</span>}
      {open && notifications.length > 0 && (
        <div className="notification-list-popup" ref={popupRef}>
          <ul>
            {notifications.map((n) => (
              <li onClick={() => handleReadOne(n)} key={n.notifyNo}>
                {n.title}
              </li>
            ))}
          </ul>

          <div className="notification-list-actions">
            <button onClick={handleViewAll}>전체 보기</button>
            <button onClick={handleReadAll}>모두 읽음</button>
            <button onClick={handleDeleteAll}>모두 삭제</button>
          </div>
        </div>
      )}
    </div>
  );
}
