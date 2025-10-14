import ProfileInfo from '../../profile/components/ProfileInfo.tsx';
import StudentRegister from '../components/StudentRegister.tsx';
import MyPageLayout from '../components/MyPageLayout.tsx';

export default function MyPage() {
  return (
    <MyPageLayout subtitle="기본 소개">
      <ProfileInfo />
      <StudentRegister />
    </MyPageLayout>
  );
}
