import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ContractRequestForm from '@/domain/booking/pages/ContractRequestForm';
import { fetchContractDetail } from '../api/contractApi';
import type { Contract } from '../types/contract';
import { CONTRACT_TYPES, getContractTypeLabel } from '@/domain/booking/types/types';

export default function ContractEditPage() {
  const { contractNo } = useParams<{ contractNo: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // URL 파라미터에서 타입 가져오기
  const typeParam = searchParams.get('type');
  const newContractType =
    typeParam === 'first-come' ? CONTRACT_TYPES.FIRSTCOME : CONTRACT_TYPES.REGULAR;

  const { data: contract, isLoading } = useQuery<Contract>({
    queryKey: ['contract', contractNo],
    queryFn: () => fetchContractDetail(Number(contractNo)),
    enabled: !!contractNo,
  });

  if (isLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>계약 정보를 불러오는 중...</p>
      </div>
    );
  }

  if (!contract) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>계약 정보를 찾을 수 없습니다.</p>
        <button onClick={() => navigate('/student/my/tutors')}>돌아가기</button>
      </div>
    );
  }

  return (
    <ContractRequestForm
      tutorProfileNo={contract.tutorProfileNo.toString()}
      step={1}
      total={4}
      title={`${getContractTypeLabel(newContractType)}으로 변경`}
      contractType={newContractType} // URL 파라미터의 타입 사용
      lessonCategoryOptions={
        contract.lessonSubCategory
          ? [
              {
                label: contract.lessonSubCategory.label,
                value: contract.lessonSubCategory.code,
              },
            ]
          : []
      }
      pricePerLesson={contract.totalPrice / contract.lessonCount || 0}
      onSubmit={() => {}}
      onFirst={() => navigate('/student/my/tutors')}
      mode="edit"
      contractNo={Number(contractNo)}
      initialData={{
        lessonCategory: contract.lessonSubCategory
          ? {
              label: contract.lessonSubCategory.label,
              value: contract.lessonSubCategory.code,
            }
          : undefined,
        place: contract.place,
        weekCount: contract.weekCount,
        lessonDtList: [], // 기존 일정은 별도 조회 필요
        level: contract.level || '',
        memo: contract.memo || '',
        emergencyContact: contract.emergencyContact || '',
      }}
    />
  );
}
