import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../../lib/api';
import '../css/multi-level-selector/mls-base.css';
import '../css/multi-level-selector/mls-container.css';
import '../css/multi-level-selector/mls-grid.css';
import '../css/multi-level-selector/mls-button.css';
import '../css/multi-level-selector/mls-lesson.css';

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

export default function OnboardingLesson() {
  // (선택) 이전 단계 가드
  // const step1 = load<{ role: "TUTOR" | "STUDENT"; nickname: string }>("onboarding.step1");
  // const step2 = load<any>("onboarding.step2.tutor");
  // if (!step1 || step1.role !== "TUTOR") { window.location.replace("/onboarding"); return null; }
  // if (!step2) { window.location.replace("/onboarding/tutor"); return null; }

  const [mains, setMains] = useState<Category[]>([]);
  const [subs, setSubs] = useState<SubCategory[]>([]);
  const [mainCode, setMainCode] = useState<string>('');
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingSub, setLoadingSub] = useState(false);

  // 다중 선택(소분류)
  const [selectedSubs, setSelectedSubs] = useState<Set<string>>(new Set());

  // 대분류 로딩
  useEffect(() => {
    (async () => {
      try {
        setLoadingMain(true);
        const list = await api<Category[]>(MAIN_CATEGORIES_URL);
        setMains(list ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingMain(false);
      }
    })();
  }, []);

  // 대분류 선택 → 소분류 로딩
  const selectMain = async (code: string) => {
    if (!code || code === mainCode) return;
    setMainCode(code);
    setSelectedSubs(new Set());
    setSubs([]);
    try {
      setLoadingSub(true);
      const list = await api<SubCategory[]>(SUB_CATEGORIES_URL(code));
      setSubs(list ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSub(false);
    }
  };

  // 소분류 토글
  const toggleSub = (code: string) => {
    setSelectedSubs((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  };

  // 칩 목록
  const chipList = useMemo(() => {
    const map = new Map<string, string>(); // code -> label
    subs.forEach((s) => {
      if (selectedSubs.has(String(s.code))) {
        map.set(String(s.code), s.label);
      }
    });
    return Array.from(map.entries());
  }, [subs, selectedSubs]);

  const removeChip = (code: string) => {
    setSelectedSubs((prev) => {
      const next = new Set(prev);
      next.delete(code);
      return next;
    });
  };

  // 제출 가능 여부
  const canSubmit = Boolean(mainCode) && selectedSubs.size > 0;

  const goNext = () => {
    if (!canSubmit) return;
    localStorage.setItem(
      'onboarding.step3.tutor',
      JSON.stringify({ mainCode, subCodes: Array.from(selectedSubs) })
    );
    window.location.href = '/onboarding/tutor/region';
  };

  return (
    <div className="mls-card mls-lesson">
      <div className="mls-header">
        <h2 className="text-xl" style={{ fontWeight: 700 }}>
          관심 있는 과목을 선택해 주세요
        </h2>
        <div className="mls-sub">(대분류 1개 선택 후, 소분류 여러 개 선택 가능)</div>
      </div>

      {/* Chips */}
      <div className="mls-chips">
        {chipList.length === 0 ? (
          <span className="mls-sub" style={{ fontSize: 13 }}>
            소분류 카드를 선택하면 이곳에 표시돼요
          </span>
        ) : (
          chipList.map(([code, label]) => (
            <span key={code} className="mls-chip">
              {label}
              <button aria-label="remove" onClick={() => removeChip(code)}>
                <X size={14} />
              </button>
            </span>
          ))
        )}
      </div>

      {/* Body: 그리드 */}
      <div className="mls-body">
        <div style={{ padding: '16px 20px 8px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, margin: '0 0 8px 2px' }}>대분류</div>
          <div className="mls-grid">
            {mains.map((m) => {
              const active = mainCode === m.code;
              return (
                <div
                  key={m.code}
                  className={`mls-card-item ${active ? 'active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => selectMain(m.code)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && selectMain(m.code)}
                >
                  <span style={{ fontWeight: 700 }}>{m.label}</span>
                  <span className="mls-check" />
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '0 20px 16px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, margin: '8px 0 8px 2px' }}>소분류</div>
          {!mainCode ? (
            <div className="mls-sub">먼저 대분류를 선택하세요.</div>
          ) : loadingSub ? (
            <div>소분류 불러오는 중…</div>
          ) : (
            <div className="mls-grid">
              {subs.map((s) => {
                const code = String(s.code);
                const active = selectedSubs.has(code);
                return (
                  <div
                    key={s.code}
                    className={`mls-card-item ${active ? 'active' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSub(code)}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleSub(code)}
                  >
                    <span style={{ fontWeight: 700 }}>{s.label}</span>
                    <span className="mls-check" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mls-footer">
        <button className="mls-button" disabled={!canSubmit} onClick={goNext}>
          저장 / 다음 →
        </button>
      </div>
    </div>
  );
}
