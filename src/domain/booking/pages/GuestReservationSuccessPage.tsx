import { useLocation, useNavigate } from 'react-router-dom';
import Button from '@/shared/components/Button';
import { useToast } from '@/shared/contexts/ToastContext';
import { HiCheckCircle } from 'react-icons/hi';
import '../components/css/lesson-booking.css';

export default function GuestReservationSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const magicLink = location.state?.magicLink || '';

  const handleCopyLink = () => {
    if (magicLink) {
      navigator.clipboard.writeText(magicLink);
      showToast('마법 링크가 클립보드에 복사되었습니다.', 'success');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="reservation-success-page">
      <div className="success-container">
        <div className="success-icon">
          <HiCheckCircle size={80} color="#10b981" />
        </div>
        <h1 className="success-title">예약 요청이 완료되었습니다!</h1>
        <p className="success-message">
          튜터가 예약을 확인한 후 승인하면 레슨이 확정됩니다.
          <br />
          아래 마법 링크를 통해 예약 상태를 확인하실 수 있습니다.
        </p>

        <div className="magic-link-container">
          <label className="magic-link-label">예약 확인 링크</label>
          <div className="magic-link-box">
            <input
              type="text"
              value={magicLink}
              readOnly
              className="magic-link-input"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button onClick={handleCopyLink} className="copy-button">
              복사
            </Button>
          </div>
          <p className="magic-link-description">
            이 링크를 저장해두시면 언제든지 예약 상태를 확인할 수 있습니다.
          </p>
        </div>

        <div className="action-buttons">
          <Button onClick={handleGoHome} className="home-button">
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
