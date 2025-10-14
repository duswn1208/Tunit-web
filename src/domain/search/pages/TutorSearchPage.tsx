import '../css/tutor-search.css';
import TutorProfileList from '../../profile/components/TutorProfileList.tsx';
import type { TutorProfile } from '../components/TutorProfileCard';
import { fetchTutors } from '../api/tutorSearchApi';
import Header from '../../../components/Header';
import { TutorFilterBar } from '../components/TutorFilterBar';
import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import type { StudentRegion } from '../../../type/student';

// 학생 프로필 응답 타입 정의
export interface StudentProfileResponse {
  nickname: string;
  phone: string;
  userStatus: string;
  studentInfo: {
    lessonSubcategoryList: { code: string; label: string }[];
    regionList: StudentRegion[];
  };
}

export default function TutorSearchPage() {
  const [loading, setLoading] = useState(true);
  const [studentLessons, setStudentLessons] = useState<{ code: string; label: string }[]>([]);
  const [studentRegions, setStudentRegions] = useState<StudentRegion[]>([]);
  // 필터 상태
  const [selectedRegionCodes, setSelectedRegionCodes] = useState<string[]>([]);
  const [selectedLessonCodes, setSelectedLessonCodes] = useState<string[]>([]);
  // 튜터 리스트
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  useEffect(() => {
    api
      .get('/api/users/profile/me')
      .then((res) => {
        const profile = res as StudentProfileResponse;
        setStudentLessons(profile.studentInfo.lessonSubcategoryList);
        setStudentRegions(profile.studentInfo.regionList);
        setLoading(false);
        // 프로필 기반 초기값 세팅
        setSelectedRegionCodes(profile.studentInfo.regionList.map((r) => r.code));
        setSelectedLessonCodes(profile.studentInfo.lessonSubcategoryList.map((l) => l.code));
      })
      .catch((e) => {
        console.error('학생 프로필 조회 실패', e);
        setLoading(false);
      });
  }, []);

  // 필터 값이 바뀔 때마다 tutor 리스트 조회
  useEffect(() => {
    if (loading) return;
    fetchTutors({ regionCodes: selectedRegionCodes, lessonCodes: selectedLessonCodes })
      .then(setTutors)
      .catch((e) => {
        console.error('튜터 리스트 조회 실패', e);
        setTutors([]);
      });
  }, [selectedRegionCodes, selectedLessonCodes, loading]);

  if (loading) {
    return <div>로딩 중...</div>;
  }
  return (
    <div>
      <Header title="튜터 찾기" />
      <TutorFilterBar
        initialRegion={studentRegions}
        initialLessons={studentLessons}
        // 필터 변경 시 region/lesson code 배열을 업데이트
        onRegionChange={(regionList: any[]) =>
          setSelectedRegionCodes(regionList.map((r) => r.code))
        }
        onLessonChange={(lessonList: any[]) =>
          setSelectedLessonCodes(lessonList.map((l) => l.code))
        }
      />
      <TutorProfileList tutors={tutors} />
    </div>
  );
}
