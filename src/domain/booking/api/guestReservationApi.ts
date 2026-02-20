import { api } from '@/shared/lib/api';

export interface GuestReservationRequest {
  studentName: string;
  phone: string;
  lessonCategory: string; // LessonSubCategory enum code
  lessonDate: string; // yyyy-MM-dd
  startTime: string; // HH:mm
  totalPrice?: number;
  place?: string;
  level?: string; // 레슨 경험 (옵셔널)
  memo?: string; // 요청사항 (옵셔널)
  emergencyContact?: string; // 비상연락처 (옵셔널)
}

export interface GuestReservationCreateResponse {
  message: string;
  magicLink: string;
}

export interface GuestReservationResponse {
  reservationNo: number;
  studentName: string;
  tutorName: string;
  lessonDate: string;
  startTime: string;
  endTime: string;
  lessonCategory: string;
  status: string; // ReservationStatus
  memo?: string;
}

/**
 * 비회원 예약 생성 (로그인 불필요)
 */
export const createGuestReservation = async (
  tutorProfileNo: number,
  data: GuestReservationRequest
): Promise<GuestReservationCreateResponse> => {
  const response = await api.post(
    `/api/public/reservations/tutors/${tutorProfileNo}`,
    data
  );
  return response as GuestReservationCreateResponse;
};

/**
 * 마법 링크로 예약 조회 (로그인 불필요)
 */
export const getReservationByToken = async (
  token: string
): Promise<GuestReservationResponse> => {
  const response = await api.get(`/api/public/reservations/verify/${token}`);
  return response as GuestReservationResponse;
};

/**
 * 마법 링크로 예약 승인/거절 (로그인 불필요)
 */
export const handleReservationAction = async (
  token: string,
  action: 'confirm' | 'reject'
): Promise<string> => {
  const response = await api.post(`/api/public/reservations/${token}/action`, null, {
    params: { action },
  });
  return response as string;
};
