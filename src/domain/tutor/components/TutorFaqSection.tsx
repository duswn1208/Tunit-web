import { useState } from 'react';
import type { TutorFaq } from '../api/types';
import '../css/tutor-faq.css';
import TutorFaqItem from './TutorFaqItem';

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
        <div className="card-state">등록된 FAQ가 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="info-card">
      <h2 className="info-title">자주 묻는 질문</h2>
      <div className="faq-container">
        {faqData
          .filter((faq) => faq.exposed)
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((faq) => (
            <TutorFaqItem
              key={faq.tutorFaqNo}
              faq={faq}
              open={openFaqs.has(faq.tutorFaqNo)}
              onToggle={toggleFaq}
            />
          ))}
      </div>
    </div>
  );
}
