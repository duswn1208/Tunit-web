import { useState } from 'react';
import Modal from '@/shared/components/Modal';
import Button from '@/shared/components/Button';
import {
  CAREER_HISTORY_TYPE_LABEL,
  type CareerHistory,
  type CareerHistorySaveDto,
  type CareerHistoryType,
} from '@/domain/tutor/api/careerHistoryApi';
import './CareerHistoryRegisterModal.css';

interface Props {
  openType: 'create' | 'edit';
  initial?: CareerHistory | null;
  onSave: (dto: CareerHistorySaveDto) => Promise<void> | void;
  onClose: () => void;
}

const TYPE_OPTIONS: CareerHistoryType[] = ['EDUCATION', 'CERTIFICATION', 'CAREER', 'AWARD'];

export default function CareerHistoryRegisterModal({
  openType,
  initial,
  onSave,
  onClose,
}: Props) {
  const [type, setType] = useState<CareerHistoryType>(initial?.type || 'EDUCATION');
  const [title, setTitle] = useState(initial?.title || '');
  const [subTitle, setSubTitle] = useState(initial?.subTitle || '');
  const [startDate, setStartDate] = useState(initial?.startDate || '');
  const [endDate, setEndDate] = useState(initial?.endDate || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('제목은 필수입니다.');
      return;
    }
    setSubmitting(true);
    try {
      await onSave({
        type,
        title: title.trim(),
        subTitle: subTitle.trim() || null,
        startDate: startDate || null,
        endDate: endDate || null,
        description: description.trim() || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open onClose={onClose}>
      <div className="career-modal">
        <div className="career-modal-header">
          <h3 className="career-modal-title">
            {openType === 'create' ? '경력 추가' : '경력 수정'}
          </h3>
          <button
            type="button"
            className="career-modal-close"
            onClick={onClose}
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        <div className="career-modal-body">
          <label className="career-modal-field">
            <span className="career-modal-label">유형</span>
            <select
              className="career-modal-input"
              value={type}
              onChange={(e) => setType(e.target.value as CareerHistoryType)}
            >
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {CAREER_HISTORY_TYPE_LABEL[t]}
                </option>
              ))}
            </select>
          </label>

          <label className="career-modal-field">
            <span className="career-modal-label">
              제목 <span className="career-modal-required">*</span>
            </span>
            <input
              className="career-modal-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="예: 서울대학교 음악대학 피아노과"
              maxLength={100}
            />
          </label>

          <label className="career-modal-field">
            <span className="career-modal-label">부제 / 학위 / 발급기관</span>
            <input
              className="career-modal-input"
              type="text"
              value={subTitle ?? ''}
              onChange={(e) => setSubTitle(e.target.value)}
              placeholder="예: 학사 졸업, 한국음악협회"
              maxLength={100}
            />
          </label>

          <div className="career-modal-date-row">
            <label className="career-modal-field">
              <span className="career-modal-label">시작일</span>
              <input
                className="career-modal-input"
                type="date"
                value={startDate ?? ''}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label className="career-modal-field">
              <span className="career-modal-label">종료일</span>
              <input
                className="career-modal-input"
                type="date"
                value={endDate ?? ''}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>

          <label className="career-modal-field">
            <span className="career-modal-label">상세 설명 (선택)</span>
            <textarea
              className="career-modal-textarea"
              value={description ?? ''}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="활동 내용, 수상 내역 등"
              rows={3}
              maxLength={500}
            />
          </label>
        </div>

        <div className="career-modal-actions">
          <Button className="ui-btn--outlined" onClick={onClose} style={{ flex: 1 }}>
            취소
          </Button>
          <Button
            className="ui-btn--primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ flex: 1 }}
          >
            {submitting ? '저장 중...' : '저장'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
