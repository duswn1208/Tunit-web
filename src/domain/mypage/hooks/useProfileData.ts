import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/shared/contexts/ToastContext';

export function useProfileData() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const { showToast } = useToast();

  const fetchProfileData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setIsLoading(true);
      const response = await fetch('/api/users/profile/me');
      if (!response.ok) {
        throw new Error('프로필 정보를 불러오는데 실패했습니다.');
      }
      const data = await response.json();
      setProfileData(data);
    } catch (err) {
      setError(err as Error);
      showToast('프로필 정보를 불러오는데 실패했습니다.', 'error');
    } finally {
      if (showLoading) setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const refetch = useCallback(() => fetchProfileData(false), [fetchProfileData]);

  return { isLoading, error, profileData, refetch };
}
