import ProfileInfo from '../domain/mypage/components/ProfileInfo';
import StudentRegister from '../domain/mypage/components/StudentRegister';
import MyPageLayout from '../domain/mypage/components/MyPageLayout';

export default function MyPage() {
  return (
    <MyPageLayout subtitle="기본 소개">
      <ProfileInfo />
      <StudentRegister />
    </MyPageLayout>
  );
}
