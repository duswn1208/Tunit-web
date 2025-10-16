import type { TutorDetailResponse } from '../api/tutorApi';
import WeeklyScheduleList from '@/shared/components/WeeklyScheduleList';

interface TutorScheduleInfoProps {
  scheduleData: TutorDetailResponse['tutorAvailableTimeList'];
  onBookingClick: () => void;
}

export default function TutorScheduleInfo({
  scheduleData,
  onBookingClick,
}: TutorScheduleInfoProps) {
  return (
    <div className="info-card">
      <div className="schedule-header">
        <h2 className="info-title">레슨 가능 시간</h2>
        <button className="booking-button" onClick={onBookingClick}>
          레슨 예약하기
        </button>
      </div>
      <WeeklyScheduleList scheduleData={scheduleData} />
    </div>
  );
}
