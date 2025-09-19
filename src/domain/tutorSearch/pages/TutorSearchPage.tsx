import '../css/tutor-search.css';
import TutorProfileList from '../components/TutorProfileList';
import type { TutorProfile } from '../components/TutorProfileCard';
import Header from '../../../components/Header';
import TutorFilterBar from '../components/TutorFilterBar';

// 샘플 데이터 (실제 개발 시 API 연동)
const sampleTutors: TutorProfile[] = [
  {
    id: '1',
    name: '김튜터',
    region: '서울 강남구',
    lessons: ['영어', '수학'],
    rating: 4.8,
    photoUrl: '',
  },
  {
    id: '2',
    name: '이선생',
    region: '경기 성남시',
    lessons: ['과학'],
    rating: 4.5,
    photoUrl: '',
  },
];

export default function TutorSearchPage() {
  return (
    <div>
      <Header title="튜터 찾기" />
      <TutorFilterBar />
      {/* 필터바, 프로필 리스트 등 컴포넌트 배치 예정 */}
      <TutorProfileList tutors={sampleTutors} />
    </div>
  );
}
