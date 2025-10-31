import Header from '@/shared/components/Header';
import SelectBox from '@/shared/components/SelectBox';
import LessonBookingStepFooter from './LessonBookingStepFooter';
import './css/lesson-booking.css';

interface LessonBookingStep1Props {
  lessonCategory: string;
  setLessonCategory: (v: string) => void;
  lessonCategoryOptions: { label: string; value: string }[];
  place: string;
  setPlace: (v: string) => void;
  lessonCount: number;
  setLessonCount: (v: number) => void;
  pricePerLesson?: number;
  onPrev?: () => void;
  onNext: () => void;
}

export default function LessonBookingStep1({
  lessonCategory,
  setLessonCategory,
  lessonCategoryOptions,
  place,
  setPlace,
  lessonCount,
  setLessonCount,
  pricePerLesson = 30000,
  onPrev,
  onNext,
}: LessonBookingStep1Props) {
  // 총 횟수 및 금액 계산
  const totalLessons = lessonCount * 4;
  const totalPrice = totalLessons * pricePerLesson;

  // 회차 옵션 (value를 string으로)
  const lessonCountOptions = Array.from({ length: 7 }, (_, i) => ({
    label: `주 ${i + 1}회`,
    value: String(i + 1),
  }));

  return (
    <div>
      <Header title="레슨 과목 선택" />
      <SelectBox
        value={lessonCategory}
        onChange={setLessonCategory}
        options={lessonCategoryOptions}
        placeholder="레슨 과목을 선택해주세요"
      />
      <Header title="레슨 주 횟수" />
      <SelectBox
        value={String(lessonCount)}
        onChange={(v) => setLessonCount(Number(v))}
        options={lessonCountOptions}
        placeholder="주 횟수 선택"
      />
      <Header title="레슨 희망 장소" />
      <input
        type="text"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        placeholder="예: 강남역 1번 출구 앞 카페"
        style={{
          width: '100%',
          borderRadius: 8,
          border: '1px solid #ddd',
          padding: 10,
          fontSize: 15,
          margin: '12px 0 0 0',
        }}
        required
      />
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
          (선택한 주 {lessonCount}회, 총 {totalLessons}회 기준입니다.)
        </span>
      </div>
      <LessonBookingStepFooter
        onPrev={onPrev}
        onNext={onNext}
        nextLabel="다음"
        nextDisabled={!lessonCategory}
        prevLabel="처음으로"
        nextType="button"
      />
      <span
        style={{
          fontSize: 11,
          color: '#333',
          marginTop: 2,
          fontWeight: 400,
          letterSpacing: '-0.01em',
        }}
      >
        * 최종 금액은 튜터와 스케줄 조율 후 확정됩니다. (출장비, 장소 대여료 등 변동 요인 포함)
      </span>
    </div>
  );
}
