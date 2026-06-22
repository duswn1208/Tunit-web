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
  const { user } = useAuth();

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
