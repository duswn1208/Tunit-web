import { Check } from 'lucide-react';

interface GugunListProps {
  activeSido: any;
  subregions: any[];
  isSidoSelected: (code: string) => boolean;
  toggleSidoWhole: (sido: any) => void;
  isGugunSelected: (code: string) => boolean;
  toggleGugun: (gugun: any) => void;
  stripParentPrefix: (parent: string, label: string) => string;
}

export default function GugunList({
  activeSido,
  subregions,
  isSidoSelected,
  toggleSidoWhole,
  isGugunSelected,
  toggleGugun,
  stripParentPrefix,
}: GugunListProps) {
  return (
    <ul className="mls-list" role="listbox" aria-label="구/군">
      {activeSido && (
        <li
          key="__all__"
          className={`mls-item ${isSidoSelected(activeSido.code) ? 'selected' : ''}`}
          onClick={() => toggleSidoWhole(activeSido)}
          role="option"
        >
          <span>{activeSido.label} 전체</span>
        </li>
      )}
      {subregions.map((g) => {
        const selected = isGugunSelected(g.code);
        return (
          <li
            key={g.code}
            className={`mls-item ${selected ? 'selected' : ''}`}
            onClick={() => toggleGugun(g)}
            role="option"
          >
            <span>{stripParentPrefix(activeSido!.label, g.label)}</span>
            {selected && <Check size={16} />}
          </li>
        );
      })}
    </ul>
  );
}
