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
  if (loading) {
    return <section style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }} />;
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
