import { api } from '@/lib/api';

export type TutorDetailResponse = {
  tutorProfileNo: string;
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
};

export async function fetchTutorDetail(tutorId: string): Promise<TutorDetailResponse> {
  return api<TutorDetailResponse>(`/api/tutors/${tutorId}`, {
    method: 'GET',
  });
}
