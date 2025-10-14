// src/layouts/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import '@/shared/css/layouts/layout.css';
import RootHeaderStudent from './RootHeaderStudent.tsx';
import RootHeaderTutor from './RootHeaderTutor.tsx';
import { useAuth } from '@/shared/auth/AuthContext.tsx';

export default function RootLayout() {
  const { user } = useAuth();
  let HeaderComponent = RootHeaderStudent;
  if (user?.userRole === 'TUTOR') HeaderComponent = RootHeaderTutor;
  else if (user?.userRole === 'STUDENT') HeaderComponent = RootHeaderStudent;
  return (
    <div className="layout">
      <HeaderComponent />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">© Tunit</footer>
    </div>
  );
}
