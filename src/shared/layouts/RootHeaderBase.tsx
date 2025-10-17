import { useState } from 'react';
import { Link } from 'react-router-dom';
import '@/shared/css/layouts/header.css';
import { useAuth } from '@/shared/auth/AuthContext.tsx';

export default function RootHeaderBase({ nav }: { nav: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="brand">
          튜닛
        </Link>
        {user?.userRole && nav}
        <div className="right">
          {!loading && user?.userRole && (
            <div className="user">
              <button className="avatar" onClick={() => setOpen(!open)}>
                {user.nickname ?? user.name}
              </button>
              {open && (
                <div className="menu" onMouseLeave={() => setOpen(false)}>
                  <div className="menu__name">{user.nickname ?? user.name}</div>
                  <Link to="/mypage">마이페이지</Link>
                  <button onClick={logout}>로그아웃</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
