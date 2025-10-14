export default function LoginPage() {
  const naverLogin = async () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/naver';
    // window.location.href = 'http://172.21.25.92:8080/oauth2/authorization/naver';
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
