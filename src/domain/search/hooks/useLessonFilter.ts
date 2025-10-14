import { useState, useEffect } from 'react';
import { getMainLessonCategory, getSubLessonCategory } from '../../lesson/api/categoryApi';
import type { Category, SubCategory } from '../../onboarding/types/onboarding.ts';

export function useLessonFilter(selectedSubCategories: any[]) {
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Record<string, SubCategory[]>>({});
  const [selectedMainCategory, setSelectedMainCategory] = useState<string | null>(null);

  useEffect(() => {
    getMainLessonCategory().then(setMainCategories);
  }, []);

  useEffect(() => {
    if (!selectedMainCategory || subCategories[selectedMainCategory]) return;
    getSubLessonCategory(selectedMainCategory).then((data) =>
      setSubCategories((prev) => ({ ...prev, [selectedMainCategory]: data }))
    );
  }, [selectedMainCategory]);

  useEffect(() => {
    if (!mainCategories.length || !selectedSubCategories.length) return;

    for (const cat of mainCategories) {
      const subCategoriesForCat = cat.subCategories;
      if (subCategoriesForCat?.some((sub) => sub.code === selectedSubCategories[0].code)) {
        setSelectedMainCategory(cat.code);
        return;
      }
    }
    setSelectedMainCategory(null);
  }, [mainCategories, subCategories, selectedSubCategories]);

  return { mainCategories, subCategories, selectedMainCategory, setSelectedMainCategory };
}
