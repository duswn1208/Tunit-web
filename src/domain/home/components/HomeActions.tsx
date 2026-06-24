import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/shared/auth/AuthContext';
import '../css/home.css';

export default function HomeActions() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTutorSearch = () => {
    navigate('/find/lessons');
  };

  const handleTutorRegistration = () => {
    if (!user) {
      navigate('/auth/login', { state: { from: '/onboarding' } });
    } else {
      navigate('/mypage');
    }
  };

  return (
    <div className="cta-buttons">
      <button className="cta-button cta-button--primary" onClick={handleTutorSearch}>
        내게 맞는 튜터 찾아보기
      </button>
      <button className="cta-button-text-link" onClick={handleTutorRegistration}>
        튜터로 등록하기 <i className="fas fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>
  );
}
