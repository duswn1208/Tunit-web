import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import MyPage from './pages/MyPage.tsx';
import OnboardingStart from './pages/onboarding/OnboardingStart.tsx';
import OnboardingTutor from './pages/onboarding/OnboardingTutor.tsx';
import OnboardingLesson from './pages/onboarding/OnboardingLesson.tsx';
import OnboardingRegion from './pages/onboarding/OnboardingRegion.tsx';
import OnboardingAvailability from './pages/onboarding/OnboardingAvailability.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/onboarding" element={<OnboardingStart />} />
        <Route path="/onboarding/tutor" element={<OnboardingTutor />} />
        <Route path="/onboarding/tutor/lesson" element={<OnboardingLesson />} />
        <Route path="/onboarding/tutor/region" element={<OnboardingRegion />} />
        <Route path="/onboarding/tutor/availability" element={<OnboardingAvailability />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
