import { useState } from 'react';
import '../css/home.css';

const faqs = [
  {
    q: '정기 레슨과 선착순 레슨의 차이는 뭔가요?',
    a: '정기 레슨은 매주 정해진 요일·시간에 자동 예약되는 방식이에요. 선착순 레슨은 튜터가 등록한 빈 일정 중 원하는 시간을 골라 그때그때 예약하는 방식이에요.',
  },
  {
    q: '비로그인으로도 예약할 수 있나요?',
    a: '상담/체험 레슨은 비로그인으로도 예약 가능해요. 단, 정기 레슨·선착순 레슨 예약과 결제는 로그인이 필요해요.',
  },
  {
    q: '결제는 어떻게 하나요?',
    a: '레슨 예약 시 카드 결제로 안전하게 진행돼요. 결제 정보는 암호화되어 보호되며, 튜터에게는 레슨 완료 후 정산돼요.',
  },
  {
    q: '예약 취소 및 환불이 가능한가요?',
    a: '레슨 시작 전까지 취소 및 환불 신청이 가능해요. 취소 시점에 따라 환불 정책이 다를 수 있으니 예약 시 안내 사항을 확인해 주세요.',
  },
  {
    q: '튜터로 등록하려면 어떻게 하나요?',
    a: '상단의 "튜터로 등록하기"를 클릭해 회원가입 후 튜터 온보딩을 완료하면 바로 활동할 수 있어요. 별도 심사 없이 누구나 등록 가능해요.',
  },
];

export default function HomeFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section className="faq-section">
      <h2 className="section-title">자주 묻는 질문</h2>
      <div className="faq-list">
        {faqs.map((faq, i) => (
          <div key={i} className={`faq-item${openIndex === i ? ' faq-item--open' : ''}`}>
            <button className="faq-question" onClick={() => toggle(i)}>
              <span>{faq.q}</span>
              <span className="faq-chevron"><i className={openIndex === i ? 'fas fa-chevron-up' : 'fas fa-chevron-down'} aria-hidden="true"></i></span>
            </button>
            {openIndex === i && <div className="faq-answer">{faq.a}</div>}
          </div>
        ))}
      </div>
    </section>
  );
}
