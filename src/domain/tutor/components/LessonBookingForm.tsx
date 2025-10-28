import { useState, useEffect } from 'react';
import type { TutorDetailResponse } from '../api/tutorApi';
import { LessonStatus } from '@/domain/lesson/types/lesson';
import LessonCalendarPicker from '@/domain/lesson/components/LessonCalendarPicker';
import { api } from '@/shared/lib/api';
import { useToast } from '@/shared/contexts/ToastContext';
import SelectBox from '@/shared/components/SelectBox';
import { Button } from '@/shared/components';
import Header from '@/shared/components/Header';

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
  lessonReservationNo?: string;
}

export default function LessonBookingForm(props: LessonBookingFormProps) {
  const {
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
    lessonReservationNo,
  } = props;
  // 예약번호 없고 날짜가 없으면 오늘로 자동 세팅
  useEffect(() => {
    if (!lessonReservationNo && !selectedDate) {
      const today = new Date();
      const yyyyMMdd = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
      ].join('-');
      onDateTimeChange(yyyyMMdd, '');
    }
  }, [lessonReservationNo, selectedDate, onDateTimeChange]);
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
      const url = lessonReservationNo ? '/api/lessons/reserve/change' : '/api/lessons/reserve';
      await api.post(url, {
        tutorProfileNo: parseInt(tutorProfileNo, 10),
        startTime: selectedTime,
        tutorLessonNo: parseInt(selectedLesson, 10),
        lessonDate: selectedDate,
        reservationStatus: LessonStatus.TRIAL_REQUESTED,
        memo: requestMessage || null,
      });

      // 성공한 예약 슬롯을 즉시 비활성화 목록에 추가
      const newDisabledSlot = {
        date: selectedDate,
        time: selectedTime.length === 5 ? selectedTime : selectedTime.slice(0, 5),
      };

      setDisabledSlots((prev) => {
        // 중복 방지를 위한 검사
        const exists = prev.some(
          (slot) => slot.date === newDisabledSlot.date && slot.time === newDisabledSlot.time
        );
        const updatedSlots = exists ? prev : [...prev, newDisabledSlot];
        return updatedSlots;
      });

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
          startDate={today.toDateString().split('T')[0]}
          endDate={monthEnd.toISOString().split('T')[0]}
          date={selectedDate}
          time={selectedTime}
          size="large"
          onChange={onDateTimeChange}
          disabledSlots={disabledSlots}
        />

        <div className="booking-form">
          <div className="lesson-select-container">
            <Header title="레슨 선택" />
            <SelectBox
              id="lessonSelect"
              value={selectedLesson}
              onChange={(value) => onLessonChange(value)}
              placeholder="레슨 과목을 선택해주세요"
              options={
                lessonData.lessonSubcategoryList?.map((lesson) => ({
                  value: String(lesson.tutorLessonNo),
                  label: lesson.lessonCategory.label,
                })) || []
              }
            />
          </div>
          <div className="request-input-container">
            <Header title="요청사항" />
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
            <Button
              className="booking-button"
              onClick={handleReservationSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? lessonReservationNo
                  ? '예약 변경 중...'
                  : '예약 요청 중...'
                : lessonReservationNo
                ? '예약 변경'
                : '상담/체험 레슨 예약'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
