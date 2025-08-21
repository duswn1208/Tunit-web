import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

// 1·2단계 데이터 로딩(가드)
type Role = 'TUTOR' | 'STUDENT';
type Step1 = { role: Role; nickname: string };
type Step2 = {
  role: Role;
  nickname: string;
  intro: string;
  years: number;
  hourlyRate: number;
  unitMinutes: number;
};

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// 서버 응답 타입(@JsonFormat(shape=OBJECT) 가정)
type Category = { code: string; label: string };
type SubCategory = { code: string; label: string; parentCode: string; parentLabel: string };

// TODO(back): 이후 캐싱(@Cacheable) 고려
const MAIN_CATEGORIES_URL = '/api/lessons/categories';
const SUB_CATEGORIES_URL = (mainCode: string) =>
  `/api/lessons/categories/${mainCode}/subcategories`;

export default function OnboardingLesson() {
  // 가드
  const step1 = load<Step1>('onboarding.step1');
  const step2 = load<Step2>('onboarding.step2.tutor');
  if (!step1 || step1.role !== 'TUTOR') {
    window.location.replace('/onboarding');
    return null;
  }
  if (!step2) {
    window.location.replace('/onboarding/tutor');
    return null;
  }

  const [mains, setMains] = useState<Category[]>([]);
  const [subs, setSubs] = useState<SubCategory[]>([]);
  const [mainCode, setMainCode] = useState<string>('');
  const [subCode, setSubCode] = useState<string>('');

  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingSub, setLoadingSub] = useState(false);
  const [err, setErr] = useState('');

  // 대분류 로딩
  useEffect(() => {
    (async () => {
      try {
        setLoadingMain(true);
        const list = await api<Category[]>(MAIN_CATEGORIES_URL);
        setMains(list);
      } catch (e: any) {
        setErr(e.message || '카테고리 조회 실패');
      } finally {
        setLoadingMain(false);
      }
    })();
  }, []);

  // 대분류 클릭 시 소분류 로딩
  const selectMain = async (code: string) => {
    if (code === mainCode) return;
    setMainCode(code);
    setSubCode('');
    setSubs([]);
    if (!code) return;
    try {
      setLoadingSub(true);
      const list = await api<SubCategory[]>(SUB_CATEGORIES_URL(code));
      setSubs(list);
      setSubCode(list[0]?.code ?? '');
    } catch (e: any) {
      setErr(e.message || '소분류 조회 실패');
    } finally {
      setLoadingSub(false);
    }
  };

  const canSubmit = useMemo(() => !!mainCode && !!subCode, [mainCode, subCode]);

  const submit = async () => {
    if (!canSubmit) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    const payload = {
      role: step1.role,
      nickname: step1.nickname,
      intro: step2!.intro,
      years: step2!.years,
      hourlyRate: step2!.hourlyRate,
      unitMinutes: step2!.unitMinutes,
      lessonCategoryCode: mainCode,
      lessonSubCategoryCode: subCode,
    };

    localStorage.setItem('onboarding.step3.tutor', JSON.stringify({ mainCode, subCode }));

    try {
      await api('/api/tutors/onboarding', {
        method: 'POST',
        body: JSON.stringify(payload),
      } as any);
      window.location.href = '/mypage';
    } catch (e: any) {
      alert(e.message || '저장 실패');
    }
  };

  // 공용 카드 컴포넌트
  const Card = ({
    active,
    label,
    onClick,
  }: {
    active?: boolean;
    label: string;
    onClick?: () => void;
  }) => (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      style={{
        border: active ? '2px solid #111' : '1px solid #ddd',
        borderRadius: 12,
        padding: '14px 16px',
        cursor: 'pointer',
        userSelect: 'none',
        background: active ? '#fff' : '#fafafa',
        boxShadow: active ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
        outline: 'none',
      }}
    >
      <div style={{ fontWeight: 700 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 880, margin: '60px auto', padding: '0 16px' }}>
      {/* 닉네임 표시 */}
      <div
        style={{ background: '#f6f6f6', padding: '10px 12px', borderRadius: 8, marginBottom: 16 }}
      >
        <b>닉네임</b>: {step1.nickname}
      </div>

      <h1>튜터 온보딩 (3/3)</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        대분류 카드를 선택하면, 아래에 해당 소분류 카드들이 표시됩니다.
      </p>

      {/* 대분류 카드 그리드 */}
      <section style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 8 }}>대분류</h3>
        {loadingMain ? (
          <div>대분류 불러오는 중…</div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 12,
            }}
          >
            {mains.map((m) => (
              <Card
                key={m.code}
                label={m.label}
                active={mainCode === m.code}
                onClick={() => selectMain(m.code)}
              />
            ))}
          </div>
        )}
      </section>

      {/* 소분류 카드 그리드 */}
      <section style={{ marginTop: 24 }}>
        <h3 style={{ marginBottom: 8 }}>소분류</h3>
        {!mainCode ? (
          <div style={{ opacity: 0.7 }}>먼저 대분류를 선택하세요.</div>
        ) : loadingSub ? (
          <div>소분류 불러오는 중…</div>
        ) : subs.length ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: 12,
            }}
          >
            {subs.map((s) => (
              <div key={s.code} style={{ position: 'relative' }}>
                <Card
                  label={s.label}
                  active={subCode === s.code}
                  onClick={() => setSubCode(s.code)}
                />
                {/* 선택 배지 */}
                {subCode === s.code && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      fontSize: 11,
                      background: '#111',
                      color: '#fff',
                      padding: '2px 6px',
                      borderRadius: 999,
                    }}
                  >
                    선택됨
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ opacity: 0.7 }}>소분류가 없습니다.</div>
        )}
      </section>

      {err && <div style={{ color: '#c00', fontSize: 12, marginTop: 12 }}>{err}</div>}

      <button
        type="button"
        onClick={submit}
        disabled={!canSubmit}
        style={{ width: '100%', height: 44, marginTop: 28 }}
      >
        저장 및 완료 →
      </button>
    </div>
  );
}
