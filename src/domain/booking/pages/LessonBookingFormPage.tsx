import { useSearchParams, useLocation, useNavigate, useParams } from 'react-router-dom';
import LessonBookingForm from '../pages/LessonBookingForm';

export default function LessonBookingFormPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const type = searchParams.get('type') || 'regular';

  // 튜터 상세에서 넘겨준 카테고리 옵션 및 가격 사용
  const lessonCategoryOptions = location.state?.lessonCategoryOptions || [];
  const pricePerLesson = location.state?.pricePerLesson || 30000;

  // tutorProfileNo 추출 (라우트 param)
  const tutorProfileNo = params.tutorId;

  // type에 따라 타이틀, contractType 등 분기
  let title = '레슨 예약';
  let contractType = '';
  let total = 3;
  if (type === 'regular') {
    title = '정기 레슨 예약';
    contractType = 'REGULAR';
    total = 3;
  } else if (type === 'firstcome') {
    title = '선착순 레슨 예약';
    contractType = 'FIRSTCOME';
    total = 1;
  } else if (type === 'trial') {
    title = '체험 레슨 예약';
    contractType = 'TRIAL';
    total = 1;
  }

  return (
    <LessonBookingForm
      tutorProfileNo={tutorProfileNo}
      step={1}
      total={total}
      title={title}
      contractType={contractType}
      lessonCategoryOptions={lessonCategoryOptions}
      pricePerLesson={pricePerLesson}
      onSubmit={() => {}}
      onFirst={() => {
        if (tutorProfileNo) navigate(`/tutors/${tutorProfileNo}`);
      }}
    />
  );
}
