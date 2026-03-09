import { useState, useEffect } from 'react';
import Header from '@/shared/components/Header.tsx';
import '@/shared/css/components/lesson-manage.css';
import { useWeeklyForm } from '@/domain/dayTime/hooks/useWeeklyForm';
import { fetchTutorMySchedule } from '@/domain/tutor/api/myScheduleApi';
import type { Entry } from '@/domain/dayTime/hooks/useWeeklyForm';
import type { DayOfWeekNumber } from '@/shared/constants/date';
import { useToast } from '@/shared/contexts/ToastContext';
import ScheduleTabs from '../components/ScheduleTabs';
import BasicScheduleSection from '../components/BasicScheduleSection';
import ExceptionScheduleSection from '../components/ExceptionScheduleSection';
import { api } from '@/shared/lib/api';

export default function ScheduleManagePage() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'schedule' | 'exception'>('schedule');
  const [isLoading, setIsLoading] = useState(true);
  const weeklyForm = useWeeklyForm();
  const {
    selectedDays,
    startTime,
    endTime,
    entries,
    setStartTime,
    setEndTime,
    toggleDay,
    addEntry,
    removeEntry,
  } = weeklyForm;

  // 기존 스케줄 불러오기
  useEffect(() => {
    const loadSchedule = async () => {
      try {
        setIsLoading(true);
        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const response = await fetchTutorMySchedule({
          startDate: monthStart.toISOString().slice(0, 10),
          endDate: monthEnd.toISOString().slice(0, 10),
        });

        // availableTimes를 Entry 형식으로 변환
        if (response.availableTimes && response.availableTimes.length > 0) {
          const timeMap = new Map<string, DayOfWeekNumber[]>();

          response.availableTimes.forEach((time) => {
            const key = `${time.startTime}-${time.endTime}`;
            if (!timeMap.has(key)) {
              timeMap.set(key, []);
            }
            timeMap.get(key)!.push(time.dayOfWeekNum as DayOfWeekNumber);
          });

          const loadedEntries: Entry[] = Array.from(timeMap.entries()).map(([timeKey, days]) => {
            const [startTime, endTime] = timeKey.split('-');
            return { days, startTime, endTime };
          });

          weeklyForm.setEntries(loadedEntries);
        }
      } catch (error) {
        showToast('스케줄을 불러오는데 실패했습니다.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadSchedule();
  }, []);

  const handleAdd = () => {
    const r = addEntry();
    if (r && !r.ok) showToast(r.msg, 'error');
  };

  const handleSave = async () => {
    if (entries.length === 0) {
      showToast('최소 하나 이상의 가능 시간을 선택해주세요.', 'info');
      return;
    }

    try {
      const tutorAvailableTimeSaveDtoList = entries.flatMap((entry) =>
        entry.days.map((dayOfWeek) => ({
          dayOfWeekNum: dayOfWeek,
          startTime: entry.startTime,
          endTime: entry.endTime,
        }))
      );

      await api.post('/api/tutor/schedule/modify/lesson-time', {
        tutorAvailableTimeSaveDtoList,
      });

      showToast('스케줄이 변경되었습니다.', 'success');
    } catch (error) {
      console.error('스케줄 변경 실패:', error);
      showToast('스케줄 변경에 실패했습니다.', 'error');
    }
  };

  return (
    <div className="lesson-manage-layout">
      <Header title="스케줄 설정" addClass="schedule-page-header" />

      <div className="schedule-manage-container">
        <ScheduleTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="schedule-manage-content">
          {activeTab === 'schedule' ? (
            <BasicScheduleSection
              isLoading={isLoading}
              selectedDays={selectedDays}
              startTime={startTime}
              endTime={endTime}
              entries={entries}
              onToggleDay={toggleDay}
              onChangeStartTime={setStartTime}
              onChangeEndTime={setEndTime}
              onAddEntry={handleAdd}
              onRemoveEntry={removeEntry}
              onSave={handleSave}
            />
          ) : (
            <ExceptionScheduleSection />
          )}
        </div>
      </div>
    </div>
  );
}
