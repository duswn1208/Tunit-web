import CategoryList from './CategoryList';

interface LessonSubCategoryProps {
  subs: any[];
  mainCode: string;
  selectedSubs: Set<string>;
  loadingSub: boolean;
  toggleSub: (code: string) => void;
}

export default function LessonSubCategory({
  subs,
  mainCode,
  selectedSubs,
  loadingSub,
  toggleSub,
}: LessonSubCategoryProps) {
  if (!mainCode) {
    return (
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 8px 2px' }}>상세 레슨</div>
        <div className="mls-sub" style={{ padding: '6px 2px' }}>
          먼저 레슨 유형을 선택하세요.
        </div>
      </div>
    );
  }
  return (
    <CategoryList
      title="상세 레슨"
      loading={loadingSub}
      loadingText="상세 레슨 불러오는 중…"
      emptyText="상세 레슨이 없습니다."
      items={subs}
      isActive={(code: string) => selectedSubs.has(String(code))}
      onClick={toggleSub}
      style={{ padding: '0 20px 16px' }}
    />
  );
}
