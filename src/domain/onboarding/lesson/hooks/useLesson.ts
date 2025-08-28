import { useEffect, useMemo, useState } from 'react';
import type { Category, SubCategory } from '../../../../type/onboarding';
import {
  getMainLessonCategory,
  getSubLessonCategory,
} from '../../../../lib/onboarding/categoryApi';

export function useOnboardingLesson() {
  const [mains, setMains] = useState<Category[]>([]);
  const [subs, setSubs] = useState<SubCategory[]>([]);
  const [mainCode, setMainCode] = useState<string>('');
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingSub, setLoadingSub] = useState(false);

  // 다중 선택(소분류)
  const [selectedSubs, setSelectedSubs] = useState<Set<string>>(new Set());

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
    setSelectedSubs(new Set());
    setSubs([]);
    try {
      setLoadingSub(true);
      const list = await getSubLessonCategory(code);
      setSubs(list ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSub(false);
    }
  };

  // 소분류 토글
  const toggleSub = (code: string) => {
    setSelectedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  // 칩 목록
  const chipList = useMemo(() => {
    const map = new Map<string, string>(); // code -> label
    subs.forEach((s) => {
      if (selectedSubs.has(String(s.code))) {
        map.set(String(s.code), s.label);
      }
    });
    return Array.from(map.entries(), ([code, label]) => ({ code, label }));
  }, [subs, selectedSubs]);

  const removeChip = (code: string) => {
    setSelectedSubs((prev) => {
      const next = new Set(prev);
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
