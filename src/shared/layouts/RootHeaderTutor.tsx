import RootHeaderBase from './RootHeaderBase.tsx';
import { Link } from 'react-router-dom';

export default function RootHeaderTutor() {
  return (
    <RootHeaderBase
      nav={
        <nav className="nav">
          <Link to="/mypage">마이페이지</Link>
          <Link to="/my/lessons">레슨관리</Link>
        </nav>
      }
    />
  );
}
