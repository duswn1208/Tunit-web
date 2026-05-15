import {
  type CareerHistory,
  type CareerHistoryType,
  CAREER_HISTORY_TYPE_LABEL,
} from '../api/careerHistoryApi';
import './css/career-history.css';

interface Props {
  careerHistoryList?: CareerHistory[] | null;
}

const TYPE_ORDER: CareerHistoryType[] = ['EDUCATION', 'CERTIFICATION', 'CAREER', 'AWARD'];

function formatPeriod(start?: string | null, end?: string | null) {
  if (!start && !end) return null;
  const s = start?.slice(0, 7).replace('-', '.');
  const e = end?.slice(0, 7).replace('-', '.');
  if (s && e) return `${s} – ${e}`;
  if (s) return `${s} – 현재`;
  return e ?? null;
}

export default function TutorCareerHistorySection({ careerHistoryList }: Props) {
  if (!careerHistoryList || careerHistoryList.length === 0) {
    return null;
  }

  const grouped = TYPE_ORDER.map((type) => ({
    type,
    items: careerHistoryList
      .filter((c) => c.type === type)
      .sort((a, b) => a.displayOrder - b.displayOrder),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="info-card career-history-card">
      <h2 className="info-title">경력 · 자격</h2>
      <div className="career-history-groups">
        {grouped.map(({ type, items }) => (
          <section key={type} className="career-history-group">
            <h3 className="career-history-group-title">{CAREER_HISTORY_TYPE_LABEL[type]}</h3>
            <ul className="career-history-list">
              {items.map((item) => {
                const period = formatPeriod(item.startDate, item.endDate);
                return (
                  <li key={item.tutorCareerHistoryNo} className="career-history-item">
                    <div className="career-history-item-main">
                      <span className="career-history-item-title">{item.title}</span>
                      {item.subTitle && (
                        <span className="career-history-item-subtitle">{item.subTitle}</span>
                      )}
                    </div>
                    {period && <div className="career-history-item-period">{period}</div>}
                    {item.description && (
                      <p className="career-history-item-desc">{item.description}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
