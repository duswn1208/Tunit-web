export type LessonLogResponse = {
  logNo: number;
  lessonReservationNo: number;
  progressContent: string;
  feedback: string | null;
  studentQuestion: string | null;
  questionedAt: string | null;
  tutorReply: string | null;
  repliedAt: string | null;
  createdAt: string;
};

export type LessonLogCreateRequest = {
  lessonReservationNo: number;
  progressContent: string;
  feedback?: string;
};

export type LessonLogUpdateRequest = {
  progressContent: string;
  feedback?: string;
};

export type UnwrittenLesson = {
  lessonReservationNo: number;
  date: string;          // YYYY-MM-DD
  startTime: string;     // HH:mm
  endTime: string;       // HH:mm
  studentName: string;
  lessonCategory: string;
};
