export default function LoginPage() {
  const naverLogin = () => {
    // Spring Security OAuth2 엔드포인트 (백엔드 프록시: vite.config.ts에 /oauth2 프록시 설정)
    window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
  };

  return (
    <div style={{ maxWidth: 360, margin: '120px auto', textAlign: 'center', padding: '0 16px' }}>
      <h1 style={{ marginBottom: 16 }}>네이버로 로그인</h1>
      <p style={{ opacity: 0.8, marginBottom: 24 }}>로그인 후 처음이라면 온보딩으로 이동합니다.</p>
      <button onClick={naverLogin} style={{ width: '100%', height: 48 }}>
        네이버 로그인
      </button>
    </div>
  );
}
