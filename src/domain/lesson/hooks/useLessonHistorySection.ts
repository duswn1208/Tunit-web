import { useState, useEffect, useCallback } from 'react';
import useLessonHistory from '../../mypage/hooks/useLessonHistory';
import { api } from '@/shared/lib/api';
import { useToast } from '@/shared/contexts/ToastContext';
import { useSearchParams } from 'react-router-dom';

type TabType = 'upcoming' | 'past' | 'pending';

const tabStatusMap = {
  upcoming: ['ACTIVE'],
  past: ['COMPLETED', 'CANCELED', 'EXPIRED'],
  pending: ['REQUESTED'],
} as const;

const lessonFilterMap: Record<TabType, string> = {
  upcoming: 'UPCOMING',
  past: 'PAST',
  pending: 'PENDING',
};

export function useLessonHistorySection() {
  const [searchParams] = useSearchParams();
  const contractNo = searchParams.get('contractNo');
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [viewType, setViewType] = useState<'list' | 'calendar'>('list');
  const { showToast } = useToast();

  const { lessons, isLoading, error } = useLessonHistory(
    tabStatusMap[activeTab] as unknown as string[],
    refreshKey,
    lessonFilterMap[activeTab],
    contractNo ? Number(contractNo) : undefined
  );

  useEffect(() => {
    if (error) {
      showToast('데이터를 불러오는 중 문제가 발생했습니다.', 'error');
    }
  }, [error, showToast]);

  // 버튼별 동작 메서드
  const handleCancelLesson = useCallback(
    async (lessonReservationNo: number) => {
      try {
        await api.post(`/api/lessons/reservation/cancel/${lessonReservationNo}`);
        showToast('레슨이 취소되었습니다.', 'success');
        setRefreshKey((k) => k + 1);
      } catch (e) {
        showToast('취소 중 오류가 발생했습니다.', 'error');
      }
    },
    [showToast]
  );

  const handleChangeLesson = useCallback(
    (lesson: any) => {
      if (lesson && lesson.tutorProfileNo) {
        window.location.href = `/tutors/${lesson.tutorProfileNo}/booking?lessonReservationNo=${lesson.lessonReservationNo}`;
        return;
      }
    },
    [showToast]
  );

  const handleWriteReview = useCallback(() => {
    showToast('후기 작성 기능은 준비 중입니다.', 'info');
  }, [showToast]);

  const handleReserveLesson = useCallback(() => {
    showToast('레슨 예약 기능은 준비 중입니다.', 'info');
  }, [showToast]);

  const handleChatWithTutor = useCallback(() => {
    showToast('채팅 기능은 준비 중입니다.', 'info');
  }, [showToast]);

  return {
    lessons,
    isLoading,
    activeTab,
    setActiveTab,
    viewType,
    setViewType,
    handleCancelLesson,
    handleChangeLesson,
    handleWriteReview,
    handleReserveLesson,
    handleChatWithTutor,
  };
}
