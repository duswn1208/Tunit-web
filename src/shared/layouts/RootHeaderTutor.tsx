import RootHeaderBase from './RootHeaderBase.tsx';
import { NavLink } from 'react-router-dom';

export default function RootHeaderTutor() {
  const activeStyle = {
    fontWeight: 'bold',
    color: 'var(--default-white)',
  };
  return (
    <RootHeaderBase
      nav={
        <nav className="nav">
          <NavLink
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            to="/tutor/my/lessons"
          >
            내 레슨
          </NavLink>
          <NavLink
            style={({ isActive }) => (isActive ? activeStyle : undefined)}
            to="/tutor/my/students"
          >
            내 학생
          </NavLink>
        </nav>
      }
    />
  );
}
