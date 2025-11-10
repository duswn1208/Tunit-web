import Header from '@/shared/components/Header';
import LessonHistorySection from '../components/LessonHistorySection';
import { useParams, useSearchParams } from 'react-router-dom';

export default function LessonStudentPage() {
  const [params] = useSearchParams();
  const contractNoParam = params.get('contractNo');

  const title = contractNoParam ? '계약별 레슨 내역' : '전체 레슨';
  return (
    <div>
      <Header title={title} />
      <LessonHistorySection />
    </div>
  );
}
