import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function ProfileInfo() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    api.get('/api/users/profile/me').then(setProfile);
  }, []);

  if (!profile) return null;

  return (
    <div style={{ marginBottom: 24, padding: 12, background: '#f8f8f8', borderRadius: 8 }}>
      <div>
        <b>역할</b> {profile.userRole.label}
      </div>
      <div>
        <b>이름:</b> {profile.name}
      </div>
      <div>
        <b>닉네임:</b> {profile.nickname}
      </div>
      <div>
        <b>가입일:</b> {profile.createdAt ? profile.createdAt.split('T')[0] : '-'}
      </div>
      <div>
        <b>소개:</b> {profile?.tutorProfile?.introduce || '소개가 없습니다.'}
      </div>
      {/* 필요한 프로필 정보 추가 */}
    </div>
  );
}
