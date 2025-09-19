import React, { useState } from 'react';
import '../css/tutor-search.css';

const REGIONS = ['서울', '경기', '부산', '대구', '광주'];
const LESSONS = ['영어', '수학', '과학', '국어', '코딩'];

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function TutorFilterBar() {
  // 다중 선택 상태
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['서울']);
  const [selectedLessons, setSelectedLessons] = useState<string[]>(['영어']);
  const [open, setOpen] = useState<'region' | 'lesson' | null>(null);
  const isMobile = useIsMobile();

  // 다중 선택 토글
  const toggleSelect = (type: 'region' | 'lesson', value: string) => {
    if (type === 'region') {
      setSelectedRegions((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else {
      setSelectedLessons((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    }
  };

  // 칩에 표시될 텍스트
  const regionLabel =
    selectedRegions.length === 0
      ? '전체 지역'
      : selectedRegions.length === 1
      ? selectedRegions[0]
      : `${selectedRegions[0]} 외 ${selectedRegions.length - 1}개`;
  const lessonLabel =
    selectedLessons.length === 0
      ? '전체 레슨'
      : selectedLessons.length === 1
      ? selectedLessons[0]
      : `${selectedLessons[0]} 외 ${selectedLessons.length - 1}개`;

  // 바텀시트/드롭다운 공통 렌더
  const renderSelectSheet = (type: 'region' | 'lesson') => {
    const options = type === 'region' ? REGIONS : LESSONS;
    const selected = type === 'region' ? selectedRegions : selectedLessons;
    const onSelect = (v: string) => toggleSelect(type, v);
    return (
      <div className={isMobile ? 'bottom-sheet' : 'dropdown'} onClick={() => setOpen(null)}>
        <div
          className={isMobile ? 'bottom-sheet-content' : ''}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={isMobile ? 'sheet-title' : 'dropdown-title'}>
            {type === 'region' ? '지역 선택' : '레슨 선택'}
          </div>
          {options.map((opt) => (
            <div
              key={opt}
              className={
                (isMobile ? 'sheet-option' : 'dropdown-option') +
                (selected.includes(opt) ? ' selected' : '')
              }
              onClick={() => onSelect(opt)}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                readOnly
                style={{ marginRight: 8 }}
              />
              {opt}
            </div>
          ))}
          <div
            className={isMobile ? 'sheet-confirm' : 'dropdown-confirm'}
            onClick={() => setOpen(null)}
            style={{ marginTop: 16, textAlign: 'right', color: '#2563eb', cursor: 'pointer' }}
          >
            확인
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tutor-filter-bar" style={{ position: 'relative' }}>
      <button
        className={'filter-chip' + (selectedRegions.length ? ' selected' : '')}
        onClick={() => setOpen('region')}
      >
        {regionLabel} ▾
      </button>
      <button
        className={'filter-chip' + (selectedLessons.length ? ' selected' : '')}
        onClick={() => setOpen('lesson')}
      >
        {lessonLabel} ▾
      </button>
      <button className="filter-chip">후기 많은 순</button>

      {/* 선택 UI */}
      {open && renderSelectSheet(open)}
    </div>
  );
}
