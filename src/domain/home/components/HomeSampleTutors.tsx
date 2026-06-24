import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMapMarkerAlt, faStar } from '@fortawesome/free-solid-svg-icons';
import { fetchTutors } from '@/domain/search/api/tutorSearchApi';
import { getMainLessonCategory, getSubLessonCategory } from '@/domain/lesson/api/categoryApi';
import { categoryIcons } from '@/domain/lesson/lib/categoryIcons';
import type { TutorProfile } from '@/domain/tutor/api/types';
import type { Category } from '@/domain/onboarding/types/onboarding';
import '../css/home.css';

export default function HomeSampleTutors() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 메인 카테고리 로드
  useEffect(() => {
    getMainLessonCategory()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // 카테고리 선택 시 튜터 조회
  useEffect(() => {
    setLoading(true);

    const load = async () => {
      try {
        let lessonCodes: string[] | undefined;

        if (selectedCode) {
          const subs = await getSubLessonCategory(selectedCode);
          lessonCodes = subs.map((s) => s.code);
        }

        const list = await fetchTutors({ lessonCodes });
        setTutors(list.slice(0, 3));
      } catch {
        setTutors([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [selectedCode]);

  if (!loading && tutors.length === 0 && categories.length === 0) return null;

  return (
    <section className="sample-tutors-section">
      <h2 className="section-title">지금 활동 중인 튜터</h2>
      <p className="section-subtitle">튜닛에서 검증된 튜터들을 만나보세요.</p>

      {/* 카테고리 chip */}
      <div className="category-chips">
        <button
          className={`category-chip${selectedCode === null ? ' category-chip--active' : ''}`}
          onClick={() => setSelectedCode(null)}
        >
          전체
        </button>
        {categories.map((cat) => {
          const meta = categoryIcons[cat.code];
          return (
            <button
              key={cat.code}
              className={`category-chip${selectedCode === cat.code ? ' category-chip--active' : ''}`}
              onClick={() => setSelectedCode(cat.code)}
            >
              {meta?.icon && <span className="category-chip-icon">{meta.icon}</span>}
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 튜터 카드 */}
      {loading ? (
        <div className="sample-tutors-loading">튜터를 불러오는 중...</div>
      ) : tutors.length === 0 ? (
        <div className="sample-tutors-empty">해당 카테고리의 튜터가 아직 없어요.</div>
      ) : (
        <div className="sample-tutors-grid">
          {tutors.map((tutor) => (
            <div
              key={tutor.tutorProfileNo}
              className="sample-tutor-card"
              onClick={() => navigate(`/tutors/${tutor.tutorProfileNo}`)}
            >
              <div className="sample-tutor-header">
                {tutor.photoUrl ? (
                  <img src={tutor.photoUrl} alt={tutor.userInfo.nickname} className="sample-tutor-avatar" />
                ) : (
                  <div className="sample-tutor-avatar-placeholder">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                )}
                <div>
                  <div className="sample-tutor-name">{tutor.userInfo.nickname}</div>
                  <div className="sample-tutor-meta">
                    경력 {tutor.careerYears}년
                    {tutor.rating && <span> · <FontAwesomeIcon icon={faStar} style={{ color: 'var(--lesson-firstcome)' }} /> {tutor.rating}</span>}
                  </div>
                </div>
              </div>
              {tutor.introduce && (
                <p className="sample-tutor-introduce">{tutor.introduce}</p>
              )}
              <div className="sample-tutor-tags">
                {tutor.lessonSubcategoryList?.slice(0, 3).map((l) => (
                  <span key={l.tutorLessonNo} className="sample-tutor-tag sample-tutor-tag--lesson">
                    {l.lessonCategory.label}
                  </span>
                ))}
                {tutor.regionList?.slice(0, 2).map((r) => (
                  <span key={r.code} className="sample-tutor-tag sample-tutor-tag--region">
                    <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: 3 }} />
                    {r.label}
                  </span>
                ))}
              </div>
              <div className="sample-tutor-price">
                시간당 {tutor.pricePerHour.toLocaleString()}원
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="sample-tutors-more">
        <button className="cta-button cta-button--outline" onClick={() => navigate('/find/lessons')}>
          튜터 전체 보기 <i className="fas fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </section>
  );
}
