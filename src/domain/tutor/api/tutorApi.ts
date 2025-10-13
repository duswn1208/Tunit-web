import { api } from '@/lib/api';

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
