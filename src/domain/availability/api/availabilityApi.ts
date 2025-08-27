import type { WeeklyAvailabilityRequest, WeeklyAvailabilityResponse } from '../types/availability';
import { api } from '../../../lib/api';

const BASE_URL = '/api/tutors';

export async function getWeeklyAvailability(tutorNo: number): Promise<WeeklyAvailabilityResponse> {
  return api<WeeklyAvailabilityResponse>(`${BASE_URL}/${tutorNo}/availabilities/weekly`, {
    method: 'GET',
  });
}

export async function upsertWeeklyAvailability(
  tutorNo: number,
  body: WeeklyAvailabilityRequest
): Promise<void> {
  return api<void>(`${BASE_URL}/${tutorNo}/availabilities/weekly`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
