import '../css/home.css';

const steps = [
  {
    step: '01',
    icon: 'fas fa-magnifying-glass',
    title: '튜터 검색',
    description: '지역, 과목, 시간대를 선택해\n나에게 딱 맞는 튜터를 찾아요.',
  },
  {
    step: '02',
    icon: 'fas fa-calendar-check',
    title: '일정 확인 & 예약',
    description: '튜터의 실시간 스케줄을 확인하고\n원하는 시간에 바로 예약해요.',
  },
  {
    step: '03',
    icon: 'fas fa-credit-card',
    title: '간편 결제 & 시작',
    description: '안전하게 결제하고\n레슨을 바로 시작해요.',
  },
];

export default function HomeHowItWorks() {
  return (
    <section className="how-it-works-section">
      <h2 className="section-title">이렇게 시작해요</h2>
      <div className="how-it-works-steps">
        {steps.map((s, i) => (
          <div key={s.step} className="how-step">
            <div className="how-step-number">{s.step}</div>
            <div className="how-step-icon"><i className={s.icon} aria-hidden="true"></i></div>
            <h3 className="how-step-title">{s.title}</h3>
            <p className="how-step-desc">{s.description}</p>
            {i < steps.length - 1 && <div className="how-step-arrow"><i className="fas fa-arrow-right" aria-hidden="true"></i></div>}
          </div>
        ))}
      </div>
    </section>
  );
}
