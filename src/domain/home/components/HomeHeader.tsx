export default function HomeHeader() {
  return (
    <div className="home-header">
      <div className="hero-section">
        <h1 className="main-title">
          내 주변 튜터와 1:1 레슨,
          <br />
          지금 바로 시작하세요!
        </h1>
        <p className="sub-title">
          {`아직도 카톡으로 일정 조율하나요? 🤯\n\n튜닛에서는 복잡한 대화 없이 실시간으로 스케줄 확인하고, 결제까지 단 한 번에!\n검증된 튜터와 함께 당신에게 딱 맞는 레슨을 시작해보세요. 🎯`}
        </p>
        <div className="hero-image">
          <img
            src="/images/main_kakaotalk.PNG"
            alt="카카오톡으로 레슨 일정 조율하는 모습"
            className="hero-illustration"
          />
        </div>
      </div>
    </div>
  );
}
