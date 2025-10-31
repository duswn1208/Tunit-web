// 레슨 예약 요청 API
import { api } from '@/shared/lib/api';

export interface LessonBookingRequest {
  tutorProfileNo: string;
  contractType: string;
  lessonCategory: string;
  place: string;
  lessonCount: number;
  totalLessons: number;
  slots: string[];
  level: string;
  request: string;
  phone: string;
  pricePerLesson: number;
}

export async function requestLessonBooking(data: LessonBookingRequest) {
  // 실제 API 엔드포인트에 맞게 URL 수정 필요
  return await api.post('/api/lesson-booking', data);
}
