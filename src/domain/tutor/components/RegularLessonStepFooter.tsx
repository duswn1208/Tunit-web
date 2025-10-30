import { Button } from '@/shared/components';

interface RegularLessonStepFooterProps {
  onPrev?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  nextType?: 'button' | 'submit';
  prevLabel?: string;
  nextClassName?: string;
  nextSize?: 'sm';
}
export default function RegularLessonStepFooter({
  onPrev,
  onNext,
  nextLabel = '다음',
  nextDisabled = false,
  nextType = 'button',
  prevLabel = '이전',
  nextClassName = 'flex-2',
  nextSize = 'sm',
}: RegularLessonStepFooterProps) {
  console.log(onPrev);
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {onPrev && (
        <Button type="button" onClick={onPrev} className="flex-2 ui-btn--outline ui-btn--fill">
          {prevLabel}
        </Button>
      )}
      <Button
        type={nextType}
        onClick={onNext}
        disabled={nextDisabled}
        className="flex-1"
        size={nextSize}
      >
        {nextLabel}
      </Button>
    </div>
  );
}
