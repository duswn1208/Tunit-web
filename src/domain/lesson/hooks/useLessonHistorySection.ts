import { useState, useEffect, useCallback } from 'react';
import useLessonHistory from '../../mypage/hooks/useLessonHistory';
import { api } from '@/shared/lib/api';
import { useToast } from '@/shared/contexts/ToastContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { submitReview } from '@/domain/contract/api/contractApi';

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const contractNo = searchParams.get('contractNo');
  const tabParam = searchParams.get('tab') as TabType | null;
  const viewParam = searchParams.get('view') as 'list' | 'calendar' | null;

  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>(tabParam || 'upcoming');
  const [viewType, setViewType] = useState<'list' | 'calendar'>(viewParam || 'list');
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
        await api.post(`/api/lessons/cancel/${lessonReservationNo}`);
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
      const contractNo = lesson?.contractNo;
      if (contractNo && lesson?.lessonReservationNo) {
        navigate(
          `/student/booking/lesson?contractNo=${contractNo}&mode=reschedule&lessonReservationNo=${lesson.lessonReservationNo}`
        );
      } else {
        showToast('레슨 변경에 필요한 정보가 없습니다.', 'error');
      }
    },
    [showToast, navigate]
  );

  const handleWriteReview = useCallback(
    async (lessonReservationNo: number, tutorName: string, lessonDate: string) => {
      return {
        lessonReservationNo,
        tutorName,
        lessonDate,
        submit: async (data: { lessonReservationNo: number; rating: number; content: string }) => {
          console.log('Review data to submit:', data);
          await submitReview(data);
          showToast('후기가 등록되었습니다.', 'success');
          setRefreshKey((k) => k + 1);
        },
      };
    },
    [showToast]
  );

  const handleReserveLesson = useCallback(() => {
    showToast('레슨 예약 기능은 준비 중입니다.', 'info');
  }, [showToast]);

  const handleChatWithTutor = useCallback(() => {
    showToast('채팅 기능은 준비 중입니다.', 'info');
  }, [showToast]);

  const handleBookNewLesson = useCallback(() => {
    if (contractNo) {
      navigate(`/student/booking/lesson?contractNo=${contractNo}&mode=new`);
    } else {
      navigate(`/student/my/tutors`);
    }
  }, [contractNo, showToast]);

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
    handleBookNewLesson,
  };
}
