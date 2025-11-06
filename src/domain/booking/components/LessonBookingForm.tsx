import { useState } from 'react';
import type { Contract } from '@/domain/contract/types/contract';
import LessonCalendarPicker from '@/domain/lesson/components/LessonCalendarPicker';
import Header from '@/shared/components/Header';
import Button from '@/shared/components/Button';
import ContractInfoCard from './ContractInfoCard';
import { isFirstcome } from '../types/types';

interface LessonBookingFormProps {
  contract: Contract;
  tutorProfileNo: number;
  mode: 'new' | 'reschedule'; // 신규 예약 or 변경
  existingLesson?: {
    lessonReservationNo: number;
    lessonDate: string;
    startTime: string;
    endTime: string;
  };
  onSubmit: (data: {
    lessonDate: string;
    startTime: string;
    endTime: string;
    memo?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function LessonBookingForm({
  contract,
  tutorProfileNo,
  mode,
  existingLesson,
  onSubmit,
  onCancel,
}: LessonBookingFormProps) {
  const [selectedDate, setSelectedDate] = useState(existingLesson?.lessonDate || '');
  const [selectedTime, setSelectedTime] = useState(existingLesson?.startTime || '');
  const [memo, setMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // REGULAR 계약의 경우 신규 예약 불가
  const canBookNew = mode === 'new' && isFirstcome(contract.contractType.code);

  if (mode === 'new' && !canBookNew) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <ContractInfoCard contract={contract} />
        <div
          style={{
            marginTop: 32,
            padding: 24,
            background: '#fff3cd',
            borderRadius: 8,
            color: '#856404',
          }}
        >
          <h3 style={{ marginBottom: 12 }}>신규 레슨 예약 불가</h3>
          <p>
            정기 레슨(REGULAR) 계약은 시스템에서 자동으로 레슨을 생성합니다.
            <br />
            선착순 신청(FIRSTCOME) 계약만 직접 레슨을 예약할 수 있습니다.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="ui-btn"
          style={{ marginTop: 24, width: '100%', maxWidth: 300 }}
        >
          돌아가기
        </button>
      </div>
    );
  }

  const handleDateTimeChange = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }

    // endTime 계산 (1시간 후)
    const [hour, minute] = selectedTime.split(':').map(Number);
    const endHour = hour + 1;
    const endTime = `${endHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

    setIsSubmitting(true);
    try {
      await onSubmit({
        lessonDate: selectedDate,
        startTime: selectedTime,
        endTime,
        memo: memo.trim() || undefined,
      });
    } catch (error) {
      // 에러는 상위에서 처리
    } finally {
      setIsSubmitting(false);
    }
  };

  // 캘린더 날짜 범위 설정 (오늘부터 2개월)
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  const twoMonthsLater = new Date(today.getFullYear(), today.getMonth() + 2, 0);
  const endDate = twoMonthsLater.toISOString().split('T')[0];

  return (
    <div style={{ padding: '0 20px', maxWidth: '100%', overflow: 'hidden' }}>
      <ContractInfoCard contract={contract} />

      <div style={{ marginTop: 32, maxWidth: '100%', overflow: 'hidden' }}>
        <Header
          title={mode === 'new' ? '레슨 예약' : '레슨 날짜/시간 변경'}
          subtitle={
            mode === 'new'
              ? '원하는 날짜와 시간을 선택해주세요.'
              : '변경할 날짜와 시간을 선택해주세요.'
          }
        />

        {mode === 'reschedule' && existingLesson && (
          <div
            style={{
              padding: 16,
              background: '#f8f9fa',
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 8 }}>현재 예약 정보</div>
            <div style={{ color: '#666' }}>
              {existingLesson.lessonDate} {existingLesson.startTime} ~ {existingLesson.endTime}
            </div>
          </div>
        )}

        <LessonCalendarPicker
          tutorProfileNo={tutorProfileNo}
          startDate={startDate}
          endDate={endDate}
          date={selectedDate}
          time={selectedTime}
          onChange={handleDateTimeChange}
          size="medium"
        />

        <div style={{ marginTop: 24 }}>
          <Header title="메모 (선택사항)" />
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="튜터에게 전달할 메시지를 입력해주세요."
            style={{
              width: '100%',
              minHeight: 80,
              padding: 12,
              borderRadius: 8,
              border: '1px solid #ddd',
              fontSize: 14,
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
          <button onClick={onCancel} className="ui-btn" style={{ flex: 1 }}>
            취소
          </button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedDate || !selectedTime || isSubmitting}
            className="ui-btn"
          >
            {isSubmitting ? '처리 중...' : mode === 'new' ? '예약하기' : '변경하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
