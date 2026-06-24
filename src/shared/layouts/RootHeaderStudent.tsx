import RootHeaderBase from './RootHeaderBase.tsx';
import { NavLink } from 'react-router-dom';

export default function RootHeaderStudent() {
  return (
    <RootHeaderBase
      nav={
        <nav className="nav">
          <NavLink to="/find/lessons">튜터 찾기</NavLink>
          <NavLink to="/student/my/lessons">내 레슨</NavLink>
          <NavLink to="/student/my/tutors">내 튜터</NavLink>
        </nav>
      }
    />
  );
}
