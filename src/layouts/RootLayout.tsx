// src/layouts/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import '../css/layouts/layout.css';
import RootHeaderStudent from './RootHeaderStudent';
import RootHeaderTutor from './RootHeaderTutor';
import { useAuth } from '../auth/AuthContext';

export default function RootLayout() {
  const { user } = useAuth();
  let HeaderComponent = RootHeaderStudent;
  if (user?.userRole === 'tutor') HeaderComponent = RootHeaderTutor;
  else if (user?.userRole === 'student') HeaderComponent = RootHeaderStudent;
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
