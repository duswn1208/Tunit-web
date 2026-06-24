import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/auth/AuthContext';
import { api } from '@/shared/lib/api';
import '../css/tutor-home.css';

/* =====================================================================
 * 튜터 홈 — 액션 센터
 * ---------------------------------------------------------------------
 * 필요한 API (기존 엔드포인트 재사용 + 일부 신규 권장)
 *
 * 1) [필수·기존] 레슨 목록 조회   GET /api/lessons?startDate=&endDate=
 *    - LessonManagePage 와 동일한 엔드포인트입니다.
 *    - 응답: { lessonList: [{ lessonId, studentName, status: { name }, date, startTime, durationMinutes, lessonType, isRecurring }] }
 *    - status.name 값: REQUESTED(신청) / CONFIRMED(확정) / COMPLETED(완료) / CANCELLED(취소) / CANDIDATE(선착순 후보)
 *    - 이 화면은 "이번 주" 범위로 한 번 호출해서 아래를 모두 파생합니다:
 *        · 오늘 레슨 목록 / 오늘 레슨 수
 *        · 확인 대기(REQUESTED) 신청 목록 / 건수
 *        · 이번 주 레슨 수
 *
 * 2) [필수·기존] 레슨 상태 변경   POST /api/lessons/{lessonId}/status   body: { status }
 *    - 신청 수락:  status = 'CONFIRMED'
 *    - 신청 거절:  status = 'CANCELLED'   (※ 거절 전용 상태/엔드포인트가 따로 있으면 알려주세요)
 *
 * 3) [선택·신규 권장] 홈 요약 통계  GET /api/tutor/home/summary
 *    - 위 1)에서 클라이언트가 직접 집계하고 있으나, 트래픽/정확도를 위해
 *      서버 집계 엔드포인트가 있으면 더 좋습니다.
 *    - 응답 예: { todayCount, pendingCount, weekCount }
 *    - 신규 추가 시 fetchSummary() 의 주석 처리된 부분으로 교체하세요.
 * ===================================================================== */

const AVATAR_COLORS = ['#6B4EFF', '#0075FF', '#00B386', '#FF6B35', '#F7A300', '#F04452', '#4F59D6'];
function avatarColor(name: string) {
  return AVATAR_COLORS[(name || '').charCodeAt(0) % AVATAR_COLORS.length];
}

interface LessonItem {
  lessonId: number;
  studentName: string;
  statusName: string; // REQUESTED | CONFIRMED | COMPLETED | CANCELLED | CANDIDATE
  date: string;       // YYYY-MM-DD
  startTime: string;  // HH:mm
  durationMinutes?: number;
  lessonType?: string; // TRIAL(체험) | FIRST_COME(선착순) | ...
  isRecurring?: boolean;
  subject?: string;
}

const STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  REQUESTED: { label: '신청', color: '#6B4EFF', bg: '#F3F0FF' },
  ACTIVE:    { label: '확정', color: '#0075FF', bg: '#E8F3FF' },
  COMPLETED: { label: '완료', color: '#00B386', bg: '#E6FAF5' },
  CANCELED:  { label: '취소', color: '#F04452', bg: '#FFF0F1' },
  EXPIRED:   { label: '만료', color: '#8B95A1', bg: '#F2F4F6' },
};
const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  TRIAL: { label: '체험', color: '#FF6B35', bg: '#FFF3EE' },
  FIRST_COME: { label: '선착순', color: '#F7A300', bg: '#FFFBEE' },
};

const quickMenu = [
  { icon: 'fas fa-clipboard-list', title: '내 레슨', desc: '등록한 레슨 관리', to: '/tutor/my/lessons', color: '#4F59D6', bg: '#EEEFFE' },
  { icon: 'fas fa-calendar-alt', title: '스케줄', desc: '레슨 가능 시간 설정', to: '/tutor/schedule', color: '#0075FF', bg: '#E8F3FF' },
  { icon: 'fas fa-users', title: '내 학생', desc: '계약 학생 확인', to: '/tutor/my/students', color: '#00B386', bg: '#E6FAF5' },
  { icon: 'fas fa-user', title: '내 프로필', desc: '프로필·소개 관리', to: '/mypage', color: '#FF6B35', bg: '#FFF3EE' },
];
const profileMenu = [
  { icon: 'fas fa-question', title: 'FAQ 관리', to: '/mypage/tutor/faq', color: '#4F59D6', bg: '#EEEFFE' },
  { icon: 'fas fa-award', title: '경력 관리', to: '/mypage/tutor/career-history', color: '#F7A300', bg: '#FFFBEE' },
];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function TutorHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const displayName = user?.nickname || user?.name || '튜터';

  const [lessons, setLessons] = useState<LessonItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ── 이번 주 범위 (일요일 ~ 토요일) ─────────────────────────────
  const today = new Date();
  const todayStr = ymd(today);
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const fetchLessons = () => {
    setLoading(true);
    // [API 1] 이번 주 레슨 조회 — 기존 엔드포인트 재사용
    api
      .get('/api/lessons', { params: { startDate: ymd(weekStart), endDate: ymd(weekEnd) } })
      .then((data: any) => {
        const mapped: LessonItem[] = (data?.lessonList ?? []).map((item: any) => {
          const start = item.startTime ?? '';
          const end = item.endTime ?? '';
          const durationMinutes = (start && end)
            ? Math.round((new Date(`2000-01-01T${end}`) as any - (new Date(`2000-01-01T${start}`) as any)) / 60000)
            : 60;
          return {
            lessonId: item.lessonReservationNo ?? item.lessonId ?? item.id,
            studentName: item.studentName,
            statusName: item.status?.name ?? item.status,
            date: item.date,
            startTime: start,
            durationMinutes,
            lessonType: item.lessonType ?? item.category?.name,
            isRecurring: item.isRecurring,
            subject: item.subject ?? item.lessonName ?? item.category?.label,
          };
        });
        setLessons(mapped);
      })
      .catch(() => setLessons([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── 파생 데이터 ────────────────────────────────────────────────
  const activeLessons = lessons.filter((l) => l.statusName !== 'CANDIDATE');
  const todayLessons = activeLessons
    .filter((l) => l.date === todayStr)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
  const pendingRequests = lessons.filter((l) => l.statusName === 'REQUESTED');
  const weekCount = activeLessons.length;

  /* [API 3 · 선택] 서버 집계 사용 시 위 3개 파생 대신 아래로 교체:
   * const [summary, setSummary] = useState({ todayCount: 0, pendingCount: 0, weekCount: 0 });
   * api.get('/api/tutor/home/summary').then(setSummary);
   */

  const stats = [
    { id: 'today', icon: 'fas fa-calendar-day', value: todayLessons.length, unit: '개', label: '오늘 레슨', color: '#4F59D6', bg: '#EEEFFE', alert: false, to: '/tutor/my/lessons' },
    { id: 'pending', icon: 'fas fa-clock', value: pendingRequests.length, unit: '건', label: '확인 대기', color: '#F7A300', bg: '#FFFBEE', alert: pendingRequests.length > 0, to: '/tutor/my/lessons' },
    { id: 'week', icon: 'fas fa-chart-line', value: weekCount, unit: '회', label: '이번주 레슨', color: '#00B386', bg: '#E6FAF5', alert: false, to: '/tutor/my/lessons' },
  ];

  // ── 신청 수락 / 거절 ──────────────────────────────────────────
  const handleAccept = async (lessonId: number) => {
    try {
      // [API 2] 수락 → CONFIRMED
      await api.post(`/api/lessons/${lessonId}/status`, { status: 'ACTIVE' });
      fetchLessons();
    } catch {
      /* 에러는 공통 Toast 로 처리 권장 */
    }
  };
  const handleReject = async (lessonId: number) => {
    try {
      // [API 2] 거절 → CANCELLED (전용 상태가 있으면 교체)
      await api.post(`/api/lessons/${lessonId}/status`, { status: 'CANCELED' });
      fetchLessons();
    } catch {
      /* 에러는 공통 Toast 로 처리 권장 */
    }
  };

  return (
    <div className="tutor-home">
      {/* 인사 */}
      <div className="tutor-home-greeting-row">
        <h1 className="tutor-home-greeting">안녕하세요, {displayName}님</h1>
        <span className="tutor-home-greeting-sub">오늘도 멋진 레슨을 만들어볼까요?</span>
      </div>

      {/* 통계 */}
      <div className="tutor-home-stats">
        {stats.map((s) => (
          <button key={s.id} className="tutor-home-stat" onClick={() => navigate(s.to)}>
            <span className="tutor-home-stat-icon" style={{ background: s.bg, color: s.color }}>
              <i className={s.icon} aria-hidden="true" />
            </span>
            <span className="tutor-home-stat-body">
              <span className="tutor-home-stat-value">
                {s.value}
                <span className="tutor-home-stat-unit">{s.unit}</span>
              </span>
              <span className="tutor-home-stat-label">{s.label}</span>
            </span>
            {s.alert && <span className="tutor-home-stat-dot" />}
          </button>
        ))}
      </div>

      {/* 확인 대기 신청 */}
      {pendingRequests.length > 0 && (
        <section className="tutor-home-pending">
          <div className="tutor-home-pending-head">
            <div className="tutor-home-pending-title">
              <span className="tutor-home-pending-badge"><i className="fas fa-exclamation" aria-hidden="true" /></span>
              확인 대기 중인 레슨 신청 {pendingRequests.length}건
            </div>
            <button className="tutor-home-pending-all" onClick={() => navigate('/tutor/my/lessons')}>
              전체 보기 <i className="fas fa-chevron-right" aria-hidden="true" />
            </button>
          </div>
          <div className="tutor-home-pending-list">
            {pendingRequests.map((p) => {
              const tm = p.lessonType ? TYPE_META[p.lessonType] : null;
              return (
                <div key={p.lessonId} className="tutor-home-pending-item">
                  <span className="tutor-home-avatar" style={{ background: avatarColor(p.studentName) + '22', color: avatarColor(p.studentName) }}>
                    {p.studentName?.slice(0, 2)}
                  </span>
                  <div className="tutor-home-pending-info">
                    <div className="tutor-home-pending-name-row">
                      <span className="tutor-home-pending-name">{p.studentName}</span>
                      {p.subject && <span className="tutor-home-pending-subject">{p.subject}</span>}
                      {tm && (
                        <span className="tutor-home-type-badge" style={{ color: tm.color, background: tm.bg }}>
                          {tm.label}
                        </span>
                      )}
                    </div>
                    <span className="tutor-home-pending-datetime">{p.date} {p.startTime} 희망</span>
                  </div>
                  <div className="tutor-home-pending-actions">
                    <button className="tutor-home-btn-accept" onClick={() => handleAccept(p.lessonId)}>수락</button>
                    <button className="tutor-home-btn-reject" onClick={() => handleReject(p.lessonId)}>거절</button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 오늘의 레슨 */}
      <section className="tutor-home-today">
        <div className="tutor-home-today-head">
          <div className="tutor-home-today-title">
            <span className="tutor-home-today-dot" />
            오늘의 레슨
            <span className="tutor-home-today-date">
              {today.getMonth() + 1}월 {today.getDate()}일
            </span>
          </div>
          <button className="tutor-home-today-cal" onClick={() => navigate('/tutor/my/lessons')}>
            캘린더 <i className="fas fa-chevron-right" aria-hidden="true" />
          </button>
        </div>

        {loading ? (
          <div className="tutor-home-today-empty">불러오는 중...</div>
        ) : todayLessons.length === 0 ? (
          <div className="tutor-home-today-empty">오늘 예정된 레슨이 없어요</div>
        ) : (
          <div className="tutor-home-today-list">
            {todayLessons.map((l) => {
              const sm = STATUS_META[l.statusName] ?? STATUS_META.ACTIVE;
              return (
                <div key={l.lessonId} className="tutor-home-today-row" onClick={() => navigate('/tutor/my/lessons')}>
                  <div className="tutor-home-today-time">
                    <span className="tutor-home-today-time-main">{l.startTime}</span>
                    <span className="tutor-home-today-time-dur">{l.durationMinutes}분</span>
                  </div>
                  <span className="tutor-home-today-bar" style={{ background: sm.color }} />
                  <span className="tutor-home-avatar" style={{ background: avatarColor(l.studentName) + '22', color: avatarColor(l.studentName) }}>
                    {l.studentName?.slice(0, 2)}
                  </span>
                  <div className="tutor-home-today-info">
                    <span className="tutor-home-today-name">{l.studentName}</span>
                    {l.subject && <span className="tutor-home-today-subject">{l.subject}</span>}
                    {l.isRecurring && <span className="tutor-home-recurring-badge">반복</span>}
                  </div>
                  <span className="tutor-home-status-badge" style={{ color: sm.color, background: sm.bg }}>
                    {sm.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 바로가기 */}
      <section className="tutor-home-section">
        <div className="tutor-home-section-title">바로가기</div>
        <div className="tutor-home-quick-grid">
          {quickMenu.map((m) => (
            <button key={m.to} className="tutor-home-quick-card" onClick={() => navigate(m.to)}>
              <span className="tutor-home-quick-icon" style={{ background: m.bg, color: m.color }}>
                <i className={m.icon} aria-hidden="true" />
              </span>
              <span className="tutor-home-quick-card-title">{m.title}</span>
              <span className="tutor-home-quick-card-desc">{m.desc}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 프로필 관리 */}
      <section className="tutor-home-section">
        <div className="tutor-home-section-title">프로필 관리</div>
        <div className="tutor-home-manage-links">
          {profileMenu.map((m) => (
            <button key={m.to} className="tutor-home-manage-link" onClick={() => navigate(m.to)}>
              <span className="tutor-home-manage-link-left">
                <span className="tutor-home-manage-icon" style={{ background: m.bg, color: m.color }}>
                  <i className={m.icon} aria-hidden="true" />
                </span>
                {m.title}
              </span>
              <i className="fas fa-chevron-right tutor-home-manage-arrow" aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
