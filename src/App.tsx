import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import LessonManage from './pages/LessonManagePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import MyPage from './pages/MyPage.tsx';
import OnboardingStart from './domain/onboarding/pages/OnboardingStart.tsx';
import OnboardingTutor from './domain/onboarding/pages/OnboardingTutor.tsx';
import OnboardingLesson from './domain/onboarding/pages/OnboardingLesson.tsx';
import OnboardingRegion from './domain/onboarding/pages/OnboardingRegion.tsx';
import OnboardingAvailability from './domain/onboarding/pages/OnboardingAvailability.tsx';
import { AuthProvider } from './auth/AuthContext.tsx';
import RootLayout from './layouts/RootLayout.tsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/login" element={<LoginPage />} />
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/my/lessons" element={<LessonManage />} />
            <Route path="/onboarding" element={<OnboardingStart />} />
            <Route path="/onboarding/tutor" element={<OnboardingTutor />} />
            <Route path="/onboarding/tutor/lesson" element={<OnboardingLesson />} />
            <Route path="/onboarding/tutor/region" element={<OnboardingRegion />} />
            <Route path="/onboarding/tutor/availability" element={<OnboardingAvailability />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
