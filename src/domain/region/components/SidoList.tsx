interface SidoListProps {
  sidos: any[];
  activeSido: any;
  setSelectedSido: (sido: any) => void;
}

export default function SidoList({ sidos, activeSido, setSelectedSido }: SidoListProps) {
  return (
    <ul className="mls-list" role="listbox" aria-label="시/도">
      {sidos.map((s) => (
        <li
          key={s.code}
          className={`mls-item ${activeSido?.code === s.code ? 'active' : ''}`}
          onClick={() => setSelectedSido(s)}
          role="option"
        >
          {s.label}
        </li>
      ))}
    </ul>
  );
}
