import React, { useState } from 'react';
import Modal from './Modal';
import { StarRating } from './StarRating';
import './review-modal.css';
import { useToast } from '../contexts/ToastContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    lessonReservationNo: number;
    rating: number;
    content: string;
  }) => Promise<void>;
  lessonReservationNo: number;
  tutorName?: string;
  lessonDate?: string;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  lessonReservationNo,
  tutorName,
  lessonDate,
}) => {
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ lessonReservationNo, rating, content: content.trim() });
      // 성공 후 초기화
      setRating(5);
      setContent('');
      onClose();
    } catch (error) {
      showToast(error?.message || '후기 작성에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(5);
      setContent('');
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className="review-modal">
        <h2 className="review-modal__title">레슨 후기 작성</h2>

        {(tutorName || lessonDate) && (
          <div className="review-modal__info">
            {tutorName && <p className="review-modal__tutor">튜터: {tutorName}</p>}
            {lessonDate && <p className="review-modal__date">{lessonDate}</p>}
          </div>
        )}

        <div className="review-modal__rating-section">
          <label className="review-modal__label">만족도</label>
          <div className="review-modal__stars">
            <StarRating rating={rating} onRatingChange={setRating} size="large" />
            <span className="review-modal__rating-text">{rating}점</span>
          </div>
        </div>

        <div className="review-modal__content-section">
          <label className="review-modal__label">후기 (선택사항)</label>
          <textarea
            className="review-modal__textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="레슨에 대한 후기를 작성해주세요."
            maxLength={500}
            rows={5}
          />
          <div className="review-modal__char-count">{content.length} / 500</div>
        </div>

        <div className="review-modal__buttons">
          <button
            className="review-modal__button review-modal__button--cancel"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            className="review-modal__button review-modal__button--submit"
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
          >
            {isSubmitting ? '작성 중...' : '후기 등록'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
