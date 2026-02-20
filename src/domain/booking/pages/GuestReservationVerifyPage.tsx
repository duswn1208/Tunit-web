import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/contexts/ToastContext';
import {
  getReservationByToken,
  handleReservationAction,
  type GuestReservationResponse,
} from '../api/guestReservationApi';
import Button from '@/shared/components/Button';
import Header from '@/shared/components/Header';
import '../components/css/lesson-booking.css';

export default function GuestReservationVerifyPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [reservation, setReservation] = useState<GuestReservationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (token) {
      loadReservation();
    }
  }, [token]);

  const loadReservation = async () => {
    try {
      const data = await getReservationByToken(token!);
      setReservation(data);
    } catch (error: any) {
      console.error('예약 조회 실패:', error);
      showToast('예약 정보를 불러올 수 없습니다.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action: 'confirm' | 'reject') => {
    if (!token) return;

    setIsProcessing(true);
    try {
      const message = await handleReservationAction(token, action);
      showToast(message, 'success');
      // 상태 다시 불러오기
      await loadReservation();
    } catch (error: any) {
      console.error('예약 처리 실패:', error);
      showToast(error.message || '예약 처리에 실패했습니다.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Header title="예약 확인" />
        <div className="loading-container">로딩 중...</div>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div>
        <Header title="예약 확인" />
        <div className="error-container">
          <p>예약 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => navigate('/')}>홈으로 이동</Button>
        </div>
      </div>
    );
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '승인 대기 중';
      case 'CONFIRMED':
        return '확정됨';
      case 'REJECTED':
        return '거절됨';
      case 'CANCELLED':
        return '취소됨';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '#f59e0b';
      case 'CONFIRMED':
        return '#10b981';
      case 'REJECTED':
      case 'CANCELLED':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div>
      <Header title="예약 확인" />
      <div className="reservation-detail-container">
        <div className="info-card">
          <div className="reservation-status">
            <span className="status-label">상태:</span>
            <span
              className="status-badge"
              style={{ backgroundColor: getStatusColor(reservation.status) }}
            >
              {getStatusText(reservation.status)}
            </span>
          </div>

          <div className="reservation-info">
            <h2 className="section-title">예약 정보</h2>
            <div className="info-row">
              <span className="info-label">학생 이름:</span>
              <span className="info-value">{reservation.studentName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">튜터 이름:</span>
              <span className="info-value">{reservation.tutorName}</span>
            </div>
            <div className="info-row">
              <span className="info-label">레슨 과목:</span>
              <span className="info-value">{reservation.lessonCategory}</span>
            </div>
            <div className="info-row">
              <span className="info-label">레슨 날짜:</span>
              <span className="info-value">{reservation.lessonDate}</span>
            </div>
            <div className="info-row">
              <span className="info-label">레슨 시간:</span>
              <span className="info-value">
                {reservation.startTime} - {reservation.endTime}
              </span>
            </div>
            {reservation.memo && (
              <div className="info-row">
                <span className="info-label">메모:</span>
                <span className="info-value">{reservation.memo}</span>
              </div>
            )}
          </div>

          {reservation.status === 'PENDING' && (
            <div className="action-buttons">
              <Button
                onClick={() => handleAction('confirm')}
                disabled={isProcessing}
                className="confirm-button"
              >
                예약 확정
              </Button>
              <Button
                onClick={() => handleAction('reject')}
                disabled={isProcessing}
                className="reject-button"
              >
                예약 거절
              </Button>
            </div>
          )}

          {reservation.status === 'CONFIRMED' && (
            <div className="notice-box">
              <p>예약이 확정되었습니다. 레슨 일정을 확인해주세요.</p>
            </div>
          )}

          {(reservation.status === 'REJECTED' || reservation.status === 'CANCELLED') && (
            <div className="notice-box error">
              <p>이 예약은 취소되었습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
