import { useState } from 'react';
import type { TutorDetailResponse } from '../api/tutorApi';
import { LessonStatus } from '@/domain/lesson/types/lesson';
import LessonCalendarPicker from '@/domain/lesson/components/LessonCalendarPicker';
import { api } from '@/shared/lib/api';
import { useToast } from '@/shared/contexts/ToastContext';

interface LessonBookingFormProps {
  tutorProfileNo: string;
  lessonData: TutorDetailResponse;
  selectedDate: string;
  selectedTime: string;
  selectedLesson: string;
  requestMessage: string;
  onBack: () => void;
  onDateTimeChange: (date: string, time: string) => void;
  onLessonChange: (lessonNo: string) => void;
  onMessageChange: (message: string) => void;
}

export default function LessonBookingForm({
  tutorProfileNo,
  lessonData,
  selectedDate,
  selectedTime,
  selectedLesson,
  requestMessage,
  onBack,
  onDateTimeChange,
  onLessonChange,
  onMessageChange,
}: LessonBookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [disabledSlots, setDisabledSlots] = useState<Array<{ date: string; time: string }>>([]);
  const { showToast } = useToast();

  const handleReservationSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      showToast('날짜와 시간을 선택해주세요.', 'error');
      return;
    }
    if (!selectedLesson) {
      showToast('레슨 과목을 선택해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/api/lessons/reserve', {
        tutorProfileNo: parseInt(tutorProfileNo, 10),
        startTime: selectedTime,
        tutorLessonNo: parseInt(selectedLesson, 10),
        lessonDate: selectedDate,
        reservationStatus: LessonStatus.TRIAL_REQUESTED,
        memo: requestMessage || null,
      });

      // 성공한 예약 슬롯을 비활성화 목록에 추가
      setDisabledSlots((prev) => [...prev, { date: selectedDate, time: selectedTime }]);

      showToast('상담/체험 레슨 예약 요청이 전송되었습니다.', 'success');
      // 예약 폼 초기화 (시간 선택은 유지)
      onLessonChange('');
      onMessageChange('');

      // 성공 토스트 메시지가 보이도록 약간의 딜레이 후 뒤로가기
      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast('예약 요청 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
      }
      console.error('Reservation error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 캘린더 날짜 범위 설정
  const today = new Date();
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  return (
    <div className="info-card full-width">
      <div className="schedule-header">
        <h2 className="info-title">레슨 예약</h2>
        <button className="back-button" onClick={onBack}>
          뒤로 가기
        </button>
      </div>
      <div className="calendar-container">
        <LessonCalendarPicker
          teacherId={parseInt(tutorProfileNo, 10)}
          startDate={today.toISOString().split('T')[0]}
          endDate={monthEnd.toISOString().split('T')[0]}
          date={selectedDate}
          time={selectedTime}
          size="large"
          onChange={onDateTimeChange}
          disabledSlots={disabledSlots}
        />

        <div className="booking-form">
          <div className="lesson-select-container">
            <label htmlFor="lessonSelect">레슨 과목 선택</label>
            <select
              id="lessonSelect"
              className="lesson-select"
              value={selectedLesson}
              onChange={(e) => onLessonChange(e.target.value)}
            >
              <option value="" disabled>
                레슨 과목을 선택해주세요
              </option>
              {lessonData.lessonSubcategoryList?.map((lesson) => (
                <option key={lesson.tutorLessonNo} value={String(lesson.tutorLessonNo)}>
                  {lesson.lessonCategory.label}
                </option>
              ))}
            </select>
          </div>
          <div className="request-input-container">
            <label htmlFor="requestMessage">요청사항</label>
            <textarea
              id="requestMessage"
              className="request-input"
              placeholder="튜터에게 전달할 요청사항을 입력해주세요. (선택사항)"
              value={requestMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              rows={4}
            />
          </div>
          <div className="booking-buttons">
            <button
              className="booking-button"
              onClick={handleReservationSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? '예약 요청 중...' : '상담/체험 레슨 예약'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
