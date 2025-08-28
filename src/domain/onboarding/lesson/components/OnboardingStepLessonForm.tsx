import LessonSelectedChipList from './LessonSelectedChipList';
import LessonMainCategory from './LessonMainCategory';
import LessonSubCategory from './LessonSubCategory';
import Header from '../../../../components/Header';
interface OnboardingStepLessonFormProps {
  mains: any[];
  mainCode: string;
  subs: any[];
  selectedSubs: Set<string>;
  loadingMain: boolean;
  loadingSub: boolean;
  chipList: any[];
  selectMain: (code: string) => void;
  removeChip: (code: string) => void;
  toggleSub: (code: string) => void;
}

export default function OnboardingStepLessonForm(props: OnboardingStepLessonFormProps) {
  const {
    mains,
    mainCode,
    subs,
    selectedSubs,
    loadingMain,
    loadingSub,
    chipList,
    selectMain,
    removeChip,
    toggleSub,
  } = props;

  return (
    <div>
      <Header title="가르칠 레슨 유형을 선택해주세요" subtitle="(중복선택 가능)" />
      <LessonSelectedChipList chipList={chipList} removeChip={removeChip} />
      <div className="mls-body">
        <LessonMainCategory
          mains={mains}
          mainCode={mainCode}
          loadingMain={loadingMain}
          selectMain={selectMain}
        />
        <LessonSubCategory
          subs={subs}
          mainCode={mainCode}
          selectedSubs={selectedSubs}
          loadingSub={loadingSub}
          toggleSub={toggleSub}
        />
      </div>
    </div>
  );
}
