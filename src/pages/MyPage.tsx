// 예시: pages/MyPage.tsx 일부
import { useEffect, useState } from 'react';
import { getMe } from '../lib/auth';

export default function MyPage() {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const me = await getMe();
      if (!me.authenticated) {
        window.location.replace('/auth/login');
        return;
      }
      if (me.role !== 'TUTOR') {
        window.location.replace('/');
        return;
      }
      setOk(true);
    })();
  }, []);

  if (ok === null) return <div style={{ maxWidth: 560, margin: '40px auto' }}>로딩중…</div>;
  return (
    <div style={{ maxWidth: 560, margin: '40px auto' }}>
      <h1>마이페이지</h1>
    </div>
  );
}
