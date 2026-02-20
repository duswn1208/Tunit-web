import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/contexts/ToastContext';
import { createGuestReservation, type GuestReservationRequest } from '../api/guestReservationApi';
import { useTutorDetail } from '@/domain/tutor/hooks/useTutorDetail';
import OnboardingLayout from '@/domain/onboarding/components/OnboardingLayout';
import SelectBox from '@/shared/components/SelectBox';
import '../components/css/lesson-booking.css';

export default function GuestReservationPage() {
  const { tutorId } = useParams<{ tutorId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: tutorData, isLoading } = useTutorDetail(tutorId!);

  const [studentName, setStudentName] = useState('');
  const [phone, setPhone] = useState('');
  const [lessonCategory, setLessonCategory] = useState<{ label: string; value: string } | null>(
    null
  );
  const [lessonDate, setLessonDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [place, setPlace] = useState('');
  const [level, setLevel] = useState('');
  const [memo, setMemo] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    // 필수 필드 검증
    if (!studentName.trim()) {
      showToast('이름을 입력해주세요.', 'error');
      return;
    }
    if (!phone.trim()) {
      showToast('전화번호를 입력해주세요.', 'error');
      return;
    }
    if (!lessonCategory) {
      showToast('레슨 과목을 선택해주세요.', 'error');
      return;
    }
    if (!lessonDate) {
      showToast('레슨 날짜를 선택해주세요.', 'error');
      return;
    }
    if (!startTime) {
      showToast('레슨 시작 시간을 선택해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const requestData: GuestReservationRequest = {
        studentName,
        phone,
        lessonCategory: lessonCategory.value,
        lessonDate,
        startTime,
        place: place || undefined,
        level: level || undefined,
        memo: memo || undefined,
        emergencyContact: emergencyContact || undefined,
      };

      const response = await createGuestReservation(Number(tutorId), requestData);
      showToast(response.message, 'success');

      // 마법 링크를 별도 페이지로 표시하거나 클립보드에 복사
      navigate('/guest-reservation/success', {
        state: { magicLink: response.magicLink },
      });
    } catch (error: any) {
      console.error('게스트 예약 실패:', error);
      showToast(error.message || '예약 요청에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !tutorData) {
    return <div>로딩 중...</div>;
  }

  const lessonCategoryOptions = tutorData.lessonSubcategoryList.map((cat: any) => ({
    label: cat.lessonCategory.label,
    value: cat.lessonCategory.code,
  }));

  return (
    <OnboardingLayout
      step={1}
      total={1}
      title="체험 레슨 예약"
      subtitle={`${tutorData.userInfo?.nickname || '튜터'}님께 예약 요청`}
      onPrev={() => navigate(`/tutors/${tutorId}`)}
      onNext={handleSubmit}
      disableNext={isSubmitting}
      nextText={isSubmitting ? '예약 중...' : '예약 요청'}
    >
      <div className="guest-reservation-container">
        <label className="regular-lesson-form-label">이름 *</label>
        <div className="regular-lesson-form-field">
          <input
            type="text"
            placeholder="이름을 입력하세요"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="regular-lesson-form-input"
          />
        </div>

        <label className="regular-lesson-form-label">전화번호 *</label>
        <div className="regular-lesson-form-field">
          <input
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="regular-lesson-form-input"
          />
        </div>

        <div className="guest-form-divider"></div>

        <label className="regular-lesson-form-label">레슨 과목 *</label>
        <div className="regular-lesson-form-field">
          <SelectBox
            options={lessonCategoryOptions}
            value={lessonCategory?.value || ''}
            onChange={(value) => {
              const selected = lessonCategoryOptions.find((opt) => opt.value === value);
              setLessonCategory(selected || null);
            }}
            placeholder="과목을 선택하세요"
          />
        </div>

        <label className="regular-lesson-form-label">레슨 날짜 *</label>
        <div className="regular-lesson-form-field">
          <input
            type="date"
            value={lessonDate}
            onChange={(e) => setLessonDate(e.target.value)}
            className="regular-lesson-form-input"
          />
        </div>

        <label className="regular-lesson-form-label">시작 시간 *</label>
        <div className="regular-lesson-form-field">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="regular-lesson-form-input"
          />
        </div>

        <label className="regular-lesson-form-label">레슨 장소</label>
        <div className="regular-lesson-form-field">
          <input
            type="text"
            placeholder="예: 강남역 스터디룸"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="regular-lesson-form-input"
          />
        </div>

        <label className="regular-lesson-form-label">실력 수준</label>
        <div className="regular-lesson-form-field">
          <input
            type="text"
            placeholder="예: 초급, 중급, 고급"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="regular-lesson-form-input"
          />
        </div>

        <label className="regular-lesson-form-label">요청사항</label>
        <div className="regular-lesson-form-field">
          <textarea
            placeholder="튜터에게 전달할 메시지"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="regular-lesson-form-input"
            rows={4}
          />
        </div>

        <div className="guest-form-notice">
          <p>
            * 필수 입력 항목입니다.
            <br />* 예약 요청 후 튜터 승인이 필요합니다.
            <br />* 예약 확인을 위한 마법 링크가 제공됩니다.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}
