import { useState, useEffect } from 'react';
import useLessonHistory from '../../mypage/hooks/useLessonHistory';
import { useToast } from '@/shared/contexts/ToastContext';
import Button from '@/shared/components/Button';
import LessonCalendarSection from './LessonCalendarSection';
import { getDayLabel } from '@/shared/constants/date';
import Chip from '@/shared/components/Chip';
import './css/LessonHistorySection.css';
import { LessonStatus, LessonStatusLabel } from '../types/lesson';
import { differenceInDays, differenceInHours, isAfter, format } from 'date-fns';

type TabType = 'upcoming' | 'past' | 'pending';

const tabStatusMap = {
  upcoming: ['ACTIVE', 'TRIAL_ACTIVE'],
  past: ['COMPLETED', 'CANCELED', 'EXPIRED', 'TRIAL_CANCELED', 'TRIAL_COMPLETED'],
  pending: ['REQUESTED', 'TRIAL_REQUESTED'],
} as const;

// 레슨 상태별 칩 컬러 매핑
const LessonStatusChipVariant: Record<
  LessonStatus,
  import('@/shared/components/Chip').ChipVariant
> = {
  [LessonStatus.REQUESTED]: 'yellow',
  [LessonStatus.ACTIVE]: 'green',
  [LessonStatus.COMPLETED]: 'blue',
  [LessonStatus.CANCELED]: 'red',
  [LessonStatus.EXPIRED]: 'gray',
  [LessonStatus.TRIAL_REQUESTED]: 'yellow',
  [LessonStatus.TRIAL_CANCELED]: 'red',
  [LessonStatus.TRIAL_ACTIVE]: 'green',
  [LessonStatus.TRIAL_COMPLETED]: 'blue',
};

// 임시 상수
export default function LessonHistorySection() {
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [viewType, setViewType] = useState<'list' | 'calendar'>('list');
  const { lessons, isLoading, error } = useLessonHistory(
    tabStatusMap[activeTab] as unknown as string[]
  );
  const { showToast } = useToast();

  useEffect(() => {
    if (error) {
      showToast('데이터를 불러오는 중 문제가 발생했습니다.', 'error');
    }
  }, [error, showToast]);

  if (isLoading) {
    return <div className="lesson-history-loading">로딩 중...</div>;
  }

  const renderLessonList = (lessons: any[]) => {
    if (!lessons || lessons.length === 0) {
      return <div className="no-lessons">레슨 내역이 없습니다.</div>;
    }
    return (
      <div className="lesson-list">
        {lessons.map((lesson) => {
          const tutorName = '베이쌤';
          const remainCount = '총 5회 중 2회차 남음';
          const price = '결제 금액 3만원';
          // 상태별 버튼
          let actionButton = null;
          if (activeTab === 'upcoming') {
            actionButton = (
              <>
                <Button className="ui-btn mr-8" size="sm">
                  튜터에게 채팅
                </Button>
                <Button className="ui-btn ui-btn--accent" size="sm">
                  레슨 취소/변경
                </Button>
              </>
            );
          } else if (activeTab === 'past') {
            actionButton = (
              <>
                <Button className="ui-btn ui-btn--accent mr-8" size="sm">
                  후기 작성
                </Button>
                <Button className="ui-btn" size="sm">
                  레슨 예약
                </Button>
              </>
            );
          } else if (activeTab === 'pending') {
            actionButton = (
              <Button className="ui-btn" size="sm">
                튜터에게 채팅
              </Button>
            );
          }
          // 상태별 색상 태그 클래스 (예시)
          const statusColorClass = `status-badge status-${lesson.status.name.toLowerCase()}`;
          // 요일 구하기 (공통 함수 활용)
          const getDayOfWeekLabel = (dateStr: string) => {
            const d = new Date(dateStr);
            // JS: 0(일)~6(토), getDayLabel: 1(월)~7(일)
            const dayNum = (
              d.getDay() === 0 ? 7 : d.getDay()
            ) as import('@/shared/constants/date').DayOfWeekNumber;
            return getDayLabel(dayNum);
          };
          return (
            <div
              key={lesson.lessonReservationNo}
              className="lesson-card responsive-lesson-card"
              style={{
                position: 'relative',
                borderRadius: 12,
              }}
            >
              {/* 상태 칩: 카드 내부 우측 상단 */}
              <div
                className="lesson-card-status responsive-lesson-card-status"
                style={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}
              >
                <Chip
                  label={LessonStatusLabel[lesson.status.name as LessonStatus]}
                  variant={LessonStatusChipVariant[lesson.status.name as LessonStatus]}
                  size="sm"
                />
              </div>
              {/* 최상단: 레슨명(가장 크게), 튜터 이름, 악기명 */}
              <div className="lesson-card-top" style={{ marginBottom: 8 }}>
                <div
                  className="lesson-title"
                  style={{ fontSize: '1.1em', fontWeight: 700, wordBreak: 'keep-all' }}
                >
                  레슨: {lesson.lessonCategory?.label || '베이스'}
                </div>
                <div
                  className="tutor-name"
                  style={{ fontSize: '0.95em', color: '#888', marginTop: 2 }}
                >
                  튜터: {tutorName}
                </div>
              </div>
              {/* 중앙: 날짜/시간 */}
              <div className="lesson-card-center" style={{ marginBottom: 8 }}>
                <span className="lesson-date-time" style={{ fontSize: '1em', fontWeight: 600 }}>
                  {formatLessonDateTime(lesson.lessonDate, lesson.startTime)}
                </span>
                {getRemainTimeText(lesson.lessonDate, lesson.startTime) && (
                  <span style={{ marginLeft: 8, fontSize: 12, color: '#1ec9bb', fontWeight: 500 }}>
                    {getRemainTimeText(lesson.lessonDate, lesson.startTime)}
                  </span>
                )}
              </div>
              {/* 하단: 관리 버튼 + 잔여 횟수 같은 행 (모바일 대응) */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 8,
                  marginTop: 40,
                }}
              >
                <div
                  className="lesson-card-actions responsive-lesson-card-actions"
                  style={{ flex: '1 1 160px', minWidth: 0 }}
                >
                  {actionButton}
                </div>
                <div
                  className="lesson-card-remain responsive-lesson-card-remain"
                  style={{
                    fontSize: 12,
                    color: '#666',
                    textAlign: 'right',
                    minWidth: 90,
                    marginTop: 6,
                  }}
                >
                  {remainCount}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="lesson-history-section">
      {/* 상태 필터 + 뷰 전환 버튼 한 줄 배치 */}
      <div
        className="lesson-header-row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div className="tab-buttons" style={{ display: 'flex', gap: 12 }}>
          <button
            className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            예정된 레슨
          </button>
          <button
            className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            지난 레슨
          </button>
          <button
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            예약 요청
          </button>
        </div>
        <div
          className="view-toggle-text"
          style={{ display: 'flex', alignItems: 'center', gap: 0, fontWeight: 600, fontSize: 16 }}
        >
          <span
            style={{
              color: viewType === 'list' ? 'var(--brand-mint, #1ec9bb)' : '#bbb',
              cursor: viewType === 'list' ? 'default' : 'pointer',
              textDecoration: viewType === 'list' ? 'underline' : 'none',
              marginRight: 8,
            }}
            onClick={() => setViewType('list')}
          >
            리스트
          </span>
          <span style={{ color: '#ddd', margin: '0 4px' }}>|</span>
          <span
            style={{
              color: viewType === 'calendar' ? 'var(--brand-mint, #1ec9bb)' : '#bbb',
              cursor: viewType === 'calendar' ? 'default' : 'pointer',
              textDecoration: viewType === 'calendar' ? 'underline' : 'none',
              marginLeft: 8,
            }}
            onClick={() => setViewType('calendar')}
          >
            달력
          </span>
        </div>
      </div>

      <div className="tab-content">
        {viewType === 'list' ? (
          renderLessonList(lessons)
        ) : (
          <LessonCalendarSection
            lessonEvents={lessons.map((lesson) => ({
              id: lesson.lessonReservationNo,
              title: lesson.lessonCategory?.label || '레슨',
              start: new Date(lesson.lessonDate + 'T' + lesson.startTime),
              end: new Date(lesson.lessonDate + 'T' + lesson.startTime),
              date: new Date(lesson.lessonDate + 'T' + lesson.startTime),
              status: {
                name: lesson.status.name as import('../types/lessonCalendar').LessonStatus,
                label: lesson.status.label,
                allowedNextStatuses: [], // 실제 값 필요시 추가
              },
              studentName: '',
              category: {
                label: lesson.lessonCategory?.label || '',
                name: lesson.lessonCategory?.code || '',
              },
            }))}
            onSelectEvent={() => {}}
            size="large"
          />
        )}
      </div>
    </section>
  );
}

// 날짜/시간 기준 남은 시간 텍스트 반환 함수
function getRemainTimeText(lessonDate: string, startTime: string) {
  const now = new Date();
  const lessonDateTime = new Date(lessonDate + 'T' + startTime);
  if (isAfter(lessonDateTime, now)) {
    const days = differenceInDays(lessonDateTime, now);
    if (days > 0) {
      return `${days}일 남았어요`;
    } else {
      const hours = differenceInHours(lessonDateTime, now);
      if (hours > 0) {
        return `${hours}시간 남았어요`;
      }
    }
  }
  return '';
}

// 날짜/시간 포맷 함수
function formatLessonDateTime(lessonDate: string, startTime: string) {
  const date = new Date(lessonDate + 'T' + startTime);
  const now = new Date();
  const year = date.getFullYear();
  const isCurrentYear = year === now.getFullYear();
  // 월, 일, 요일을 locale 기반으로 추출
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = date.toLocaleDateString('ko-KR', { weekday: 'long' });
  const hour = date.getHours();
  const minute = date.getMinutes();
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${!isCurrentYear ? year + '년 ' : ''}${month}월 ${day}일 ${weekday} ${pad(hour)}시 ${pad(
    minute
  )}분`;
}
