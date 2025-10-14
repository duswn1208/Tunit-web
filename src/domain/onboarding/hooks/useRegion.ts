import {
  useRegionSelect,
  type UseRegionSelectOptions,
} from '../../region/hooks/useRegionSelect.ts';

export default function useOnboardingRegion(opts: UseRegionSelectOptions = {}) {
  // 온보딩만의 추가 로직이 있다면 여기서 확장
  return useRegionSelect(opts);
}
