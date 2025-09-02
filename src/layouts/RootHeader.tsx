// src/components/Header.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/layouts/header.css';
import { useAuth } from '../auth/AuthContext';

export default function RootHeader() {
  const { user, loading, login, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="brand">
          튜닛
        </Link>
        <nav className="nav">
          <Link to="/mypage">마이페이지</Link>
          <Link to="/my/lessons">레슨관리</Link>
        </nav>

        <div className="right">
          {loading ? null : user ? (
            <div className="user">
              <button className="avatar" onClick={() => setOpen(!open)}>
                {user.nickname ?? user.name}
              </button>
              {open && (
                <div className="menu" onMouseLeave={() => setOpen(false)}>
                  <div className="menu__name">{user.nickname ?? user.name}</div>
                  <Link to="/my">마이페이지</Link>
                  <button onClick={logout}>로그아웃</button>
                </div>
              )}
            </div>
          ) : (
            <button className="login" onClick={login}>
              로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
