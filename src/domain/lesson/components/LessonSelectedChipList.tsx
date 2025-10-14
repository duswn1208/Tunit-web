import { ChipList } from '../../../shared/components';

interface LessonSelectedChipProps {
  chipList: any[];
  removeChip: (code: string) => void;
}

export default function LessonSelectedChipList({ chipList, removeChip }: LessonSelectedChipProps) {
  return (
    <ChipList
      items={chipList}
      onRemove={removeChip}
      emptyText={
        <span style={{ fontSize: 13, color: '#6b7280' }}>상세 레슨을 선택하면 이곳에 표시돼요</span>
      }
    />
  );
}
