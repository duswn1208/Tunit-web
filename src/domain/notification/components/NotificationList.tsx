import type { Notification } from '../types/notification';
import { useState } from 'react';
import { markNotificationRead } from '../api/notificationApi.ts';
import { useNavigate } from 'react-router-dom';

interface NotificationListProps {
  notifications: Notification[];
}

export default function NotificationList({ notifications }: NotificationListProps) {
  const [localList, setLocalList] = useState(notifications);
  const navigate = useNavigate();

  const handleRead = async (notifyNo: number) => {
    await markNotificationRead(notifyNo);
    setLocalList((list) =>
      list.map((n) => (n.notifyNo === notifyNo ? { ...n, status: 'READ' } : n))
    );
  };
  const handleGo = async (notifyNo: number, deepLink?: string) => {
    await markNotificationRead(notifyNo);
    setLocalList((list) =>
      list.map((n) => (n.notifyNo === notifyNo ? { ...n, status: 'READ' } : n))
    );
    if (deepLink) navigate(deepLink);
  };

  return (
    <div>
      <ul className="divide-y divide-gray-200">
        {localList.map((n) => (
          <li
            key={n.notifyNo}
            className={`p-4 hover:bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-2 ${
              n.status === 'READ' ? 'text-gray-400' : 'text-black'
            }`}
          >
            <div>
              <div className="font-semibold text-base flex items-center gap-2">
                {n.title}
                {n.status !== 'READ' && (
                  <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <div className="text-sm mt-1">{n.message}</div>
              <div className="text-xs mt-1">{new Date(n.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button
                className={`px-2 py-1 text-xs rounded border ${
                  n.status === 'READ'
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-white text-blue-600 border-blue-400 hover:bg-blue-50'
                }`}
                disabled={n.status === 'READ'}
                onClick={() => handleRead(n.notifyNo)}
              >
                읽음
              </button>
              {n.deepLink && (
                <button
                  className="px-2 py-1 text-xs rounded bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() => handleGo(n.notifyNo, n.deepLink)}
                >
                  확인하러 가기
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
