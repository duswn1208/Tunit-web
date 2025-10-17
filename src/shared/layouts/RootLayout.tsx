// src/layouts/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import '@/shared/css/layouts/layout.css';
import RootHeaderStudent from './RootHeaderStudent.tsx';
import RootHeaderTutor from './RootHeaderTutor.tsx';
import RootHeaderBase from './RootHeaderBase.tsx';
import { useAuth } from '@/shared/auth/AuthContext.tsx';

export default function RootLayout() {
  const { user } = useAuth();
  let HeaderComponent = RootHeaderBase;

  if (user) {
    if (user.userRole === 'TUTOR') HeaderComponent = RootHeaderTutor;
    else if (user.userRole === 'STUDENT') HeaderComponent = RootHeaderStudent;
  }

  return (
    <div className="layout">
      <HeaderComponent nav={null} />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="/privacy">개인정보처리방침</a>
            <a href="/terms">이용약관</a>
            <a href="/support">고객센터</a>
          </div>
          <div className="footer-copyright">© 2025 Tunit. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
