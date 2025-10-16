import type { TutorProfile } from '@/domain/search/components/TutorProfileCard';

interface LessonCategory {
  code: string;
  label: string;
}

interface Region {
  code: string;
  label: string;
}

interface LessonSubcategory {
  tutorLessonNo: number;
  lessonCategory: LessonCategory;
}

export interface TutorDetailResponse {
  tutor: TutorProfile;
  tutorAvailableTimeList: {
    dayOfWeekNum: number;
    startTime: string;
    endTime: string;
  }[];
  lessonSubcategoryList: LessonSubcategory[];
  regionList: Region[];
}

export interface TutorDetailRequest {
  tutorId: string;
}
