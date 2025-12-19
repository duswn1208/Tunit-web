import { useAuth } from '@/shared/auth/AuthContext.tsx';
import MyPageLayout from '../components/MyPageLayout.tsx';
import TutorProfileSection from '../components/TutorProfileSection.tsx';
import StudentProfileSection from '../components/StudentProfileSection.tsx';

export default function MyPage() {
  const { user } = useAuth();
  return (
    <MyPageLayout>
      {user?.userRole?.tutor && <TutorProfileSection />}
      {user?.userRole?.student && <StudentProfileSection />}
    </MyPageLayout>
  );
}
