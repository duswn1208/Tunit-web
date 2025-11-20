import { api } from '@/shared/lib/api.ts';
import type { ReviewsResponse } from '../types/tutor';

export type TutorDetailResponse = {
  tutorProfileNo: number;
  nickname: string;
  photoUrl?: string;
  introduce: string;
  regionList: {
    code: string;
    label: string;
    fullName: string;
  }[];
  lessonSubcategoryList: {
    tutorLessonNo: number;
    isMain: boolean;
    lessonCategory: {
      code: string;
      label: string;
    };
  }[];
  careerYears: number;
  pricePerHour: number;
  rating?: number;
  tutorAvailableTimeList: {
    dayOfWeekNum: number;
    startTime: string;
    endTime: string;
  }[];
  tutorHolidayList: {
    dayOfWeekNum: number;
    startTime: string;
    endTime: string;
  }[];
};

export async function fetchTutorDetail(tutorId: number): Promise<TutorDetailResponse> {
  return api.get<TutorDetailResponse>(`/api/tutors/${tutorId}`);
}

export async function fetchTutorReviews(
  tutorId: number,
  page: number = 0,
  size: number = 10
): Promise<ReviewsResponse> {
  return api.get<ReviewsResponse>(`/api/reviews/tutor/${tutorId}`, {
    params: { page, size },
  });
}
