import MyPageLayout from '../components/MyPageLayout.tsx';
import ProfileSection from '../components/ProfileSection';
import MyLessonSection from '../components/MyLessonSection';

export default function MyPage() {
  return (
    <MyPageLayout>
      <ProfileSection />
      <MyLessonSection />
    </MyPageLayout>
  );
}
