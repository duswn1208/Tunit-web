import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';

export function useLessonCheckAndRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    async function checkLesson() {
      try {
        const data = await api<{ hasLesson: boolean }>('/api/lessons/exist');
        if (!data.hasLesson) {
          alert('등록된 레슨이 없습니다. 마이페이지 이동 후 학생을 입력해주세요');
          navigate('/mypage', { replace: true });
        }
      } catch {
        // 필요시 에러 처리
      }
    }
    checkLesson();
  }, [navigate]);
}
