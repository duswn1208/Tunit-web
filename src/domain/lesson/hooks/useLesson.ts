import { useEffect, useMemo, useState } from 'react';
import type { Category, SubCategory } from '../../onboarding/types/onboarding.ts';
import { getMainLessonCategory, getSubLessonCategory } from '../api/categoryApi';

export function useOnboardingLesson() {
  const [mains, setMains] = useState<Category[]>([]);
  const [subs, setSubs] = useState<SubCategory[]>([]);
  // 모든 소분류 누적 저장
  const [, setAllSubs] = useState<SubCategory[]>([]);
  const [mainCode, setMainCode] = useState<string>('');
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingSub, setLoadingSub] = useState(false);

  // 다중 선택(소분류) - Map<code, label>
  const [selectedSubs, setSelectedSubs] = useState<Map<string, string>>(new Map());

  // 대분류 로딩
  useEffect(() => {
    (async () => {
      try {
        setLoadingMain(true);
        const list = await getMainLessonCategory();
        setMains(list ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMain(false);
      }
    })();
  }, []);

  // 대분류 선택 → 소분류 로딩
  const selectMain = async (code: string) => {
    if (!code || code === mainCode) return;
    setMainCode(code);
    setSubs([]);
    try {
      setLoadingSub(true);
      const list = await getSubLessonCategory(code);
      setSubs(list ?? []);
      // allSubs에 누적 추가 (중복 제거)
      setAllSubs((prev) => {
        const map = new Map(prev.map((s) => [String(s.code), s]));
        (list ?? []).forEach((s) => map.set(String(s.code), s));
        return Array.from(map.values());
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSub(false);
    }
  };

  // 소분류 토글
  const toggleSub = (code: string, label: string) => {
    setSelectedSubs((prev) => {
      const next = new Map(prev);
      if (next.has(code)) next.delete(code);
      else next.set(code, label);
      return next;
    });
  };

  // 칩 목록
  const chipList = useMemo(() => {
    return Array.from(selectedSubs, ([code, label]) => ({ code, label }));
  }, [selectedSubs]);

  const removeChip = (code: string) => {
    setSelectedSubs((prev) => {
      const next = new Map(prev);
      next.delete(code);
      return next;
    });
  };

  // 제출 가능 여부
  const canSubmit = Boolean(mainCode) && selectedSubs.size > 0;

  return {
    mains,
    mainCode,
    subs,
    selectedSubs,
    loadingMain,
    loadingSub,
    chipList,
    canSubmit,
    selectMain,
    removeChip,
    toggleSub,
  };
}
