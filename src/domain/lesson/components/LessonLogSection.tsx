import React, { useState } from 'react';
import {
  useLessonLog,
  useCreateLessonLog,
  useUpdateLessonLog,
  useRegisterQuestion,
  useRegisterReply,
} from '../hooks/useLessonLog';
import type { LessonLogResponse } from '../types/lessonLog';
import './css/lesson-log.css';

interface LessonLogSectionProps {
  lessonReservationNo: number;
  isTutor: boolean;
  autoWrite?: boolean;
  onSaveSuccess?: () => void;
  externalMode?: 'view' | 'write' | 'edit';
  onExternalModeChange?: (mode: 'view' | 'write' | 'edit') => void;
  hideTriggerButtons?: boolean;
}

export function LessonLogSection({ lessonReservationNo, isTutor, autoWrite, onSaveSuccess, externalMode, onExternalModeChange, hideTriggerButtons }: LessonLogSectionProps) {
  const { data: log, isPending } = useLessonLog(lessonReservationNo);
  const [localMode, setLocalMode] = useState<'view' | 'write' | 'edit'>(autoWrite ? 'write' : 'view');
  const mode = externalMode ?? localMode;
  const setMode = (next: 'view' | 'write' | 'edit') => {
    if (onExternalModeChange) onExternalModeChange(next);
    else setLocalMode(next);
  };
  const handleSaveSuccess = () => {
    if (onSaveSuccess) {
      onSaveSuccess();
    } else {
      setMode('view');
    }
  };

  return (
    <div className="lesson-log-wrap">
      <h3 className="lesson-log-section-title">
        <i className="fas fa-book-open lesson-log-section-icon" aria-hidden="true" />
        레슨 일지
      </h3>

      {isPending && <p className="lesson-log-muted">불러오는 중...</p>}

      {!isPending && !log && isTutor && mode === 'view' && !hideTriggerButtons && (
        <button className="lesson-log-btn lesson-log-btn--primary" onClick={() => setMode('write')}>
          일지 작성하기
        </button>
      )}

      {!isPending && !log && isTutor && mode === 'view' && hideTriggerButtons && (
        <div className="lesson-log-empty-card">
          <i className="fas fa-book-open lesson-log-empty-card__icon" aria-hidden="true" />
          <p className="lesson-log-empty-card__title">아직 첫 일지가 없어요</p>
          <p className="lesson-log-empty-card__hint">아래 버튼으로 오늘 수업을 기록해보세요</p>
        </div>
      )}

      {!isPending && !log && !isTutor && (
        <div className="lesson-log-empty-card">
          <i className="fas fa-book-open lesson-log-empty-card__icon" aria-hidden="true" />
          <p className="lesson-log-empty-card__title">아직 첫 일지가 없어요</p>
          <p className="lesson-log-empty-card__hint">튜터가 일지를 작성하면 여기에 표시됩니다</p>
        </div>
      )}

      {!isPending && !log && isTutor && mode === 'write' && (
        <WriteForm
          lessonReservationNo={lessonReservationNo}
          onCancel={onSaveSuccess ?? (() => setMode('view'))}
          onSuccess={handleSaveSuccess}
        />
      )}

      {!isPending && log && mode !== 'edit' && (
        <>
          <LogView log={log} />
          {isTutor && !hideTriggerButtons && (
            <button className="lesson-log-btn lesson-log-btn--ghost" onClick={() => setMode('edit')}>
              일지 수정
            </button>
          )}
          {isTutor && <TutorQnA log={log} lessonReservationNo={lessonReservationNo} />}
          {!isTutor && <StudentQnA log={log} lessonReservationNo={lessonReservationNo} />}
        </>
      )}

      {!isPending && log && isTutor && mode === 'edit' && (
        <EditForm
          log={log}
          lessonReservationNo={lessonReservationNo}
          onCancel={() => setMode('view')}
          onSuccess={handleSaveSuccess}
        />
      )}
    </div>
  );
}

// ── 일지 보기 ──────────────────────────────────────────────────────────────
function LogView({ log }: { log: LessonLogResponse }) {
  return (
    <div className="lesson-log-view">
      <div className="lesson-log-field">
        <span className="lesson-log-label">오늘 진도</span>
        <p className="lesson-log-value">{log.progressContent}</p>
      </div>
      <div className="lesson-log-field">
        <span className="lesson-log-label">피드백</span>
        {log.feedback
          ? <p className="lesson-log-value">{log.feedback}</p>
          : <p className="lesson-log-value lesson-log-value--empty">작성된 피드백이 없어요</p>
        }
      </div>
    </div>
  );
}

// ── 일지 작성 (신규) ───────────────────────────────────────────────────────
function WriteForm({
  lessonReservationNo,
  onCancel,
  onSuccess,
}: {
  lessonReservationNo: number;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [progressContent, setProgressContent] = useState('');
  const [feedback, setFeedback] = useState('');
  const create = useCreateLessonLog();

  const handleSubmit = () => {
    if (!progressContent.trim()) return;
    create.mutate(
      {
        lessonReservationNo,
        progressContent: progressContent.trim(),
        feedback: feedback.trim() || undefined,
      },
      { onSuccess },
    );
  };

  return (
    <div className="lesson-log-form">
      <div className="lesson-log-form-field">
        <label className="lesson-log-label">
          오늘 진도 <span className="lesson-log-required">*</span>
        </label>
        <textarea
          className="lesson-log-textarea"
          value={progressContent}
          onChange={(e) => setProgressContent(e.target.value)}
          maxLength={2000}
          rows={4}
          placeholder="오늘 나간 범위와 수업 내용"
        />
      </div>
      <div className="lesson-log-form-field">
        <label className="lesson-log-label">
          피드백 <span className="lesson-log-hint-badge">선택</span>
        </label>
        <textarea
          className="lesson-log-textarea"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          maxLength={300}
          rows={3}
          placeholder="학생에게 전달할 피드백"
        />
        <div className="lesson-log-feedback-counter">{feedback.length}/300</div>
      </div>
      <div className="lesson-log-btn-row">
        <button className="lesson-log-btn lesson-log-btn--ghost" onClick={onCancel}>
          취소
        </button>
        <button
          className="lesson-log-btn lesson-log-btn--primary"
          onClick={handleSubmit}
          disabled={!progressContent.trim() || create.isPending}
        >
          {create.isPending ? '저장 중...' : '✓ 저장'}
        </button>
      </div>
    </div>
  );
}

// ── 일지 수정 ──────────────────────────────────────────────────────────────
function EditForm({
  log,
  lessonReservationNo,
  onCancel,
  onSuccess,
}: {
  log: LessonLogResponse;
  lessonReservationNo: number;
  onCancel: () => void;
  onSuccess: () => void;
}) {
  const [progressContent, setProgressContent] = useState(log.progressContent);
  const [feedback, setFeedback] = useState(log.feedback ?? '');
  const update = useUpdateLessonLog(log.logNo, lessonReservationNo);

  const handleSubmit = () => {
    if (!progressContent.trim()) return;
    update.mutate(
      { progressContent: progressContent.trim(), feedback: feedback.trim() || undefined },
      { onSuccess },
    );
  };

  return (
    <div className="lesson-log-form">
      <div className="lesson-log-form-field">
        <label className="lesson-log-label">
          오늘 진도 <span className="lesson-log-required">*</span>
        </label>
        <textarea
          className="lesson-log-textarea"
          value={progressContent}
          onChange={(e) => setProgressContent(e.target.value)}
          maxLength={2000}
          rows={4}
        />
      </div>
      <div className="lesson-log-form-field">
        <label className="lesson-log-label">
          피드백 <span className="lesson-log-hint-badge">선택</span>
        </label>
        <textarea
          className="lesson-log-textarea"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          maxLength={300}
          rows={3}
        />
        <div className="lesson-log-feedback-counter">{feedback.length}/300</div>
      </div>
      <div className="lesson-log-btn-row">
        <button className="lesson-log-btn lesson-log-btn--ghost" onClick={onCancel}>
          취소
        </button>
        <button
          className="lesson-log-btn lesson-log-btn--primary"
          onClick={handleSubmit}
          disabled={!progressContent.trim() || update.isPending}
        >
          {update.isPending ? '저장 중...' : '✓ 저장'}
        </button>
      </div>
    </div>
  );
}

// ── 튜터 Q&A (학생 질문 확인 + 답변) ────────────────────────────────────
function TutorQnA({
  log,
  lessonReservationNo,
}: {
  log: LessonLogResponse;
  lessonReservationNo: number;
}) {
  const [reply, setReply] = useState('');
  const registerReply = useRegisterReply(log.logNo, lessonReservationNo);

  return (
    <div className="lesson-log-qa">
      <p className="lesson-log-qa-title">
        <i className="fas fa-comments lesson-log-qa-icon" aria-hidden="true" />
        학생 질문
      </p>

      {!log.studentQuestion && (
        <div className="lesson-log-empty-state">
          <i className="far fa-comment lesson-log-empty-icon" aria-hidden="true" />
          <span>아직 등록된 질문이 없어요</span>
        </div>
      )}

      {log.studentQuestion && (
        <div className="lesson-log-qa-bubble">
          <span className="lesson-log-label">질문</span>
          <p className="lesson-log-value">{log.studentQuestion}</p>
        </div>
      )}

      {log.studentQuestion && log.tutorReply && (
        <div className="lesson-log-qa-bubble lesson-log-qa-bubble--reply">
          <span className="lesson-log-label">내 답변</span>
          <p className="lesson-log-value">{log.tutorReply}</p>
        </div>
      )}

      {log.studentQuestion && !log.tutorReply && (
        <div className="lesson-log-form-field">
          <label className="lesson-log-label">답변 작성</label>
          <textarea
            className="lesson-log-textarea"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="학생의 질문에 답변을 작성하세요."
          />
          <div className="lesson-log-btn-row">
            <button
              className="lesson-log-btn lesson-log-btn--primary"
              onClick={() => registerReply.mutate(reply, { onSuccess: () => setReply('') })}
              disabled={!reply.trim() || registerReply.isPending}
            >
              {registerReply.isPending ? '등록 중...' : '답변 등록'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 학생 Q&A (일지 확인 + 질문) ─────────────────────────────────────────
function StudentQnA({
  log,
  lessonReservationNo,
}: {
  log: LessonLogResponse;
  lessonReservationNo: number;
}) {
  const [question, setQuestion] = useState('');
  const [editing, setEditing] = useState(false);
  const registerQuestion = useRegisterQuestion(log.logNo, lessonReservationNo);

  const showForm = !log.studentQuestion || editing;

  const handleSubmit = () => {
    if (!question.trim()) return;
    registerQuestion.mutate(question, {
      onSuccess: () => {
        setEditing(false);
        setQuestion('');
      },
    });
  };

  return (
    <div className="lesson-log-qa">
      <p className="lesson-log-qa-title">질문 & 답변</p>

      {log.studentQuestion && !editing && (
        <>
          <div className="lesson-log-qa-bubble">
            <span className="lesson-log-label">내 질문</span>
            <p className="lesson-log-value">{log.studentQuestion}</p>
          </div>

          {log.tutorReply ? (
            <div className="lesson-log-qa-bubble lesson-log-qa-bubble--reply">
              <span className="lesson-log-label">튜터 답변</span>
              <p className="lesson-log-value">{log.tutorReply}</p>
            </div>
          ) : (
            <p className="lesson-log-pending">튜터의 답변을 기다리는 중...</p>
          )}

          <button
            className="lesson-log-btn lesson-log-btn--ghost"
            onClick={() => {
              setQuestion(log.studentQuestion!);
              setEditing(true);
            }}
          >
            질문 수정
          </button>
        </>
      )}

      {showForm && (
        <div className="lesson-log-form-field">
          <label className="lesson-log-label">질문하기</label>
          <textarea
            className="lesson-log-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            maxLength={2000}
            rows={3}
            placeholder="튜터에게 궁금한 점을 질문하세요."
          />
          <div className="lesson-log-btn-row">
            <button
              className="lesson-log-btn lesson-log-btn--primary"
              onClick={handleSubmit}
              disabled={!question.trim() || registerQuestion.isPending}
            >
              {registerQuestion.isPending ? '등록 중...' : '질문 등록'}
            </button>
            {editing && (
              <button
                className="lesson-log-btn lesson-log-btn--ghost"
                onClick={() => setEditing(false)}
              >
                취소
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
