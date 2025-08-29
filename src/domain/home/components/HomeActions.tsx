import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomeActions() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 실제 구현에서는 세션/쿠키/스토리지 등으로 로그인 여부 확인
    // 여기서는 accessToken이 있으면 로그인된 것으로 예시
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, []);

  const handleLogout = () => {
    // 실제 구현에서는 토큰/세션 삭제 및 로그아웃 API 호출 필요
    localStorage.removeItem('accessToken');
    window.location.reload();
  };

  return (
    <div style={{ marginTop: 24, display: 'flex', gap: 12, position: 'relative' }}>
      {!isLoggedIn && (
        <Link to="/auth/login">
          <button style={{ height: 44, padding: '0 16px' }}>시작하기 (네이버 로그인)</button>
        </Link>
      )}
      <Link to="/mypage">
        <button style={{ height: 44, padding: '0 16px' }}>마이페이지</button>
      </Link>
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          style={{
            position: 'fixed',
            right: 24,
            bottom: 24,
            fontSize: 13,
            padding: '6px 14px',
            borderRadius: 16,
            background: '#eee',
            border: '1px solid #ccc',
            zIndex: 1000,
            opacity: 0.85,
          }}
        >
          로그아웃
        </button>
      )}
    </div>
  );
}
