import '../css/tutor-search.css';
import TutorProfileList from '../../profile/components/TutorProfileList.tsx';
import { fetchTutors } from '../api/tutorSearchApi';
import Header from '@/shared/components/Header';
import { TutorFilterBar } from '../components/TutorFilterBar';
import { useEffect, useState } from 'react';
import { api } from '../../../shared/lib/api.ts';
import type { StudentRegion } from '../../region/types/student.ts';
import type { TutorProfile } from '@/domain/tutor/api/types.ts';

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
  const [sortType, setSortType] = useState<string>('REVIEW');
  // 튜터 리스트
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  useEffect(() => {
    api
      .get('/api/users/profile/me')
      .then((res) => {
        const profile = res as StudentProfileResponse;
        if (profile.studentInfo) {
          setStudentLessons(profile.studentInfo.lessonSubcategoryList || []);
          setStudentRegions(profile.studentInfo.regionList || []);
          // 프로필 기반 초기값 세팅
          setSelectedRegionCodes(profile.studentInfo.regionList?.map((r) => r.code) || []);
          setSelectedLessonCodes(profile.studentInfo.lessonSubcategoryList?.map((l) => l.code) || []);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log('프로필 없음 또는 비로그인 사용자', e);
        // 로그인하지 않은 경우에도 튜터 검색 가능하도록 처리
        setLoading(false);
      });
  }, []);

  // 필터 값이 바뀔 때마다 tutor 리스트 조회
  useEffect(() => {
    if (loading) return;
    fetchTutors({ regionCodes: selectedRegionCodes, lessonCodes: selectedLessonCodes, sortType })
      .then(setTutors)
      .catch((e) => {
        console.error('튜터 리스트 조회 실패', e);
        setTutors([]);
      });
  }, [selectedRegionCodes, selectedLessonCodes, sortType, loading]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      <Header title="튜터 찾기" />
      <TutorFilterBar
        initialRegion={studentRegions}
        initialLessons={studentLessons}
        initialSort={sortType}
        onRegionChange={(regionList: any[]) =>
          setSelectedRegionCodes(regionList.map((r) => r.code))
        }
        onLessonChange={(lessonList: any[]) =>
          setSelectedLessonCodes(lessonList.map((l) => l.code))
        }
        onSortChange={setSortType}
      />
      <TutorProfileList tutors={tutors} />
    </div>
  );
}
