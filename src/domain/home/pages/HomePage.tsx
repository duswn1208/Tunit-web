import HomeFeatures from '../components/HomeFeatures.tsx';
import HomeActions from '../components/HomeActions.tsx';
import HomeHeader from '../components/HomeHeader.tsx';
import HomeLessonTypeDesc from '../components/HomeLessonTypeDesc.tsx';

export default function HomePage() {
  // useLessonCheckAndRedirect();
  return (
    <section style={{ maxWidth: 800, margin: '0 auto', padding: '24px 16px' }}>
      <HomeHeader />
      <HomeActions />
      <HomeLessonTypeDesc />
      <HomeFeatures />
    </section>
  );
}
