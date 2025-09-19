import { ChipList } from '../../../components';

interface RegionChipListProps {
  items: any[];
  getCode: (item: any) => string;
  getLabel: (item: any) => string;
  onRemove: (code: string) => void;
}

export default function RegionChipList({
  items,
  getCode,
  getLabel,
  onRemove,
}: RegionChipListProps) {
  return <ChipList items={items} getCode={getCode} getLabel={getLabel} onRemove={onRemove} />;
}
