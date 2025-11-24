import type { TutorProfile } from '../api/types';

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

// 후기 관련 타입
export interface Review {
  reviewNo: number;
  studentName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ReviewsResponse {
  summary: {
    totalCount: number;
    averageRating: number;
  };
  reviews: {
    content: Review[];
    pageInfo: PageInfo;
  };
}
