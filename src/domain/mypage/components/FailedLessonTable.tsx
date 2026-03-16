import { HiExclamationTriangle } from 'react-icons/hi2';
import type { FailList } from '../types';

export default function FailedLessonTable({ failList }: { failList: FailList[] }) {
  if (!failList.length) return null;
  return (
    <div className="failed-table-wrapper">
      <div className="failed-table-header">
        <HiExclamationTriangle />
        등록 실패 목록 ({failList.length}건)
      </div>
      <table className="failed-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>전화번호</th>
            <th>메모</th>
            <th>실패 사유</th>
          </tr>
        </thead>
        <tbody>
          {failList.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td>{item.phone}</td>
              <td>{item.memo}</td>
              <td className="failed-reason">{item.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
