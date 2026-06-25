import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import Modal from '@/shared/components/Modal';
import { useUnwrittenLessons } from '../hooks/useLessonLog';
import { LessonLogSection } from './LessonLogSection';
import type { UnwrittenLesson } from '../types/lessonLog';

interface Props {
  contractNo: number;
  studentName: string;
  lessonName: string;
}

export function UnwrittenLessonLogList({ contractNo, studentName, lessonName }: Props) {
  const { data: lessons } = useUnwrittenLessons(contractNo);
  const [writingLesson, setWritingLesson] = useState<UnwrittenLesson | null>(null);
  const queryClient = useQueryClient();

  if (!lessons || lessons.length === 0) return null;

  const handleClose = () => {
    setWritingLesson(null);
    queryClient.invalidateQueries({ queryKey: ['unwrittenLessons', contractNo] });
  };

  const formatDate = (date: string) =>
    format(new Date(date + 'T00:00:00'), 'M월 d일(E)', { locale: ko });

  return (
    <>
      <div className="unwritten-log-section" onClick={(e) => e.stopPropagation()}>
        <span className="unwritten-log-label">미작성 레슨 일지 {lessons.length}건</span>
        <div className="unwritten-log-list">
          {lessons.map((lesson) => (
            <div key={lesson.lessonReservationNo} className="unwritten-log-row">
              <span className="unwritten-log-date">
                {formatDate(lesson.date)} {lesson.startTime.slice(0, 5)}
              </span>
              <button
                className="lesson-log-btn lesson-log-btn--primary unwritten-log-btn"
                onClick={() => setWritingLesson(lesson)}
              >
                작성하기
              </button>
            </div>
          ))}
        </div>
      </div>

      <Modal open={!!writingLesson} onClose={handleClose}>
        {writingLesson && (
          <div>
            <div className="log-modal-header">
              <div className="log-modal-header-main">
                <h2 className="log-modal-title">
                  {format(new Date(writingLesson.date + 'T00:00:00'), 'yyyy년 M월 d일 (E)', {
                    locale: ko,
                  })}
                </h2>
                <button className="log-modal-close" onClick={handleClose} aria-label="닫기">
                  ✕
                </button>
              </div>
              <div className="log-modal-header-sub">
                <span className="log-modal-time">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {writingLesson.startTime.slice(0, 5)} ~ {writingLesson.endTime.slice(0, 5)}
                </span>
                <span className="log-modal-chip">
                  {studentName} · {lessonName}
                </span>
              </div>
            </div>
            <hr className="log-modal-divider" />
            <LessonLogSection
              lessonReservationNo={writingLesson.lessonReservationNo}
              isTutor={true}
              autoWrite={true}
              onSaveSuccess={handleClose}
            />
          </div>
        )}
      </Modal>
    </>
  );
}
