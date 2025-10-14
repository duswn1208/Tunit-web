import HomeFeatures from '../components/HomeFeatures.tsx';
import HomeActions from '../components/HomeActions.tsx';
import HomeHeader from '../components/HomeHeader.tsx';

export default function HomePage() {
  // useLessonCheckAndRedirect();
  return (
    <section style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
      <HomeHeader />
      <HomeActions />
      <HomeFeatures />
    </section>
  );
}
