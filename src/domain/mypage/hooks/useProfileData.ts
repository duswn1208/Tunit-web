import { useState, useEffect } from 'react';
import { useToast } from '@/shared/contexts/ToastContext';

export function useProfileData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // API 호출 로직
        const response = await fetch('/api/profile');
        if (!response.ok) {
          throw new Error('프로필 정보를 불러오는데 실패했습니다.');
        }
        const data = await response.json();
        setProfileData(data);
      } catch (err) {
        setError(err as Error);
        showToast('프로필 정보를 불러오는데 실패했습니다.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [showToast]);

  return { isLoading, error, profileData };
}
