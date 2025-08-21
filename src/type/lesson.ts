// src/types/lesson.ts
export type LessonCategoryDto = {
  code: string; // 예: "MUSIC"
  label: string; // 예: "음악"
};

export type LessonSubCategoryDto = {
  code: string; // 예: "GUITAR"
  label: string; // 예: "기타"
  parentCode: string; // 예: "MUSIC"
  parentLabel: string; // 예: "음악"
};
