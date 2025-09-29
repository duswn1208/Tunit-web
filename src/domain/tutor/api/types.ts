export interface TutorDetail {
  tutorId: number;
  nickname?: string;
  name?: string;
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
