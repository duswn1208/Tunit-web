import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/shared/contexts/ToastContext';
import { fetchContractDetail } from '@/domain/contract/api/contractApi';
import { bookLesson, rescheduleLesson } from '../api/lessonBookingApi';
import LessonBookingForm from '../components/LessonBookingForm';
import type { Contract } from '@/domain/contract/types/contract';

export default function LessonBookingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const contractNo = searchParams.get('contractNo');
  const mode = (searchParams.get('mode') as 'new' | 'reschedule') || 'new';
  const lessonReservationNo = searchParams.get('lessonReservationNo');
  const lessonDate = searchParams.get('lessonDate');
  const startTime = searchParams.get('startTime');
  const endTime = searchParams.get('endTime');

  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contractNo) {
      setError('계약 번호가 없습니다.');
      setLoading(false);
      return;
    }

    fetchContractDetail(Number(contractNo))
      .then((data) => {
        setContract(data as Contract);
        setLoading(false);
      })
      .catch((err) => {
        setError('계약 정보를 불러오는데 실패했습니다.');
        setLoading(false);
      });
  }, [contractNo]);

  const handleSubmit = async (data: {
    lessonDate: string;
    startTime: string;
    endTime: string;
    memo?: string;
  }) => {
    if (!contract) return;

    try {
      if (mode === 'new') {
        // 신규 레슨 예약
        await bookLesson({
          contractNo: contract.contractNo,
          ...data,
        });
        showToast('레슨이 예약되었습니다.', 'success');
      } else if (mode === 'reschedule' && lessonReservationNo) {
        // 레슨 날짜/시간 변경
        await rescheduleLesson({
          lessonReservationNo: Number(lessonReservationNo),
          ...data,
        });
        showToast('레슨 일정이 변경되었습니다.', 'success');
      }

      // 성공 시 레슨 목록 페이지로 이동
      navigate(`/student/my/lessons?contractNo=${contract.contractNo}`);
    } catch (error) {
      const errorMsg =
        error.message ||
        (mode === 'new' ? '레슨 예약에 실패했습니다.' : '레슨 일정 변경에 실패했습니다.');
      showToast(errorMsg, 'error');
      throw error; // LessonBookingForm에서 처리
    }
  };

  const handleCancel = () => {
    if (contract) {
      navigate(`/student/my/lessons?contractNo=${contract.contractNo}`);
    } else {
      navigate(-1);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: 'center', maxWidth: '100%', overflow: 'hidden' }}>
        <div>로딩 중...</div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div style={{ padding: 20, textAlign: 'center', maxWidth: '100%', overflow: 'hidden' }}>
        <div style={{ color: '#d32f2f', marginBottom: 16 }}>
          {error || '계약 정보를 찾을 수 없습니다.!'}
        </div>
        <button onClick={() => navigate(-1)} className="ui-btn">
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '100%', overflow: 'hidden' }}>
      <LessonBookingForm
        contract={contract}
        tutorProfileNo={contract.tutorProfileNo}
        mode={mode}
        existingLesson={
          mode === 'reschedule' && lessonReservationNo && lessonDate && startTime && endTime
            ? {
                lessonReservationNo: Number(lessonReservationNo),
                lessonDate,
                startTime,
                endTime,
              }
            : undefined
        }
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
}
