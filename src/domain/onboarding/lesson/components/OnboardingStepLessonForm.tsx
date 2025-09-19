import LessonSelectedChipList from './LessonSelectedChipList';
import LessonMainCategory from './LessonMainCategory';
import LessonSubCategory from './LessonSubCategory';
import Header from '../../../../components/Header';
interface OnboardingStepLessonFormProps {
  title: string;
  mains: any[];
  mainCode: string;
  subs: any[];
  selectedSubs: Set<string> | Map<string, string>;
  loadingMain: boolean;
  loadingSub: boolean;
  chipList: any[];
  selectMain: (code: string) => void;
  removeChip: (code: string) => void;
  toggleSub: (code: string, label: string) => void;
}

export default function OnboardingStepLessonForm(props: OnboardingStepLessonFormProps) {
  const {
    title,
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
      <Header title={title} subtitle="(중복선택 가능)" />
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
