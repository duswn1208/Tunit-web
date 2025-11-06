import React, { useState } from 'react';
import { LessonStatus, LessonStatusLabel } from '../types/lesson';
import Chip from '@/shared/components/Chip';
import Button from '@/shared/components/Button';

export interface TutorInfoProps {
  tutorInfo: {
    name: string;
    tutorProfileNo?: number;
  };
  onClickTutor: () => void;
  onClickChat: () => void;
}

export function TutorInfo({ tutorInfo, onClickTutor, onClickChat }: TutorInfoProps) {
  return (
    <div
      className="tutor-name"
      style={{
        fontSize: '0.95em',
        color: '#888',
        marginTop: 2,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <a
        href={tutorInfo.tutorProfileNo ? `/tutor/${tutorInfo.tutorProfileNo}` : '#'}
        onClick={(e) => {
          e.preventDefault();
          onClickTutor();
        }}
        style={{
          color: 'var(--brand-mint, #1ec9bb)',
          fontWeight: 600,
          textDecoration: 'underline',
          cursor: 'pointer',
          marginRight: 6,
        }}
      >
        튜터: {tutorInfo.name}
      </a>
      <span className="chat-btn-tooltip-wrap">
        <Button className="chat-mini-btn" size="sm" onClick={onClickChat}>
          <span role="img" aria-label="채팅" style={{ fontSize: '1em', marginRight: 2 }}>
            💬
          </span>
        </Button>
        <span className="chat-btn-tooltip">튜터에게 채팅을 걸 수 있어요</span>
      </span>
    </div>
  );
}

export interface LessonCardProps {
  lesson: any;
  actionButton: React.ReactNode;
  onClickTutor: () => void;
  onClickChat: () => void;
  className?: string;
  onClick?: () => void;
}

// LessonCard 컴포넌트
export function LessonCard({
  lesson,
  actionButton,
  onClickTutor,
  onClickChat,
  className = '',
  onClick,
}: LessonCardProps) {
  // 펼침/접힘 상태
  const [expanded, setExpanded] = useState(false);
  // 상태별 칩 컬러 매핑
  const statusVariantMap: Record<string, import('@/shared/components/Chip').ChipVariant> = {
    REQUESTED: 'yellow',
    ACTIVE: 'green',
    COMPLETED: 'blue',
    CANCELED: 'red',
    EXPIRED: 'gray',
  };

  // D-day 계산
  const dday = getDDay(lesson.lessonDate);

  return (
    <div
      key={lesson.lessonReservationNo}
      data-lesson-id={lesson.lessonReservationNo}
      className={`lesson-card responsive-lesson-card ${className}`}
      style={{ position: 'relative', borderRadius: 12 }}
    >
      {/* 요약 정보 */}
      <div
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
      >
        <div style={{ flex: 1 }}>
          <div
            className="lesson-title"
            style={{ fontSize: '1.1em', fontWeight: 700, wordBreak: 'keep-all' }}
          >
            {lesson.lessonCategory?.label}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
            <span className="lesson-date-time" style={{ fontSize: '1em', fontWeight: 600 }}>
              {formatLessonDateTime(lesson.lessonDate, lesson.startTime)}
            </span>
            {dday && (
              <span
                className="lesson-dday"
                style={{ fontSize: '0.95em', color: '#1ec9bb', fontWeight: 600, marginLeft: 4 }}
              >
                {dday}
              </span>
            )}
            <span style={{ marginLeft: 8 }}>
              <Chip
                label={LessonStatusLabel[lesson.status.name as LessonStatus]}
                variant={statusVariantMap[lesson.status.name] || 'default'}
                size="sm"
              />
            </span>
          </div>
        </div>
        {/* 펼침/접힘 아이콘 */}
        <button
          aria-label={expanded ? '상세 닫기' : '상세 보기'}
          onClick={() => setExpanded((prev) => !prev)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 22,
            padding: 4,
            marginLeft: 8,
            color: '#888',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>

      {/* 상세 정보: 펼침 상태일 때만 노출 */}
      {expanded && (
        <>
          <div className="lesson-card-top" style={{ margin: '12px 0 8px 0' }}>
            <TutorInfo
              tutorInfo={lesson.tutorInfo}
              onClickTutor={onClickTutor}
              onClickChat={onClickChat}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              marginTop: 16,
            }}
          >
            <div
              className="lesson-card-actions responsive-lesson-card-actions"
              style={{ flex: '1 1 160px', minWidth: 0 }}
            >
              {actionButton}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 날짜/시간 포맷 함수
function formatLessonDateTime(lessonDate: string, startTime: string) {
  const date = new Date(lessonDate + 'T' + startTime);
  const now = new Date();
  const year = date.getFullYear();
  const isCurrentYear = year === now.getFullYear();
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

// D-day 계산 함수
function getDDay(lessonDate: string) {
  const today = new Date();
  const target = new Date(lessonDate);
  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff > 0) return `${diff}일 남았어요`;
  if (diff === 0) return 'D-day';
  return '';
}
