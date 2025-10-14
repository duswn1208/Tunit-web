import { Button } from '../../../components';

export default function OnboardingNextButton({
  label = '다음 →',
  loading,
  disabled,
  type = 'button',
  addClass,
  onClick,
}: {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  addClass?: string;
  onClick?: any;
}) {
  return (
    <div className="mls-footer">
      <Button
        className={addClass}
        type={type}
        loading={loading}
        disabled={disabled}
        onClick={onClick}
      >
        {label}
      </Button>
    </div>
  );
}
