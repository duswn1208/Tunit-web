import React from 'react';
import SelectBox from '@/shared/components/SelectBox';

interface LessonFilterSectionProps {
  filterStudent: string;
  setFilterStudent: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: string) => void;
}

const statusOptions = [
  { value: '', label: '레슨 상태 전체' },
  { value: 'REQUESTED', label: '레슨 신청' },
  { value: 'CONFIRMED', label: '확정' },
  { value: 'CANCELLED', label: '취소' },
];

const LessonFilterSection: React.FC<LessonFilterSectionProps> = ({
  filterStudent,
  setFilterStudent,
  filterStatus,
  setFilterStatus,
}) => {
  return (
    <div className="lesson-manage-filter">
      <input
        type="text"
        placeholder="학생명 검색"
        value={filterStudent}
        onChange={(e) => setFilterStudent(e.target.value)}
      />
      <SelectBox
        id="lesson-status-filter"
        name="lessonStatus"
        value={filterStatus}
        options={statusOptions}
        onChange={setFilterStatus}
        placeholder="레슨 상태 선택"
        className="lesson-status-select"
      />
    </div>
  );
};

export default LessonFilterSection;
