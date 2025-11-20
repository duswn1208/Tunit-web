import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import ContractRequestForm from './ContractRequestForm';
import { getContractTypeLabel, toContractType } from '../types/types';

export default function ContractRequestFormPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const type = searchParams.get('type') || 'regular';

  const tutorInfo = location.state?.tutor || null;
  const tutorProfileNo = tutorInfo.tutorProfileNo;

  const contractType = toContractType(type);
  return (
    <ContractRequestForm
      tutorProfileNo={tutorProfileNo}
      step={1}
      total={4}
      title={getContractTypeLabel(contractType)}
      contractType={contractType}
      lessonCategoryOptions={tutorInfo.lessonSubcategoryList.map((cat: any) => ({
        label: cat.lessonCategory.label,
        value: cat.lessonCategory.code,
      }))}
      pricePerLesson={tutorInfo.pricePerHour || 0}
      onSubmit={() => {}}
      onFirst={() => {
        if (tutorProfileNo) navigate(`/tutors/${tutorProfileNo}`);
      }}
    />
  );
}
