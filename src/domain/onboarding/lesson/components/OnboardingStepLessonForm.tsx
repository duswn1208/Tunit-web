import LessonSelectedChipList from './LessonSelectedChipList';
import LessonMainCategory from './LessonMainCategory';
import LessonSubCategory from './LessonSubCategory';
import { useOnboardingLesson } from '../../lesson/hooks/useLesson';
import Header from '../../../../components/Header';

export default function OnboardingStepLessonForm() {
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
  } = useOnboardingLesson();

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
