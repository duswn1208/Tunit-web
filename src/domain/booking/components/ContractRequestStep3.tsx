import Header from '@/shared/components/Header';
import RadioGroup from '@/shared/components/RadioGroup';
import ContractRequestStepFooter from './ContractRequestStepFooter';

interface ContractRequestStep3Props {
  level: string;
  setLevel: (v: string) => void;
  memo: string;
  setMemo: (v: string) => void;
  emergencyContact: string;
  setEmergencyContact: (v: string) => void;
  onPrev: () => void;
  onSubmit: () => void;
}

export default function ContractRequestStep3Props({
  level,
  setLevel,
  memo,
  setMemo: setMemo,
  emergencyContact,
  setEmergencyContact,
  onPrev,
  onSubmit,
}: ContractRequestStep3Props) {
  return (
    <div>
      <Header title="레슨 경험 및 실력" />
      <RadioGroup
        name="lesson-level"
        options={[
          { label: '초급', value: '초급' },
          { label: '중급', value: '중급' },
          { label: '고급', value: '고급' },
        ]}
        defaultValue={level}
        onChange={setLevel}
        className="horizontal"
      />
      <Header title="요청사항" />
      <textarea
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="튜터에게 전달할 요청사항을 입력해주세요. (선택사항)"
        style={{
          width: '100%',
          minHeight: 60,
          borderRadius: 8,
          border: '1px solid #ddd',
          padding: 10,
          fontSize: 15,
          marginTop: 12,
        }}
      />
      <Header title="비상 연락처" />
      <input
        type="tel"
        value={emergencyContact}
        onChange={(e) => setEmergencyContact(e.target.value)}
        style={{
          width: '100%',
          borderRadius: 8,
          border: '1px solid #ddd',
          padding: 10,
          fontSize: 15,
          marginBottom: 16,
        }}
        required
      />
      <ContractRequestStepFooter
        onPrev={onPrev}
        onNext={onSubmit}
        nextLabel="신청하기"
        nextDisabled={!level}
        prevLabel="이전"
        nextType="button"
      />
    </div>
  );
}
