import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

// ====== 타입 ======
type Category = { code: string; label: string };
type SubCategory = { code: string; label: string; parentCode: string; parentLabel: string };

// ====== 상수(엔드포인트) ======
const MAIN_CATEGORIES_URL = '/api/lessons/categories';
const SUB_CATEGORIES_URL = (mainCode: string) =>
  `/api/lessons/categories/${encodeURIComponent(mainCode)}/subcategories`;

// ====== 유틸 ======
function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

// ====== 컴포넌트 ======
export default function OnboardingLesson() {
  // (선택) 이전 단계 가드가 필요하면 주석 해제
  // const step1 = load<{ role: "TUTOR" | "STUDENT"; nickname: string }>("onboarding.step1");
  // const step2 = load<any>("onboarding.step2.tutor");
  // if (!step1 || step1.role !== "TUTOR") { window.location.replace("/onboarding"); return null; }
  // if (!step2) { window.location.replace("/onboarding/tutor"); return null; }

  // 상태
  const [mains, setMains] = useState<Category[]>([]);
  const [subs, setSubs] = useState<SubCategory[]>([]);
  const [mainCode, setMainCode] = useState<string>('');
  const [subCode, setSubCode] = useState<string>('');

  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingSub, setLoadingSub] = useState(false);
  const [selectedSubList, setSelectedSubList] = useState<Set<string>>(new Set());

  // 대분류 로딩
  useEffect(() => {
    (async () => {
      try {
        setLoadingMain(true);
        const list = await api<Category[]>(MAIN_CATEGORIES_URL);
        setMains(list);
      } catch (e: any) {
      } finally {
        setLoadingMain(false);
      }
    })();
  }, []);

  const selectMain = async (code: string) => {
    if (!code || code === mainCode) return;
    setMainCode(code);
    setSubCode('');
    setSelectedSubList(new Set());
    setSubs([]);

    try {
      setLoadingSub(true);
      const list = await api<SubCategory[]>(SUB_CATEGORIES_URL(code));
      setSubs(list);
    } catch (e: any) {
    } finally {
      setLoadingSub(false);
    }
  };

  // 제출 가능 여부
  const canSubmit = Boolean(mainCode && selectedSubList);

  // 저장/다음
  const goNext = async () => {
    if (!canSubmit) return;
    // 3단계 선택만 임시 저장 (다음 단계에서 1/2단계와 합칩니다)
    localStorage.setItem('onboarding.step3.tutor', JSON.stringify({ mainCode, subCode }));
    // 다음 단계(지역)로 이동
    window.location.href = '/onboarding/tutor/region';
  };

  const toggleSub = (code: string) => {
    setSelectedSubList((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  // 공통 카드
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
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick?.()}
      style={{
        border: active ? '2px solid #111' : '1px solid #ddd',
        borderRadius: 8,
        padding: '14px 16px',
        cursor: 'pointer',
        userSelect: 'none',
        background: active ? '#f52a2a' : '#fafafa',
        color: active ? 'white' : 'black',
        boxShadow: active ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
        outline: 'none',
        transition: 'border-color .12s ease',
      }}
    >
      <div style={{ fontWeight: 700 }}>{label}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 880, margin: '60px auto', padding: '0 16px' }}>
      <h1>튜터 온보딩 (3/4) – 레슨 카테고리</h1>
      <p style={{ opacity: 0.8, marginTop: 8 }}>
        대분류 카드를 선택하면, 해당 소분류 카드가 아래에 표시됩니다.
      </p>

      {/* 대분류 */}
      <section style={{ marginTop: 20 }}>
        <h3 style={{ marginBottom: 8 }}>대분류</h3>
        {loadingMain ? (
          <div>대분류 불러오는 중…</div>
        ) : mains.length ? (
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
        ) : (
          <div style={{ opacity: 0.7 }}>대분류가 없습니다.</div>
        )}
      </section>

      {/* 소분류 */}
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
            {subs.map((s) => {
              const code = String(s.code);
              const active = selectedSubList.has(code);

              return (
                <div key={s.code} style={{ position: 'relative' }}>
                  <div
                    role="button"
                    data-code={code}
                    tabIndex={0}
                    onClick={() => {
                      toggleSub(code);
                    }}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSub(code)}
                    style={{
                      border: active ? '2px solid #111' : '1px solid #ddd',
                      borderRadius: 12,
                      padding: '14px 16px',
                      cursor: 'pointer',
                      userSelect: 'none',
                      background: active ? '#f52a2a' : '#fafafa',
                      color: active ? 'white' : 'black',
                      boxShadow: active ? '0 2px 10px rgba(0,0,0,0.06)' : 'none',
                      outline: 'none',
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{s.label}</div>
                  </div>
                  {active}
                </div>
              );
            })}
          </div>
        ) : (
          <div>선택한 값이 없습니다.</div>
        )}
      </section>

      <button
        type="button"
        onClick={goNext}
        disabled={!canSubmit}
        style={{ width: '100%', height: 44, marginTop: 28 }}
      >
        저장 / 다음 →
      </button>
    </div>
  );
}
