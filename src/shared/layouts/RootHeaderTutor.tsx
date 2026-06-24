import RootHeaderBase from './RootHeaderBase.tsx';
import { NavLink } from 'react-router-dom';

export default function RootHeaderTutor() {
  return (
    <RootHeaderBase
      nav={
        <nav className="nav">
          <NavLink to="/tutor/my/lessons">내 레슨</NavLink>
          <NavLink to="/tutor/my/students">내 학생</NavLink>
        </nav>
      }
    />
  );
}
