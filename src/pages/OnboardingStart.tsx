import { useForm } from 'react-hook-form';

type Role = 'TUTOR' | 'STUDENT';
type FormData = {
  role: Role;
  nickname: string;
};

export default function OnboardingStart() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ defaultValues: { role: 'TUTOR', nickname: '' } });

  const onSubmit = (data: FormData) => {
    if (isSubmitting) return;
    // 1단계 저장
    localStorage.setItem('onboarding.step1', JSON.stringify(data));

    // 역할에 따라 2단계 라우팅
    if (data.role === 'TUTOR') {
      window.location.href = '/onboarding/tutor';
    } else {
      // 학생 온보딩 준비되기 전까지 임시로 마이페이지/메인으로 유도
      // window.location.href = "/onboarding/student";
      window.location.href = '/mypage';
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: '60px auto', padding: '0 16px' }}>
      <h1>온보딩 (1/2)</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>역할을 선택하고 닉네임을 설정해주세요.</p>

      <form onSubmit={handleSubmit(onSubmit)} style={{ marginTop: 24 }}>
        {/* 역할 선택 */}
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 6 }}>역할</label>
          <label style={{ marginRight: 16 }}>
            <input type="radio" value="TUTOR" {...register('role', { required: true })} />
            &nbsp;튜터
          </label>
          <label>
            <input type="radio" value="STUDENT" {...register('role', { required: true })} />
            &nbsp;학생
          </label>
          {errors.role && (
            <div style={{ color: '#c00', fontSize: 12, marginTop: 6 }}>역할을 선택하세요.</div>
          )}
        </div>

        {/* 닉네임 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 24 }}>
          <label htmlFor="nickname">닉네임</label>
          <input
            id="nickname"
            placeholder="예) 튠잇기타왕"
            {...register('nickname', {
              required: '닉네임은 필수입니다.',
              minLength: { value: 2, message: '2자 이상 입력해주세요.' },
              maxLength: { value: 20, message: '20자 이내로 입력해주세요.' },
              pattern: { value: /^[\w가-힣]+$/, message: '한글/영문/숫자/밑줄만 허용됩니다.' },
            })}
          />
          {errors.nickname && (
            <span style={{ color: '#c00', fontSize: 12 }}>{errors.nickname.message}</span>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: '100%', height: 44 }}>
          다음 →
        </button>
      </form>
    </div>
  );
}
