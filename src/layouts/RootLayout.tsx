// src/layouts/RootLayout.tsx
import { Outlet } from 'react-router-dom';
import '../css/layouts/layout.css';
import RootHeader from './RootHeader';

export default function RootLayout() {
  return (
    <div className="layout">
      <RootHeader />
      <main className="main">
        <Outlet />
      </main>
      <footer className="footer">© Tunit</footer>
    </div>
  );
}
