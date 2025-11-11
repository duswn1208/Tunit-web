import type { PaymentStatusCode } from '../types/contract';
import '../css/my-tutors.css';
import Button from '@/shared/components/Button';

interface PaymentStatusAlertProps {
  paymentStatus: PaymentStatusCode;
  onConfirm?: () => void;
}

const PAYMENT_STATUS_CONFIG: Record<
  PaymentStatusCode,
  {
    icon: string;
    message: string;
    showButton: boolean;
    alertClass: string;
  }
> = {
  REQUESTED: {
    icon: '⏳',
    message: '결제 요청 중입니다',
    showButton: false,
    alertClass: 'payment-alert--requested',
  },
  CONFIRMING: {
    icon: '💳',
    message: '학생이 결제했어요, 내역을 확인해주세요',
    showButton: true,
    alertClass: 'payment-alert--confirming',
  },
  PAID: {
    icon: '✅',
    message: '결제가 완료되었습니다',
    showButton: false,
    alertClass: 'payment-alert--paid',
  },
  PARTIAL: {
    icon: '📝',
    message: '부분 결제가 완료되었습니다',
    showButton: false,
    alertClass: 'payment-alert--partial',
  },
  REJECTED: {
    icon: '❌',
    message: '결제가 거부되었습니다',
    showButton: false,
    alertClass: 'payment-alert--rejected',
  },
  REFUNDED: {
    icon: '↩️',
    message: '환불이 완료되었습니다',
    showButton: false,
    alertClass: 'payment-alert--refunded',
  },
};

export default function PaymentStatusAlert({ paymentStatus, onConfirm }: PaymentStatusAlertProps) {
  const config = PAYMENT_STATUS_CONFIG[paymentStatus];

  if (!config) return null;

  return (
    <div className={`payment-status-alert ${config.alertClass}`}>
      <span className="alert-icon">{config.icon}</span>
      <span className="alert-text">{config.message}</span>
      {config.showButton && onConfirm && (
        <Button
          className="payment-confirm-btn"
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          tooltip="확인완료를 누르면 레슨이 확정됩니다"
        >
          확인완료
        </Button>
      )}
    </div>
  );
}
