interface LessonPriceBoxProps {
  totalPrice: number;
  lessonCount: number;
  totalLessons: number;
  isTrial?: boolean;
}

export default function ContractPriceBox({
  totalPrice,
  lessonCount,
  totalLessons,
  isTrial = false,
}: LessonPriceBoxProps) {
  return (
    <div
      className="regular-lesson-form-pricebox"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
    >
      <span
        style={{
          fontSize: 13,
          color: 'var(--brand-mint)',
          fontWeight: 700,
          marginBottom: 2,
          letterSpacing: '-0.01em',
        }}
      >
        예상 금액
      </span>
      <span
        style={{
          fontSize: 32,
          color: '#FF4757',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          textShadow: '0 2px 8px #ffeaea',
        }}
      >
        {totalPrice.toLocaleString()}원
      </span>
      <span
        style={{
          fontSize: 14,
          color: 'var(--brand-mint)',
          fontWeight: 600,
          marginTop: 2,
          letterSpacing: '-0.01em',
        }}
      >
        {isTrial
          ? '(체험 레슨 1회 기준입니다.)'
          : `(선택한 주 ${lessonCount}회, 총 ${totalLessons}회 기준입니다.)`}
      </span>
    </div>
  );
}
