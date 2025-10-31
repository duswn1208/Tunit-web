import { useState } from 'react';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import LessonBookingStep1 from '@/domain/booking/components/LessonBookingStep1';
import LessonBookingStep2 from '@/domain/booking/components/LessonBookingStep2';
import LLessonBookingStep3 from '@/domain/booking/components/LessonBookingStep3';
import LessonBookingStep4 from '@/domain/booking/components/LessonBookingStep4';
import { requestLessonBooking } from '../api/lessonBookingApi';

interface LessonBookingFormProps {
  tutorProfileNo: string;
  step: number;
  total: number;
  contractType?: string;
  totalCount?: number;
  title: string;
  subtitle?: string;
  lessonCategoryOptions: { label: string; value: string }[];
  defaultPhone?: string;
  pricePerLesson?: number;
  onSubmit: (data: any) => void;
  onFirst?: () => void;
}

export default function LessonBookingForm({
  tutorProfileNo,
  total,
  contractType = '',
  totalCount = 1,
  title,
  subtitle,
  lessonCategoryOptions,
  defaultPhone = '',
  pricePerLesson = 30000,
  onSubmit,
  onFirst,
}: LessonBookingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [lessonCategory, setLessonCategory] = useState<{ label: string; value: string } | null>(
    null
  );
  const [place, setPlace] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [slots, setSlots] = useState<string[]>([]); // slot string[] 상태 추가
  const [level, setLevel] = useState('');
  const [request, setRequest] = useState('');
  const [phone, setPhone] = useState(defaultPhone);
  const [lessonCount, setLessonCount] = useState(1);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const handleSubmit = async () => {
    // step1, step2, step3, price 등 모든 정보 하나의 객체로 합침
    const bookingData = {
      tutorProfileNo,
      lessonCategory,
      place,
      contractType,
      lessonCount,
      totalLessons: contractType === 'REGULAR' ? lessonCount * 4 : 1,
      slots,
      level,
      request,
      phone,
    };
    try {
      await requestLessonBooking(bookingData);
      // 성공 시 후처리(예: 알림, 이동 등)
      onSubmit(bookingData);
    } catch (e) {
      alert('예약 요청에 실패했습니다.');
    }
  };

  const handleLessonCategoryChange = (value: string) => {
    const found = lessonCategoryOptions.find((opt) => opt.value === value) || null;
    setLessonCategory(found);
  };

  return (
    <OnboardingLayout title={title} subtitle={subtitle} step={currentStep} total={total}>
      {currentStep === 1 && (
        <LessonBookingStep1
          lessonCategory={lessonCategory ? lessonCategory.value : ''}
          setLessonCategory={handleLessonCategoryChange}
          lessonCategoryOptions={lessonCategoryOptions}
          place={place}
          setPlace={setPlace}
          lessonCount={lessonCount}
          setLessonCount={setLessonCount}
          pricePerLesson={pricePerLesson}
          onPrev={onFirst}
          onNext={handleNext}
        />
      )}
      {currentStep === 2 && (
        <LessonBookingStep2
          contractType={contractType}
          totalCount={contractType === 'REGULAR' ? lessonCount * 4 : 1}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
          onPrev={handlePrev}
          onNext={(nextSlots: string[]) => {
            setSlots(nextSlots); // slot string[] 저장
            // 첫 번째 slot에서 날짜/시간 추출해 기존 selectedDate/selectedTime도 세팅(호환성)
            if (nextSlots.length > 0) {
              const [date, time] = nextSlots[0].split(' ');
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
          request={request}
          setRequest={setRequest}
          phone={phone}
          setPhone={setPhone}
          onPrev={handlePrev}
          onSubmit={handleNext}
        />
      )}
      {currentStep === 4 && (
        <LessonBookingStep4
          step1={{
            lessonCategory: lessonCategory,
            place,
            contractType,
            lessonCount,
            totalLessons: contractType === 'REGULAR' ? lessonCount * 4 : 1,
          }}
          step2={{ slots }}
          step3={{ level, request, phone }}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
          totalPrice={0}
        />
      )}
    </OnboardingLayout>
  );
}
