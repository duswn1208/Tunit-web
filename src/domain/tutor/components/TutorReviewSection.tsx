import { useState, useEffect } from 'react';
import { fetchTutorReviews } from '../api/tutorApi';
import type { Review, ReviewsResponse } from '../types/tutor';
import { StarRating } from '@/shared/components/StarRating';

interface TutorReviewSectionProps {
  tutorId: number;
}

export default function TutorReviewSection({ tutorId }: TutorReviewSectionProps) {
  const [reviewData, setReviewData] = useState<ReviewsResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReviews(currentPage);
  }, [tutorId, currentPage]);

  const loadReviews = async (page: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTutorReviews(tutorId, page, 10);
      setReviewData(data);
    } catch (err) {
      setError('후기를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && !reviewData) {
    return (
      <div className="info-card">
        <h2 className="info-title">레슨 후기</h2>
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="info-card">
        <h2 className="info-title">레슨 후기</h2>
        <div style={{ padding: '40px', textAlign: 'center', color: '#ef4444' }}>{error}</div>
      </div>
    );
  }

  if (!reviewData || reviewData.reviews.content.length === 0) {
    return (
      <div className="info-card">
        <h2 className="info-title">레슨 후기</h2>
        <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
          아직 작성된 후기가 없습니다.
        </div>
      </div>
    );
  }

  const { summary, reviews } = reviewData;
  const { content, pageInfo } = reviews;

  return (
    <div className="info-card">
      <div className="review-header">
        <h2 className="info-title">레슨 후기</h2>
        <div className="review-summary">
          <div className="review-summary-rating">
            <span className="rating-number">{summary.averageRating.toFixed(1)}</span>
            <StarRating rating={Math.round(summary.averageRating)} readonly size="small" />
          </div>
          <span className="review-count">총 {summary.totalCount}개의 후기</span>
        </div>
      </div>

      <div className="review-list">
        {content.map((review: Review) => (
          <div key={review.reviewNo} className="review-item">
            <div className="review-item-header">
              <div className="review-author">
                <span className="student-name">{review.studentName}</span>
                <StarRating rating={review.rating} readonly size="small" />
              </div>
              <span className="review-date">{formatDate(review.createdAt)}</span>
            </div>
            <p className="review-content">{review.content}</p>
          </div>
        ))}
      </div>

      {pageInfo.totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!pageInfo.hasPrevious || loading}
          >
            이전
          </button>

          <div className="pagination-pages">
            {Array.from({ length: Math.min(5, pageInfo.totalPages) }, (_, i) => {
              let pageNum;
              if (pageInfo.totalPages <= 5) {
                pageNum = i;
              } else if (currentPage < 3) {
                pageNum = i;
              } else if (currentPage > pageInfo.totalPages - 4) {
                pageNum = pageInfo.totalPages - 5 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  className={`pagination-page ${pageNum === currentPage ? 'active' : ''}`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={loading}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>

          <button
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pageInfo.hasNext || loading}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
