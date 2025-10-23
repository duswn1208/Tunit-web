import RootHeaderBase from './RootHeaderBase.tsx';
import { Link } from 'react-router-dom';

export default function RootHeaderStudent() {
  return (
    <RootHeaderBase
      nav={
        <nav className="nav">
          <Link to="/search/tutors">튜터 찾기</Link>
          <Link to="/student/my/lessons">내 레슨</Link>
        </nav>
      }
    />
  );
}
