import { toAmPmFormat } from '@/domain/dayTime/lib/timeUtils';
import { DAYS_OF_WEEK } from '@/shared/constants/date';
import '@/shared/css/components/weekly-schedule-list.css';

interface Schedule {
  dayOfWeekNum: number;
  startTime: string;
  endTime: string;
}

interface WeeklyScheduleListProps {
  scheduleData?: Schedule[];
  renderTime?: (schedule: Schedule) => React.ReactNode;
  emptyText?: string;
  className?: string;
}

export default function WeeklyScheduleList({
  scheduleData = [],
  renderTime = (schedule) => (
    <span className="schedule-time">
      {toAmPmFormat(schedule.startTime)} - {toAmPmFormat(schedule.endTime)}
    </span>
  ),
  emptyText = '휴무',
  className = 'schedule-list',
}: WeeklyScheduleListProps) {
  return (
    <div className={className}>
      {DAYS_OF_WEEK.map((day) => {
        const dayIndex = DAYS_OF_WEEK.indexOf(day);
        const schedule = scheduleData?.find((time) => time.dayOfWeekNum === dayIndex + 1);
        return (
          <div key={day} className={`schedule-item ${schedule ? 'has-schedule' : 'no-schedule'}`}>
            <span className="schedule-day">{day}요일</span>
            {schedule ? renderTime(schedule) : <span className="schedule-off">{emptyText}</span>}
          </div>
        );
      })}
    </div>
  );
}
