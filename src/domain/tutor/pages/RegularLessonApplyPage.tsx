import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import RegularLessonStep1Form from '../components/RegularLessonStep1Form';
import RegularLessonStep2Form from '../components/RegularLessonStep2Form';
import RegularLessonStep3Form from '../components/RegularLessonStep3Form';
import RegularLessonStep4Form from '../components/RegularLessonStep4Form';
import { useTutorDetail } from '../hooks/useTutorDetail';

const steps = [
  '계약 유형',
  '레슨 기간/횟수',
  '희망 스케줄',
  '희망 장소',
  '레슨 목표',
  '최종 시뮬레이션',
];

export default function RegularLessonApplyPage() {
  const { tutorId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // 쿼리스트링(type)으로 contractType 결정
  let contractType: 'REGULAR' | 'FIRSTCOME' = 'REGULAR';
  const searchParams = new URLSearchParams(location.search);
  if (searchParams.get('type') === 'firstcome') contractType = 'FIRSTCOME';
  // const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [step1Data, setStep1Data] = useState<{
    lessonPackage: string;
    place: string;
    price: number;
    lessonCategory: string;
    contractType: string;
  } | null>(null);
  const [step2Data, setStep2Data] = useState<any>(null);
  const [step3Data, setStep3Data] = useState<any>(null);
  const { data: tutorData } = useTutorDetail(tutorId ?? '');
  const defaultPlace = tutorData?.regionList?.[0]?.label || '';

  return (
    <div>
      {step === 0 ? (
        <RegularLessonStep1Form
          contractType={contractType}
          defaultPlace={defaultPlace}
          pricePerHour={tutorData?.pricePerHour ?? 0}
          lessonCategoryOptions={
            Array.isArray(tutorData?.lessonSubcategoryList)
              ? tutorData.lessonSubcategoryList.map((sub) => ({
                  label: sub.lessonCategory.label,
                  value: sub.lessonCategory.code,
                }))
              : []
          }
          onNext={(step1Data) => {
            setStep1Data(step1Data);
            setStep((s) => s + 1);
          }}
          onFirst={() => {
            navigate(`/tutors/${tutorId}`);
          }}
        />
      ) : step === 1 && step1Data ? (
        <RegularLessonStep2Form
          totalCount={
            step1Data.contractType === 'FIRSTCOME' ? 1 : Number(step1Data.lessonPackage) * 4
          }
          contractType={step1Data.contractType}
          onPrev={() => setStep((s) => s - 1)}
          onNext={(data) => {
            setStep2Data(data);
            setStep((s) => s + 1);
          }}
        />
      ) : step === 2 && step2Data ? (
        <RegularLessonStep3Form
          defaultPhone={tutorData?.userPhone ?? ''}
          onPrev={() => setStep((s) => s - 1)}
          onNext={(data) => {
            setStep3Data(data);
            setStep((s) => s + 1);
          }}
        />
      ) : step === 3 && step1Data && step2Data && step3Data ? (
        <RegularLessonStep4Form
          step1={step1Data}
          step2={step2Data}
          step3={step3Data}
          totalPrice={Number(step1Data.lessonPackage) * (step1Data.price || 0)}
          onPrev={() => setStep((s) => s - 1)}
          onSubmit={() => {
            // TODO: 결제 및 신청 처리
          }}
        />
      ) : (
        <div style={{ color: '#333', fontSize: 18 }}>{steps[step]} 단계 UI (추후 구현)</div>
      )}
    </div>
  );
}
