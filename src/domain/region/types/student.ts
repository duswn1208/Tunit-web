export type StudentLesson = {
  studentLessonNo: number;
  lessonSubCategory: { code: string; label: string };
  isMain: boolean;
};

export type StudentRegion = {
  studentRegionNo: number;
  userNo: number;
  code: string;
  label: string;
  type: 'sido' | 'gugun';
  parentCode: string;
  parentLabel: string;
};
