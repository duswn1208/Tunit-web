import { BsPersonCheck, BsCalendarCheck, BsShieldCheck, BsGrid } from 'react-icons/bs';

export default function HomeFeatures() {
  const features = [
    {
      icon: <BsPersonCheck className="feature-icon" />,
      title: '나만을 위한 맞춤 레슨',
      description: (
        <>
          원하는 지역, 시간, 과목으로 나한테 딱 맞는 튜터를 찾아보세요.
          <br />단 3초면 나만의 1:1 레슨이 시작돼요.
        </>
      ),
    },
    {
      icon: <BsShieldCheck className="feature-icon" />,
      title: '믿을 수 있는 튜터 프로필',
      description: (
        <>
          이젠 '괜찮은 튜터일까?' 고민 끝.
          <br />
          실력·후기·커리큘럼까지, 한눈에 확인해요.
        </>
      ),
    },
    {
      icon: <BsCalendarCheck className="feature-icon" />,
      title: '간편한 스케줄 관리 & 결제',
      description: (
        <>
          카톡 조율은 그만!
          <br />
          스케줄 확인부터 예약·결제까지 한 번에 해결하세요.
        </>
      ),
    },
    {
      icon: <BsGrid className="feature-icon" />,
      title: '다양한 분야의 레슨',
      description: (
        <>
          피아노,PT부터 웹개발, 취미까지
          <br />
          배우고 싶은 건 다, 튜닛에 있어요.
        </>
      ),
    },
  ];

  return (
    <section className="features-section">
      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-item">
            {feature.icon}
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
