import { useEffect } from 'react';
import CategoryList from './CategoryList.tsx';
interface LessonMainCategoryProps {
  mains: any[];
  mainCode: string;
  loadingMain: boolean;
  selectMain: (code: string) => void;
}

export default function LessonMainCategory({
  mains,
  mainCode,
  loadingMain,
  selectMain,
}: LessonMainCategoryProps) {
  useEffect(() => {
    if (!loadingMain && mains.length > 0 && !mainCode) {
      selectMain(mains[0].code);
    }
  });

  return (
    <CategoryList
      title="레슨 유형"
      loading={loadingMain}
      loadingText="대분류 불러오는 중…"
      emptyText="레슨 유형이 없습니다."
      items={mains}
      isActive={(code) => mainCode === code}
      onClick={selectMain}
      style={{ padding: '16px 20px 8px' }}
      isMainCategory={true}
    />
  );
}
