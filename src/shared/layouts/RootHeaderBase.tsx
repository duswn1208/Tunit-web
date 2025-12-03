import { useState } from 'react';
import { Link } from 'react-router-dom';
import '@/shared/css/layouts/header.css';
import { useAuth } from '@/shared/auth/AuthContext.tsx';
import { NotificationBell } from '@/shared/components';

export default function RootHeaderBase({ nav }: { nav: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  let closeTimer: NodeJS.Timeout | null = null;

  const handleMenuMouseEnter = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  };

  const handleMenuMouseLeave = () => {
    closeTimer = setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="brand">
          튜닛
        </Link>
        {user?.userRole && nav}
        <div className="right">
          {!loading && (
            <>
              {user?.userRole ? (
                <div className="user">
                  <NotificationBell />
                  <button className="avatar" onClick={() => setOpen(!open)}>
                    {user.nickname ?? user.name}
                  </button>
                  {open && (
                    <div
                      className="menu"
                      onMouseEnter={handleMenuMouseEnter}
                      onMouseLeave={handleMenuMouseLeave}
                    >
                      <div className="menu__name">{user.nickname ?? user.name}</div>
                      <Link to="/mypage">마이페이지</Link>
                      <button onClick={logout}>로그아웃</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/auth/login" className="login-button">
                    로그인
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
