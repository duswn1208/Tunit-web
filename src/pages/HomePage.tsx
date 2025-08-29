import HomeFeatures from '../domain/home/components/HomeFeatures';
import HomeActions from '../domain/home/components/HomeActions';
import HomeHeader from '../domain/home/components/HomeHeader';
import { useLessonCheckAndRedirect } from '../domain/home/hooks/useLessonCheckAndRedirect';

export default function HomePage() {
  useLessonCheckAndRedirect();
  return (
    <section style={{ maxWidth: 600, margin: '0 auto', padding: '24px 16px' }}>
      <HomeHeader />
      <HomeActions />
      <HomeFeatures />
    </section>
  );
}
