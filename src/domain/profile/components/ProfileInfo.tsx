import { useEffect, useState } from 'react';
import { api } from '../../../shared/lib/api.ts';
import { HiUser, HiIdentification, HiCalendar, HiChatAlt2 } from 'react-icons/hi';

export default function ProfileInfo() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api.get('/api/users/profile/me').then(setProfile);
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-4 max-w-lg mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
          {profile?.userRole?.label}
        </span>
        <HiUser className="text-gray-400 text-lg" />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <HiIdentification className="text-gray-400 text-base" />
          <span className="font-medium text-gray-700">{profile.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <HiChatAlt2 className="text-gray-400 text-base" />
          <span className="text-gray-700">{profile.nickname}</span>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <HiCalendar className="text-gray-400 text-base" />
          <span className="text-gray-700">
            가입일: {profile.createdAt ? profile.createdAt.split('T')[0] : '-'}
          </span>
        </div>
      </div>
      <hr className="my-4" />
      {/* 경력 및 단가 정보 */}
      {profile?.tutorProfile && (
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">경력</span>
            <span className="text-gray-700 text-sm">
              {profile.tutorProfile.careerYears
                ? `${profile.tutorProfile.careerYears}년`
                : '정보 없음'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">단가</span>
            <span className="text-gray-700 text-sm">
              {profile.tutorProfile.pricePerHour
                ? `${profile.tutorProfile.pricePerHour.toLocaleString()}원 / ${
                    profile.tutorProfile.durationMin
                  }분`
                : '정보 없음'}
            </span>
          </div>
        </div>
      )}
      <div>
        <span className="block text-sm font-semibold text-gray-600 mb-2">소개</span>
        <p className="text-gray-700 text-sm">
          {profile?.tutorProfile?.introduce || '소개가 없습니다.'}
        </p>
      </div>
    </div>
  );
}
