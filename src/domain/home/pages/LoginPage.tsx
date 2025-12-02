import { useLocation } from 'react-router-dom';
import '../css/login.css';

export default function LoginPage() {
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSocialLogin = (provider: 'naver' | 'kakao' | 'google' | 'apple') => {
    const redirectUri = encodeURIComponent(from);
    window.location.href = `http://localhost:8080/oauth2/authorization/${provider}?redirect_uri=${redirectUri}`;
  };

  return (
    <div className="login-container">
      {/* 로고 이미지 */}
      <img src="/public/brand_logo.png" alt="Tunit Logo" className="login-logo" />

      {/* 메인 타이틀 */}
      <h1 className="login-title">
        간편하게 로그인하고
        <br />
        <span className="brand-text">튜닛</span>을 시작하세요!
      </h1>

      {/* 서브타이틀 */}
      <p className="login-subtitle">
        처음 방문하셨다면, 간단한 프로필 설정 후<br />
        바로 시작할 수 있어요!
      </p>

      {/* 소셜 로그인 버튼 */}
      <div className="social-login-buttons">
        <button
          onClick={() => handleSocialLogin('naver')}
          className="social-login-button naver-login-button"
        >
          <img src="/images/naver_login_icon.png" alt="Naver Icon" />
          네이버로 3초 만에 시작하기
        </button>

        <button
          onClick={() => handleSocialLogin('kakao')}
          className="social-login-button kakao-login-button"
        >
          <img src="/images/kakao_login_icon.png" alt="Kakao Icon" />
          카카오로 시작하기
        </button>

        <button
          onClick={() => handleSocialLogin('google')}
          className="social-login-button google-login-button"
        >
          <img src="/images/google-icon.png" alt="Google Icon" />
          Google로 시작하기
        </button>

        <button
          onClick={() => handleSocialLogin('apple')}
          className="social-login-button apple-login-button"
        >
          <img src="/images/apple-icon.png" alt="Apple Icon" />
          Apple로 시작하기
        </button>
      </div>

      {/* 추가 안내문구 */}
      <p className="login-notice">
        로그인 시 튜닛의 서비스 이용약관과
        <br />
        개인정보 처리방침에 동의하게 됩니다
      </p>
    </div>
  );
}
