import Tab from '@/shared/components/Tab';

interface ScheduleTabsProps {
  activeTab: 'schedule' | 'exception';
  onTabChange: (tab: 'schedule' | 'exception') => void;
}

const TAB_LABELS = {
  schedule: '기본 스케줄',
  exception: '예외 일정 / 휴무',
} as const;

export default function ScheduleTabs({ activeTab, onTabChange }: ScheduleTabsProps) {
  const tabs = Object.values(TAB_LABELS);
  const selectedTab = TAB_LABELS[activeTab];

  const handleSelect = (tab: string) => {
    const key = Object.entries(TAB_LABELS).find(([_, value]) => value === tab)?.[0] as
      | 'schedule'
      | 'exception';
    if (key) {
      onTabChange(key);
    }
  };

  return (
    <div style={{ marginBottom: '24px' }}>
      <Tab tabs={tabs} selected={selectedTab} onSelect={handleSelect} />
    </div>
  );
}
