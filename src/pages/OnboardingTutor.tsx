import { useForm } from 'react-hook-form';

// 1단계(역할/닉네임) 로딩 유틸
type Role = 'TUTOR' | 'STUDENT';
type Step1 = { role: Role; nickname: string };

function loadStep1(): Step1 | null {
  try {
    const raw = localStorage.getItem('onboarding.step1');
    return raw ? (JSON.parse(raw) as Step1) : null;
  } catch {
    return null;
  }
}

// 2단계 폼 타입
type FormData = {
  intro: string; // 소개글
  years: number; // 경력 연수
  hourlyRate: number; // 시간당 레슨 금액(원)
  unitMinutes: 30 | 45 | 60 | 90; // 기본 수업 단위(분)
};

export default function OnboardingTutor() {
  const step1 = loadStep1();

  // 가드: 1단계 미완료/역할 불일치 시 1단계로 보냄
  if (!step1 || step1.role !== 'TUTOR') {
    window.location.replace('/onboarding');
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      intro: '',
      years: 0,
      hourlyRate: 0,
      unitMinutes: 60,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (isSubmitting) return; // early return

    // 최종 Payload: 1단계 + 2단계 합치기
    let payload = {
      role: step1.role, // "TUTOR"
      nickname: step1.nickname, // 1단계 닉네임
      intro: data.intro.trim(),
      years: Number(data.years),
      hourlyRate: Number(data.hourlyRate),
      unitMinutes: Number(data.unitMinutes),
    };

    // 필요 시 임시 저장(선택)
    localStorage.setItem('onboarding.step2.tutor', JSON.stringify(payload));
    window.location.href = '/onboarding/tutor/lesson'; // 여기로 이동
  };

  return (
    <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 16px' }}>
      <h1>튜터 온보딩 (2/4)</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        {step1.nickname} 님 ! 소개, 경력, 레슨 단가/단위를 입력해주세요. (시간/휴무는 다음 단계에서
        설정)
      </p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 24 }}>
        {/* 소개글 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <label htmlFor="intro">소개글</label>
          <textarea
            id="intro"
            rows={5}
            placeholder="예) 클래식 기타 8년 경력, 성인·초보자 환영합니다. 기초부터 곡 완주까지 탄탄히."
            {...register('intro', {
              required: '소개글은 필수입니다.',
              minLength: { value: 10, message: '10자 이상 입력해주세요.' },
              maxLength: { value: 500, message: '500자 이내로 작성해주세요.' },
            })}
          />
          {errors.intro && (
            <span style={{ color: '#c00', fontSize: 12 }}>{errors.intro.message}</span>
          )}
        </div>

        {/* 경력 연수 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <label htmlFor="years">경력 연수</label>
          <input
            id="years"
            type="number"
            min={0}
            step={1}
            placeholder="예) 5"
            {...register('years', {
              required: '경력 연수를 입력해주세요.',
              valueAsNumber: true,
              min: { value: 0, message: '0 이상만 입력 가능합니다.' },
              max: { value: 60, message: '60년 이하로 입력해주세요.' },
            })}
          />
          {errors.years && (
            <span style={{ color: '#c00', fontSize: 12 }}>{errors.years.message}</span>
          )}
        </div>

        {/* 시간당 레슨 금액 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
          <label htmlFor="hourlyRate">시간당 레슨 금액(원)</label>
          <input
            id="hourlyRate"
            type="number"
            min={0}
            step={1000}
            placeholder="예) 50000"
            {...register('hourlyRate', {
              required: '시간당 금액을 입력해주세요.',
              valueAsNumber: true,
              min: { value: 0, message: '0원 이상만 입력 가능합니다.' },
              max: { value: 1000000, message: '1,000,000원 이하로 입력해주세요.' },
            })}
          />
          {errors.hourlyRate && (
            <span style={{ color: '#c00', fontSize: 12 }}>{errors.hourlyRate.message}</span>
          )}
        </div>

        {/* 기본 수업 단위(분) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
          <label htmlFor="unitMinutes">기본 수업 단위(분)</label>
          <select
            id="unitMinutes"
            {...register('unitMinutes', { required: true, valueAsNumber: true })}
          >
            <option value={30}>30분</option>
            <option value={45}>45분</option>
            <option value={60}>60분</option>
            <option value={90}>90분</option>
          </select>
          {errors.unitMinutes && (
            <span style={{ color: '#c00', fontSize: 12 }}>수업 단위를 선택해주세요.</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', height: 44 }}>
          저장 및 완료 →
        </button>
      </form>
    </div>
  );
}
