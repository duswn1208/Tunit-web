import HomeFeatures from '../components/HomeFeatures.tsx';
import HomeHeader from '../components/HomeHeader.tsx';
import HomeLessonTypeDesc from '../components/HomeLessonTypeDesc.tsx';
import HomeHowItWorks from '../components/HomeHowItWorks.tsx';
import HomeSampleTutors from '../components/HomeSampleTutors.tsx';
import HomeFaq from '../components/HomeFaq.tsx';
import HomeTrustBadges from '../components/HomeTrustBadges.tsx';
import HomeBottomCTA from '../components/HomeBottomCTA.tsx';
import TutorHome from '../components/TutorHome.tsx';
import { useAuth } from '@/shared/auth/AuthContext';

export default function HomePage() {
  // useLessonCheckAndRedirect();
  const { user, loading } = useAuth();

  // 인증 상태가 확정되기 전엔 분기 UI를 렌더하지 않아 깜빡임(reflow)을 방지
  // (서버 콜드 스타트 시 응답까지 수십 초 걸릴 수 있어 빈 화면 대신 로딩 안내를 표시)
  if (loading) {
    return (
      <section
        className="flex flex-col items-center justify-center gap-4 text-center"
        style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px', minHeight: '60vh' }}
      >
        <div
          className="animate-spin rounded-full"
          style={{
            width: 40,
            height: 40,
            border: '3px solid var(--border)',
            borderTopColor: 'var(--color-primary)',
          }}
        />
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          서버를 준비하고 있어요.
          <br />
          잠시만 기다려 주세요…
        </p>
      </section>
    );
  }

  if (user?.userRole?.tutor) {
    return (
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
        <TutorHome />
      </section>
    );
  }

  return (
    <section style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <HomeHeader />
      <HomeTrustBadges />
      <HomeHowItWorks />
      <HomeLessonTypeDesc />
      <HomeSampleTutors />
      <HomeFeatures />
      <HomeFaq />
      <HomeBottomCTA />
    </section>
  );
}
