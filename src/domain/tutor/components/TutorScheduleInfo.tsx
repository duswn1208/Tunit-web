import type { TutorDetailResponse } from '../api/tutorApi';
import WeeklyScheduleList from '@/shared/components/WeeklyScheduleList';

interface TutorScheduleInfoProps {
  scheduleData: TutorDetailResponse['tutorAvailableTimeList'];
}

export default function TutorScheduleInfo({ scheduleData }: TutorScheduleInfoProps) {
  return (
    <div className="info-card">
      <h2 className="info-title">레슨 가능 시간</h2>
      <WeeklyScheduleList scheduleData={scheduleData} />
    </div>
  );
}
