import ProfileInfo from '../../profile/components/ProfileInfo';
import StudentRegister from './StudentRegister';
import { useAuth } from '@/shared/auth/AuthContext';
import { useProfileData } from '../hooks/useProfileData';

export default function ProfileSection() {
  const { user } = useAuth();
  const { profileData, isLoading, error } = useProfileData();

  if (isLoading) {
    return (
      <div className="profile-section">
        <h2 className="section-title">기본 소개</h2>
        <div className="section-content">
          <div className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="profile-section">
        <h2 className="section-title">기본 소개</h2>
        <div className="section-content">
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              프로필 정보를 불러올 수 없습니다
            </h3>
            <p className="mt-1 text-sm text-gray-500">잠시 후 다시 시도해주세요</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-section">
      <h2 className="section-title">기본 소개</h2>
      <div className="section-content">
        <ProfileInfo />
        {user?.userRole === 'TUTOR' && <StudentRegister />}
      </div>
    </div>
  );
}
