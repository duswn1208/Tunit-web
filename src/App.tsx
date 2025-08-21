import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import MyPage from './pages/MyPage.tsx';
import OnboardingStart from './pages/OnboardingStart';
import OnboardingTutor from './pages/OnboardingTutor';
import OnboardingLesson from './pages/OnboardingLesson';

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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
