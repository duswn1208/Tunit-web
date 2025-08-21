import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ maxWidth: 800, margin: '80px auto', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 12 }}>튜닛 (Tunit)</h1>
      <p style={{ opacity: 0.8 }}>
        1:1 악기 레슨 예약을 간단하게. 튜터는 웹에서 프로필과 가능한 시간만 등록하세요.
      </p>

      <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
        <Link to="/auth/login">
          <button style={{ height: 44, padding: '0 16px' }}>시작하기 (네이버 로그인)</button>
        </Link>
        <Link to="/mypage">
          <button style={{ height: 44, padding: '0 16px' }}>마이페이지</button>
        </Link>
      </div>

      <section style={{ marginTop: 40 }}>
        <h2>주요 기능</h2>
        <ul>
          <li>네이버 간편 로그인</li>
          <li>튜터 온보딩(지역/가능시간/휴무일)</li>
          <li>마이페이지 조회</li>
        </ul>
      </section>
    </div>
  );
}
