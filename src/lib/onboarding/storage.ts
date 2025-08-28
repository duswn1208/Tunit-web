import type {
  Step1 as UserRole,
  Step2 as TutorProfile,
  Step3 as LessonCategory,
} from '../../type/onboarding';
// 온보딩 단계별 localStorage key 상수화
export const ONBOARDING_KEY = {
  userRole: 'onboarding.user.role',
  tutorProfile: 'onboarding.tutor.profile',
  lesson: 'onboarding.tutor.lesson',
  region: 'onboarding.tutor.region',
  availability: 'onboarding.tutor.availability',
};

// load 함수
export function loadUserRole<T extends UserRole = UserRole>() {
  return JSON.parse(localStorage.getItem(ONBOARDING_KEY.userRole) || '{}') as T;
}
export function loadTutorProfile<T extends TutorProfile = TutorProfile>() {
  return JSON.parse(localStorage.getItem(ONBOARDING_KEY.tutorProfile) || '{}') as T;
}
export function loadLessonCategory<T extends LessonCategory = LessonCategory>() {
  return JSON.parse(localStorage.getItem(ONBOARDING_KEY.lesson) || '{}') as T;
}
export function loadRegion<T = any>() {
  return JSON.parse(localStorage.getItem(ONBOARDING_KEY.region) || '[]') as T;
}
export function loadAvailability<T = any>() {
  return JSON.parse(localStorage.getItem(ONBOARDING_KEY.availability) || '{}') as T;
}

// set 함수
export function setUserRole(data: UserRole) {
  localStorage.setItem(ONBOARDING_KEY.userRole, JSON.stringify(data));
}
export function setTutorProfile(data: TutorProfile) {
  localStorage.setItem(ONBOARDING_KEY.tutorProfile, JSON.stringify(data));
}
export function setLessonCategory(data: LessonCategory) {
  localStorage.setItem(ONBOARDING_KEY.lesson, JSON.stringify(data));
}
export function setRegion(data: any) {
  localStorage.setItem(ONBOARDING_KEY.region, JSON.stringify(data));
}
export function setAvailability(data: any) {
  localStorage.setItem(ONBOARDING_KEY.availability, JSON.stringify(data));
}
