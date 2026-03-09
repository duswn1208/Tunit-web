import React from 'react';

interface LessonManageViewToggleProps {
  viewType: 'calendar' | 'list';
  setViewType: (type: 'calendar' | 'list') => void;
}

const LessonManageViewToggle: React.FC<LessonManageViewToggleProps> = ({
  viewType,
  setViewType,
}) => {
  return (
    <div className="lesson-view-segment">
      <button
        type="button"
        className={`lesson-view-segment-btn${viewType === 'calendar' ? ' active' : ''}`}
        onClick={() => setViewType('calendar')}
      >
        캘린더
      </button>
      <button
        type="button"
        className={`lesson-view-segment-btn${viewType === 'list' ? ' active' : ''}`}
        onClick={() => setViewType('list')}
      >
        리스트
      </button>
    </div>
  );
};

export default LessonManageViewToggle;
