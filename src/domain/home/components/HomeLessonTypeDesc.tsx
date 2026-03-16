import '../css/home.css';

export default function HomeLessonTypeDesc() {
  return (
    <section className="home-lesson-type-desc-section">
      <div className="home-lesson-type-desc-container">
        <div className="home-lesson-type-desc-item">
          <div className="home-lesson-type-desc-icon">🕒</div>
          <div className="home-lesson-type-desc-title">선착순 레슨</div>
          <div className="home-lesson-type-desc-subtitle">원하는 일정을 자유롭게</div>
          <div className="home-lesson-type-desc-desc">
            튜터가 등록한 일정 중 원하는 시간에 바로 신청할 수 있어요.
            <br />
            일정이 자주 바뀌거나, 원하는 시간에만 수업을 듣고 싶은 학생에게 추천해요.
          </div>
        </div>
        {/* 구분선 */}
        <div className="home-lesson-type-desc-divider"></div>
        <div className="home-lesson-type-desc-item home-lesson-type-desc-item--right">
          <div className="home-lesson-type-desc-icon">📅</div>
          <div className="home-lesson-type-desc-title">정기 레슨</div>
          <div className="home-lesson-type-desc-subtitle">매주 같은 요일, 같은 시간에</div>
          <div className="home-lesson-type-desc-desc">
            매주 정해진 요일과 시간에 자동으로 수업이 예약되어, 매번 직접 예약하지 않아도 돼요.
            <br />
            꾸준한 학습 루틴을 만들고 싶은 학생에게 추천해요.
            <br />
            일정 변경과 취소도 가능해요.
          </div>
        </div>
      </div>
    </section>
  );
}
