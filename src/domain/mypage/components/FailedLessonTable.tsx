import type { FailList } from '../types';

export default function FailedLessonTable({ failList }: { failList: FailList[] }) {
  if (!failList.length) return null;
  return (
    <div style={{ marginTop: 32 }}>
      <h3>등록 실패 회원 목록</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 12 }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc', padding: 4 }}>이름</th>
            <th style={{ border: '1px solid #ccc', padding: 4 }}>전화번호</th>
            <th style={{ border: '1px solid #ccc', padding: 4 }}>메모</th>
            <th style={{ border: '1px solid #ccc', padding: 4 }}>실패 사유</th>
          </tr>
        </thead>
        <tbody>
          {failList.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #ccc', padding: 4 }}>{item.name}</td>
              <td style={{ border: '1px solid #ccc', padding: 4 }}>{item.phone}</td>
              <td style={{ border: '1px solid #ccc', padding: 4 }}>{item.memo}</td>
              <td style={{ border: '1px solid #ccc', padding: 4, color: 'red' }}>{item.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
