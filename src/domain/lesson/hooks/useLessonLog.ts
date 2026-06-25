import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lessonLogApi } from '../api/lessonLogApi';
import { useToast } from '@/shared/contexts/ToastContext';
import type { LessonLogCreateRequest, LessonLogUpdateRequest } from '../types/lessonLog';

export function useUnwrittenLessons(contractNo: number) {
  return useQuery({
    queryKey: ['unwrittenLessons', contractNo],
    queryFn: () => lessonLogApi.getUnwrittenByContract(contractNo),
    enabled: contractNo > 0,
  });
}

export function useLessonLog(lessonReservationNo: number | null) {
  return useQuery({
    queryKey: ['lessonLog', lessonReservationNo],
    queryFn: () => lessonLogApi.getByLesson(lessonReservationNo!),
    enabled: !!lessonReservationNo,
  });
}

export function useCreateLessonLog() {
  const qc = useQueryClient();
  const { showToast } = useToast();
  return useMutation({
    mutationFn: (data: LessonLogCreateRequest) => lessonLogApi.create(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['lessonLog', vars.lessonReservationNo] });
      showToast('레슨 일지가 작성되었습니다.', 'success');
    },
  });
}

export function useUpdateLessonLog(logNo: number, lessonReservationNo: number) {
  const qc = useQueryClient();
  const { showToast } = useToast();
  return useMutation({
    mutationFn: (data: LessonLogUpdateRequest) => lessonLogApi.update(logNo, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessonLog', lessonReservationNo] });
      showToast('일지가 수정되었습니다.', 'success');
    },
  });
}

export function useRegisterQuestion(logNo: number, lessonReservationNo: number) {
  const qc = useQueryClient();
  const { showToast } = useToast();
  return useMutation({
    mutationFn: (question: string) => lessonLogApi.registerQuestion(logNo, question),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessonLog', lessonReservationNo] });
      showToast('질문이 등록되었습니다.', 'success');
    },
  });
}

export function useRegisterReply(logNo: number, lessonReservationNo: number) {
  const qc = useQueryClient();
  const { showToast } = useToast();
  return useMutation({
    mutationFn: (reply: string) => lessonLogApi.registerReply(logNo, reply),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['lessonLog', lessonReservationNo] });
      showToast('답변이 등록되었습니다.', 'success');
    },
  });
}
