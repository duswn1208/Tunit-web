import RootHeaderBase from './RootHeaderBase';
import { Link } from 'react-router-dom';

export default function RootHeaderStudent() {
  return (
    <RootHeaderBase
      nav={
        <nav className="nav">
          <Link to="/mypage">마이페이지</Link>
          <Link to="/find/lessons">튜터찾기</Link>
        </nav>
      }
    />
  );
}
