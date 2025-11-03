import '../css/components/tab.css';

interface TabProps {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
}

export default function Tab({ tabs, selected, onSelect }: TabProps) {
  return (
    <div className="tab-container">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-button ${selected === tab ? 'active' : ''}`}
          onClick={() => onSelect(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
