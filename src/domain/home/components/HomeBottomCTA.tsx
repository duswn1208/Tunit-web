import { useNavigate } from 'react-router-dom';
import '../css/home.css'
export default function HomeBottomCTA() {
  const navigate = useNavigate();

  return (
    <section className="bottom-cta-section">
      <h2 className="bottom-cta-title">지금 바로 나만의 레슨을 시작해보세요</h2>
      <p className="bottom-cta-sub">복잡한 일정 조율 없이, 튜닛 하나로 간단하게.</p>
      <button className="cta-button cta-button--primary bottom-cta-btn" onClick={() => navigate('/find/lessons')}>
        내게 맞는 튜터 찾아보기
      </button>
    </section>
  );
}
