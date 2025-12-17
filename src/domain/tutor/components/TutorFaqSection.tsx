import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import type { TutorFaq } from '../api/types';
import '../css/tutor-faq.css';

interface TutorFaqInfoProps {
  faqData?: TutorFaq[];
}

export default function TutorFaqSection({ faqData }: TutorFaqInfoProps) {
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());

  const toggleFaq = (tutorFaqNo: number) => {
    setOpenFaqs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tutorFaqNo)) {
        newSet.delete(tutorFaqNo);
      } else {
        newSet.add(tutorFaqNo);
      }
      return newSet;
    });
  };

  if (!faqData || faqData.length === 0) {
    return (
      <div className="info-card">
        <h2 className="info-title">자주 묻는 질문</h2>
        <div style={{ color: '#888', padding: 24 }}>등록된 FAQ가 없습니다.</div>
      </div>
    );
  }

  console.log('FAQ Data:', faqData);

  return (
    <div className="info-card">
      <h2 className="info-title">자주묻는질문을 모아놨어요</h2>
      <div className="faq-container">
        {faqData
          .filter((faq) => faq.exposed)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((faq) => (
            <div key={faq.tutorFaqNo} className="faq-item">
              <button className="faq-button" onClick={() => toggleFaq(faq.tutorFaqNo)}>
                <span className="faq-title">{faq.title}</span>
                <FontAwesomeIcon
                  icon={openFaqs.has(faq.tutorFaqNo) ? faChevronUp : faChevronDown}
                  className="faq-icon"
                />
              </button>
              {openFaqs.has(faq.tutorFaqNo) && <div className="faq-content">{faq.content}</div>}
            </div>
          ))}
      </div>
    </div>
  );
}
