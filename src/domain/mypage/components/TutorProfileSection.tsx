import ProfileInfo from '../../profile/components/ProfileInfo';
import { useState } from 'react';
import TutorProfileEditModal from './TutorProfileEditModal';
import FaqRegisterModal from './FaqRegisterModal';
import StudentRegister from './StudentRegister';
import { useAuth } from '@/shared/auth/AuthContext';
import { useProfileData } from '../hooks/useProfileData';
import { HiUserCircle } from 'react-icons/hi';
import Button from '@/shared/components/Button';
import { api } from '@/shared/lib/api';
import { useToast } from '@/shared/contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

export default function TutorProfileSection() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const { profileData, isLoading, error, refetch } = useProfileData();
  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <HiUserCircle className="text-blue-500 text-xl mr-2" />
          <h2 className="text-base font-bold text-gray-800">기본 소개</h2>
        </div>
        <div className="animate-pulse space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-1"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <HiUserCircle className="text-blue-500 text-xl mr-2" />
          <h2 className="text-base font-bold text-gray-800">기본 소개</h2>
        </div>
        <div className="flex flex-col items-center py-4">
          <svg
            className="mx-auto h-8 w-8 text-gray-300"
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
          <h3 className="mt-2 text-sm font-semibold text-gray-700">
            프로필 정보를 불러올 수 없습니다
          </h3>
          <p className="mt-1 text-xs text-gray-500">잠시 후 다시 시도해주세요</p>
        </div>
      </div>
    );
  }

  const handleProfileModify = async (data: any) => {
    try {
      await api.post('/api/tutor/profile', data);
      showToast('프로필 정보가 변경되었습니다.', 'success');
      setEditOpen(false);
      await refetch();
    } catch (error) {
      showToast(error?.message || '프로필 변경에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="mb-4">
      <div className="flex items-center mb-2 justify-between">
        <div className="flex items-center">
          <HiUserCircle className="text-blue-500 text-xl mr-2" />
          <h2 className="text-base font-bold text-gray-800">기본 소개</h2>
        </div>
        <div className="flex gap-1">
          <Button
            size="xs"
            className="min-w-0 px-2 py-0.5 text-xs h-6"
            onClick={() => setEditOpen(true)}
          >
            정보 수정
          </Button>
          <Button
            size="xs"
            className="min-w-0 px-2 py-0.5 text-xs h-6"
            onClick={() => navigate('/mypage/tutor/career-history')}
          >
            경력 관리
          </Button>
          <Button
            size="xs"
            className="min-w-0 px-2 py-0.5 text-xs h-6"
            onClick={() =>
              navigate('/mypage/tutor/faq', { state: { faqData: profileData?.faqData } })
            }
          >
            FAQ 관리
          </Button>
        </div>
      </div>
      <ProfileInfo profile={profileData} />
      {user?.userRole?.tutor && <StudentRegister />}
      {editOpen && (
        <TutorProfileEditModal
          profile={profileData}
          onSave={handleProfileModify}
          onClose={() => setEditOpen(false)}
        />
      )}
    </div>
  );
}
