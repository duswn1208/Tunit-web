interface TabProps {
  tabs: string[];
  selected: string;
  onSelect: (tab: string) => void;
}

export default function Tab({ tabs, selected, onSelect }: TabProps) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 16 }}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSelect(tab)}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderBottom: selected === tab ? '2px solid #1976d2' : '2px solid transparent',
            background: 'none',
            color: selected === tab ? '#1976d2' : '#333',
            fontWeight: selected === tab ? 700 : 400,
            cursor: 'pointer',
            outline: 'none',
            fontSize: 16,
          }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
