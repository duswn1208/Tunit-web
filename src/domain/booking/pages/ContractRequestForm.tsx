import { useState } from 'react';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import ContractRequestStep1 from '@/domain/booking/components/ContractRequestStep1';
import ContractRequestStep2 from '@/domain/booking/components/ContractRequestStep2';
import LLessonBookingStep3 from '@/domain/booking/components/ContractRequestStep3';
import ContractRequestStep4 from '@/domain/booking/components/ContractRequestStep4';
import TrialCandidateSelector from '@/domain/booking/components/TrialCandidateSelector';
import { requestContract, updateContract } from '../api/lessonBookingApi';
import { createTrialContract } from '@/domain/contract/api/trialContractApi';
import {
  CONTRACT_TYPES,
  getContractTypeLessonCount,
  isRegular,
  isTrial,
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
  // Edit 모드 props
  mode?: 'create' | 'edit';
  contractNo?: number;
  initialData?: {
    lessonCategory?: { label: string; value: string };
    place?: string;
    weekCount?: number;
    lessonDtList?: string[];
    level?: string;
    memo?: string;
    emergencyContact?: string;
  };
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
  mode = 'create',
  contractNo,
  initialData,
}: LessonBookingFormProps) {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [lessonCategory, setLessonCategory] = useState<{ label: string; value: string } | null>(
    initialData?.lessonCategory || null
  );
  const [place, setPlace] = useState(initialData?.place || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [lessonDtList, setLessonDtList] = useState<string[]>(initialData?.lessonDtList || []);
  const [level, setLevel] = useState(initialData?.level || '');
  const [memo, setMemo] = useState(initialData?.memo || '');
  const [emergencyContact, setEmergencyContact] = useState(
    initialData?.emergencyContact || defaultPhone || ''
  );
  const [weekCount, setWeekCount] = useState(initialData?.weekCount || 1);
  
  // 체험 레슨용 후보 시간 state 추가
  const [trialCandidates, setTrialCandidates] = useState<
    Array<{
      priority: number;
      candidateDate: string;
      candidateStartTime: string;
    }>
  >([]);

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };
  const handlePrev = () => {
    setCurrentStep((prev) => prev - 1);
  };
  const handleSubmit = async () => {
    try {
      // 체험 레슨인 경우
      if (isTrial(contractType!)) {
        await createTrialContract({
          tutorProfileNo: Number(tutorProfileNo),
          contractType: 'TRIAL',
          lessonCategory: lessonCategory?.value || '',
          place,
          level,
          memo,
          emergencyContact,
          totalPrice: pricePerLesson,
          trialCandidates: trialCandidates,
        });
        
        showToast('체험 레슨이 신청되었습니다. 튜터의 확인을 기다려주세요.');
        navigate('/student/my/tutors');
        return;
      }
      
      // 기존 정규/선착순 레슨 처리
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
      
      if (mode === 'edit' && contractNo) {
        await updateContract(contractNo, bookingData);
        showToast('계약이 수정되었습니다.');
        navigate('/student/my/tutors');
      } else {
        await requestContract(bookingData);
        onSubmit(bookingData);
        showToast('예약 요청이 완료되었습니다.');
        navigate('/student/my/tutors');
      }
    } catch (e: any) {
      showToast(e.message ?? `${mode === 'edit' ? '수정' : '예약 요청'}에 실패했습니다.`, 'error');
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
          weekCount={weekCount}
          setWeekCount={setWeekCount}
          pricePerLesson={pricePerLesson}
          contractType={contractType}
          onPrev={onFirst}
          onNext={handleNext}
        />
      )}
      {currentStep === 2 && isTrial(contractType!) && (
        <TrialCandidateSelector
          tutorProfileNo={tutorProfileNo}
          candidates={trialCandidates}
          onChange={setTrialCandidates}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
      {currentStep === 2 && !isTrial(contractType!) && (
        <ContractRequestStep2
          tutorProfileNo={tutorProfileNo}
          contractType={contractType}
          weekCount={weekCount}
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
          step2={{ 
            lessonDtList,
            trialCandidates: isTrial(contractType!) ? trialCandidates : undefined 
          }}
          step3={{ level, memo, emergencyContact }}
          onPrev={handlePrev}
          onSubmit={handleSubmit}
          totalPrice={pricePerLesson * getContractTypeLessonCount(contractType!, weekCount)}
        />
      )}
    </OnboardingLayout>
  );
}
