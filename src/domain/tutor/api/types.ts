import type { Category } from '../../onboarding/types/onboarding.ts';
import type { Region } from '../../region/types/regions';

export interface TutorDetail {
  tutorProfileNo: string;
  tutorId: number;
  userInfo: UserMain;
  introduce?: string;
  photoUrl?: string;
  careerYears: number;
  pricePerHour: number;
  rating?: number;
  lessonSubcategoryList?: Array<{
    tutorLessonNo: number;
    lessonCategory: {
      label: string;
    };
  }>;
  regionList?: Array<{
    code: string;
    label: string;
  }>;
  tutorAvailableTimeList?: Array<{
    dayOfWeekNum: number;
    startTime: string;
    endTime: string;
  }>;
}

export interface LessonSubcategory {
  tutorLessonNo: number;
  isMain: boolean;
  lessonCategory: Category;
}

export interface UserMain {
  nickname: string;
  name: string;
  userId: string;
}

export interface TutorProfile {
  tutorProfileNo: string;
  userInfo: UserMain;
  introduce: string;
  photoUrl?: string;
  regionList: Region[];
  lessonSubcategoryList: LessonSubcategory[];
  careerYears: number;
  pricePerHour: number;
  rating?: number;
  tutorAvailableTimeList?: Array<{
    dayOfWeekNum: number;
    startTime: string;
    endTime: string;
  }>;
}
