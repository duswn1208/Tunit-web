import type { WeeklyAvailabilityResponse } from '../types/availability';
import { api } from '../../../../lib/api';

const BASE_URL = '/api/tutors';

export async function getWeeklyAvailability(tutorNo: number): Promise<WeeklyAvailabilityResponse> {
  return api<WeeklyAvailabilityResponse>(`${BASE_URL}/${tutorNo}/availabilities/weekly`, {
    method: 'GET',
  });
}
