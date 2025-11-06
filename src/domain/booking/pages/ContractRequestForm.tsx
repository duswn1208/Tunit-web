import { useState } from 'react';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import ContractRequestStep1 from '@/domain/booking/components/ContractRequestStep1';
import ContractRequestStep2 from '@/domain/booking/components/ContractRequestStep2';
import LLessonBookingStep3 from '@/domain/booking/components/ContractRequestStep3';
import ContractRequestStep4 from '@/domain/booking/components/ContractRequestStep4';
import { requestContract } from '../api/lessonBookingApi';
import {
  CONTRACT_TYPES,
  getContractTypeLessonCount,
  isRegular,
  type ContractType,
} from '../types/types';
import { useToast } from '@/shared/contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

interface LessonBookingFormProps {
  tutorProfileNo: string;
  step: number;
  total: number;
  contractType?: ContractType;
  totalCount?: number;
  title: string;
  subtitle?: string;
  lessonCategoryOptions: { label: string; value: string }[];
  defaultPhone?: string;
  pricePerLesson?: number;
  onSubmit: (data: any) => void;
  onFirst?: () => void;
}

export default function ContractRequestForm({
  tutorProfileNo,
  total,
  contractType = CONTRACT_TYPES.REGULAR,
  totalCount,
  title,
  subtitle,
  lessonCategoryOptions,
  defaultPhone,
  pricePerLesson = 0,
  onSubmit,
  onFirst,
}: LessonBookingFormProps) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [lessonCategory, setLessonCategory] = useState<{ label: string; value: string } | null>(
    null
  );
  const [place, setPlace] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [lessonDtList, setLessonDtList] = useState<string[]>([]);
  const [level, setLevel] = useState('');
  const [memo, setMemo] = useState('');
  const [emergencyContact, setEmergencyContact] = useState(defaultPhone || '');
  const [weekCount, setLessonCount] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const handleSubmit = async () => {
    const bookingData = {
      tutorProfileNo,
      contractType,
      lessonCategory: lessonCategory ? lessonCategory.value : '',
      place,
      weekCount,
      lessonCount: getContractTypeLessonCount(contractType!, weekCount),
      lessonDtList,
      level,
      memo,
      emergencyContact,
      totalPrice: lessonDtList.length * pricePerLesson,
    };
    try {
      await requestContract(bookingData);
      // 성공 시 후처리(예: 알림, 이동 등)
      onSubmit(bookingData);
      showToast('예약 요청이 완료되었습니다.');
      // 추가 성공 처리 로직 작성 가능
      navigate('/student/my/tutors');
    } catch (e) {
      showToast('예약 요청에 실패했습니다.');
    }
  };

  const handleLessonCategoryChange = (value: string) => {
    const found = lessonCategoryOptions.find((opt) => opt.value === value) || null;
    setLessonCategory(found);
  };

  return (
    <OnboardingLayout title={title} subtitle={subtitle} step={currentStep} total={total}>
      {currentStep === 1 && (
        <ContractRequestStep1
          lessonCategory={lessonCategory ? lessonCategory.value : ''}
          setLessonCategory={handleLessonCategoryChange}
          lessonCategoryOptions={lessonCategoryOptions}
          place={place}
          setPlace={setPlace}
          lessonCount={weekCount}
          setLessonCount={setLessonCount}
          pricePerLesson={pricePerLesson}
          contractType={contractType}
          onPrev={onFirst}
          onNext={handleNext}
        />
      )}
      {currentStep === 2 && (
        <ContractRequestStep2
          tutorProfileNo={tutorProfileNo}
          contractType={contractType}
          totalCount={isRegular(contractType) ? weekCount * 4 : 1}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onPrev={handlePrev}
          onNext={(nextLessonDt: string[]) => {
            setLessonDtList(nextLessonDt); // slot string[] 저장
            // 첫 번째 slot에서 날짜/시간 추출해 기존 selectedDate/selectedTime도 세팅(호환성)
            if (nextLessonDt.length > 0) {
              const [date, time] = nextLessonDt[0].split(' ');
              setSelectedDate(date);
              setSelectedTime(time);
            }
            handleNext();
          }}
        />
      )}
      {currentStep === 3 && (
        <LLessonBookingStep3
          level={level}
          setLevel={setLevel}
          memo={memo}
          setMemo={setMemo}
          emergencyContact={emergencyContact}
          setEmergencyContact={setEmergencyContact}
          onPrev={handlePrev}
          onSubmit={handleNext}
        />
      )}
      {currentStep === 4 && (
        <ContractRequestStep4
          step1={{
            lessonCategory: lessonCategory,
            place,
            contractType,
            weekCount,
            lessonCount: getContractTypeLessonCount(contractType!, weekCount),
          }}
          step2={{ lessonDtList }}
          step3={{ level, memo, emergencyContact }}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
          totalPrice={pricePerLesson * getContractTypeLessonCount(contractType!, weekCount)}
        />
      )}
    </OnboardingLayout>
  );
}
