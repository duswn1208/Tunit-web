import type { TutorProfile } from '../../tutorSearch/components/TutorProfileCard';

export interface TutorDetailResponse {
  tutor: TutorProfile;
  availabilities: {
    dayOfWeekNum: number;
    startTime: string;
    endTime: string;
  }[];
  // 필요한 추가 정보들...
}

export interface TutorDetailRequest {
  tutorId: string;
}
