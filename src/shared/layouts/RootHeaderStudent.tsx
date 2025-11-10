import RootHeaderBase from './RootHeaderBase.tsx';
import { NavLink } from 'react-router-dom';

export default function RootHeaderStudent() {
  const activeStyle = {
    fontWeight: 'bold',
    color: 'var(--default-white)',
  };
  return (
    <RootHeaderBase
      nav={
        <nav className="nav">
          <NavLink style={({ isActive }) => (isActive ? activeStyle : {})} to="/find/lessons">
            튜터 찾기
          </NavLink>
          <NavLink style={({ isActive }) => (isActive ? activeStyle : {})} to="/student/my/lessons">
            내 레슨
          </NavLink>
          <NavLink style={({ isActive }) => (isActive ? activeStyle : {})} to="/student/my/tutors">
            내 튜터
          </NavLink>
        </nav>
      }
    />
  );
}
