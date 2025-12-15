import Header from '@/shared/components/Header';
import SelectBox from '@/shared/components/SelectBox';
import ContractRequestStepFooter from './ContractRequestStepFooter';
import ContractPriceBox from './ContractPriceBox';
import { getContractTypeLessonCount, isTrial, type ContractType } from '../types/types';
import './css/lesson-booking.css';

interface ContractRequestStep1Props {
  lessonCategory: string;
  setLessonCategory: (v: string) => void;
  lessonCategoryOptions: { label: string; value: string }[];
  place: string;
  setPlace: (v: string) => void;
  weekCount: number;
  setWeekCount: (v: number) => void;
  pricePerLesson?: number;
  contractType?: ContractType;
  onPrev?: () => void;
  onNext: () => void;
}

export default function ContractRequestStep1({
  lessonCategory,
  setLessonCategory,
  lessonCategoryOptions,
  place,
  setPlace,
  weekCount,
  setWeekCount,
  pricePerLesson = 30000,
  contractType = 'REGULAR',
  onPrev,
  onNext,
}: ContractRequestStep1Props) {
  // 총 횟수 및 금액 계산 (계약 유형에 따라)
  const totalLessons = getContractTypeLessonCount(contractType, weekCount);
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
      {/* 체험 레슨이 아닐 때만 레슨 주 횟수 선택 표시 */}
      {!isTrial(contractType) && (
        <>
          <Header title="레슨 주 횟수" />
          <SelectBox
            value={String(weekCount)}
            onChange={(v) => setWeekCount(Number(v))}
            options={lessonCountOptions}
            placeholder="주 횟수 선택"
          />
        </>
      )}
      <Header title="레슨 희망 장소" />
      <input
        type="text"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        placeholder="예: 튜터에 의해 변경될 수 있어요"
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
      <ContractPriceBox
        totalPrice={totalPrice}
        lessonCount={weekCount}
        totalLessons={totalLessons}
        isTrial={isTrial(contractType)}
      />
      <ContractRequestStepFooter
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
