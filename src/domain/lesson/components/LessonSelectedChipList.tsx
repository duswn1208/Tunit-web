import { ChipList } from '../../../shared/components';

interface LessonSelectedChipProps {
  chipList: any[];
  removeChip: (code: string) => void;
}

export default function LessonSelectedChipList({ chipList, removeChip }: LessonSelectedChipProps) {
  return <ChipList items={chipList} onRemove={removeChip} />;
}
