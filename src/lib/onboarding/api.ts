import { api } from '../api';
import type { TutorOnboardingPayload } from '../../type/onboarding';
import type { SelectedRegion } from '../../domain/region/types/regions';
import { toRegionPayload } from './mapper';
import { loadAvailability, loadLessonCategory, loadRegion, loadTutorProfile } from './storage';

export async function saveTutorOnboardingNow(
  selectedRegions: SelectedRegion[],
  opts?: {
    endpoint?: string;
    signal?: AbortSignal;
  }
): Promise<void> {
  const profile = loadTutorProfile();
  const lesson = loadLessonCategory();
  const region = loadRegion();
  const availability = loadAvailability();
  if (!profile) throw new Error('튜터 프로필 데이터가 없습니다. (onboarding.tutor.profile)');
  if (!lesson) throw new Error('레슨 데이터가 없습니다. (onboarding.tutor.lesson)');
  if (!region || region.length === 0)
    throw new Error('지역 데이터가 없습니다. (onboarding.tutor.region)');
  if (!availability || !availability.items || availability.items.length === 0)
    throw new Error('가능 시간 데이터가 없습니다. (onboarding.tutor.availability)');

  const regions = toRegionPayload(selectedRegions);
  const tutorAvailableTimeSaveDtoList = availability.items || [];
  const payload: TutorOnboardingPayload & { tutorAvailableTimeSaveDtoList: any[] } = {
    profile: profile,
    lesson: lesson,
    regions,
    tutorAvailableTimeSaveDtoList,
  };

  console.log('Submitting Tutor Onboarding Payload:', JSON.stringify(payload));
  await api<void>(opts?.endpoint ?? '/api/tutor/profile/join', {
    method: 'POST',
    credentials: 'include',
    signal: opts?.signal,
    body: JSON.stringify(payload),
  });
}

// toRegionPayload는 mapper.ts로 분리 예정
