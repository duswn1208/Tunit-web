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
    <div
      className="lesson-view-toggle"
      style={{ marginTop: 12, marginBottom: 8, display: 'flex', gap: 16 }}
    >
      <span
        role="button"
        tabIndex={0}
        className={`lesson-view-toggle-tab${viewType === 'calendar' ? ' active' : ''}`}
        onClick={() => setViewType('calendar')}
      >
        캘린더
      </span>
      <span className="lesson-view-toggle-divider">|</span>
      <span
        role="button"
        tabIndex={0}
        className={`lesson-view-toggle-tab${viewType === 'list' ? ' active' : ''}`}
        onClick={() => setViewType('list')}
      >
        리스트
      </span>
    </div>
  );
};

export default LessonManageViewToggle;
