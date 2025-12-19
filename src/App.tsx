import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from './domain/home/pages/HomePage.tsx';
import './shared/lib/firebase'; // Firebase 연동 테스트용 import
import LoginPage from './domain/home/pages/LoginPage.tsx';
import MyPage from './domain/mypage/pages/MyPage.tsx';
import OnboardingStart from './domain/onboarding/pages/OnboardingStart.tsx';
import OnboardingTutor from './domain/onboarding/pages/OnboardingTutor.tsx';
import OnboardingLesson from './domain/onboarding/pages/OnboardingLesson.tsx';
import OnboardingRegion from './domain/onboarding/pages/OnboardingRegion.tsx';
import OnboardingAvailability from './domain/onboarding/pages/OnboardingAvailability.tsx';
import { AuthProvider } from '@/shared/auth/AuthContext.tsx';
import { ToastProvider } from '@/shared/contexts/ToastContext';
import { AlertProvider } from '@/shared/contexts/AlertContext';
import RootLayout from './shared/layouts/RootLayout.tsx';
import OnboardingStudentLesson from './domain/onboarding/pages/OnboardingStudentLesson.tsx';
import OnboardingStudentRegion from './domain/onboarding/pages/OnboardingStudentRegion.tsx';
import TutorSearchPage from '@/domain/search/pages/TutorSearchPage.tsx';
import TutorDetailPage from './domain/tutor/pages/TutorDetailPage.tsx';
import LessonStudentPage from './domain/lesson/pages/LessonStudentPage.tsx';
import LessonManageLayout from './domain/lesson/pages/LessonManagePage.tsx';
import ScheduleManagePage from './domain/lesson/pages/ScheduleManagePage.tsx';
import BottomTabBar from '@/shared/components/BottomTabBar';
import ContractRequestFormPage from './domain/booking/pages/ContractRequestFormPage.tsx';
import LessonBookingPage from './domain/booking/pages/LessonBookingPage.tsx';
import MyTutorsPage from './domain/contract/pages/MyTutorsPage.tsx';
import MyStudentsPage from './domain/contract/pages/MyStudentsPage.tsx';
import ContractEditPage from './domain/contract/pages/ContractEditPage.tsx';
import NotificationsPage from './domain/notification/pages/NotificationsPage.tsx';
import TutorFaqManagementPage from './domain/mypage/pages/TutorFaqManagementPage.tsx';

// React Query 클라이언트 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 실패시 재시도 횟수
      staleTime: 300000, // 5분 동안 데이터를 신선한 상태로 유지
      gcTime: 600000, // 10분 동안 캐시 유지 (TanStack Query v5에서는 cacheTime 대신 gcTime 사용)
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ToastProvider>
          <AlertProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<RootLayout />}>
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/" element={<HomePage />} />
                  <Route path="/mypage" element={<MyPage />} />
                  <Route path="/find/lessons" element={<TutorSearchPage />} />
                  <Route path="/tutors/:tutorId/booking" element={<TutorDetailPage />} />
                  <Route
                    path="/tutors/:tutorId/lesson-booking"
                    element={<ContractRequestFormPage />}
                  />
                  <Route path="/tutors/:tutorId" element={<TutorDetailPage />} />
                  <Route path="/student/my/lessons" element={<LessonStudentPage />} />
                  <Route path="/student/my/tutors" element={<MyTutorsPage />} />
                  <Route
                    path="/student/contracts/:contractNo/edit"
                    element={<ContractEditPage />}
                  />
                  <Route path="/student/booking/lesson" element={<LessonBookingPage />} />
                  <Route path="/tutor/my/lessons" element={<LessonManageLayout />} />
                  <Route path="/tutor/schedule" element={<ScheduleManagePage />} />
                  <Route path="/tutor/my/students" element={<MyStudentsPage />} />
                  <Route path="/onboarding" element={<OnboardingStart />} />
                  <Route path="/onboarding/student" element={<OnboardingStudentLesson />} />
                  <Route path="/onboarding/student/region" element={<OnboardingStudentRegion />} />
                  <Route path="/onboarding/tutor" element={<OnboardingTutor />} />
                  <Route path="/onboarding/tutor/lesson" element={<OnboardingLesson />} />
                  <Route path="/onboarding/tutor/region" element={<OnboardingRegion />} />
                  <Route
                    path="/onboarding/tutor/availability"
                    element={<OnboardingAvailability />}
                  />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/mypage/tutor/faq" element={<TutorFaqManagementPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
              </Routes>
              <BottomTabBar />
            </BrowserRouter>
          </AlertProvider>
        </ToastProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
