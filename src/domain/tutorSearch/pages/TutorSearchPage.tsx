import '../css/tutor-search.css';
import TutorProfileList from '../components/TutorProfileList';
import type { TutorProfile } from '../components/TutorProfileCard';
import Header from '../../../components/Header';
import { TutorFilterBar } from '../components/TutorFilterBar';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import type { StudentLesson, StudentRegion } from '../../../type/student';

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

// 학생 프로필 응답 타입 정의
export interface StudentProfileResponse {
  nickname: string;
  phone: string;
  userStatus: string;
  studentInfo: {
    lessonSubcategoryList: StudentLesson[];
    regionList: StudentRegion[];
    // ...추가 필드 필요시 여기에
  };
  // ...추가 필드 필요시 여기에
}

export default function TutorSearchPage() {
  const [studentLessons, setStudentLessons] = useState<StudentLesson[]>([]);
  const [studentRegions, setStudentRegions] = useState<StudentRegion[]>([]);
  useEffect(() => {
    api('/api/users/profile/me', { method: 'GET' })
      .then((res) => {
        const profile = res as StudentProfileResponse;
        // console.log('학생 프로필', profile);
        setStudentLessons(profile.studentInfo.lessonSubcategoryList);
        setStudentRegions(profile.studentInfo.regionList);

        console.log('학생 레슨', profile.studentInfo.lessonSubcategoryList);
        console.log('학생 지역', profile.studentInfo.regionList);
      })
      .catch((e) => {
        console.error('학생 프로필 조회 실패', e);
      });
  }, []);

  return (
    <div>
      <Header title="튜터 찾기" />
      <TutorFilterBar
        initialRegion={
          studentRegions.length ? studentRegions : [] // 전체 지역(빈 배열)
        }
        initialLessons={
          studentLessons.length ? studentLessons.map((l) => l.lessonSubCategory.label) : [] // 전체 레슨(빈 배열)
        }
      />
      {/* 필터바, 프로필 리스트 등 컴포넌트 배치 예정 */}
      <TutorProfileList tutors={sampleTutors} />
    </div>
  );
}
