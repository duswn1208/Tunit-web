import RootHeaderBase from './RootHeaderBase.tsx';
import { Link } from 'react-router-dom';

export default function RootHeaderTutor() {
  return (
    <RootHeaderBase
      nav={
        <nav className="nav">
          <Link to="/tutor/my/lessons">내 레슨</Link>
          <Link to="/tutor/my/students">내 학생</Link>
        </nav>
      }
    />
  );
}
