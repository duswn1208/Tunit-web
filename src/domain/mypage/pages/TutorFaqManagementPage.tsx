import { useEffect, useState } from 'react';
import TutorFaqItem from '@/domain/tutor/components/TutorFaqItem';
import { api } from '@/shared/lib/api';
import type { TutorFaq } from '@/domain/tutor/api/types';
import FaqRegisterModal from '@/domain/mypage/components/FaqRegisterModal';
import Button from '@/shared/components/Button';
import Header from '@/shared/components/Header';
import './TutorFaqManagementPage.css';
import { useToast } from '@/shared/contexts/ToastContext';

export default function TutorFaqManagementPage() {
  const { showToast } = useToast();
  const [faqOpen, setFaqOpen] = useState(false);
  const [faqData, setFaqData] = useState<TutorFaq[]>([]);
  const [openFaqs, setOpenFaqs] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selectedFaq, setSelectedFaq] = useState<TutorFaq | null>(null);

  console.log('TutorFaqManagementPage faqData:', faqData);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await api.get('/api/tutors/me/faqs');
        setFaqData(res);
      } catch (err: any) {
        setError(err?.message || 'FAQ 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (faqNo: number) => {
    setOpenFaqs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(faqNo)) {
        newSet.delete(faqNo);
      } else {
        newSet.add(faqNo);
      }
      return newSet;
    });
  };

  const handleOpenModal = (type: 'create' | 'edit', faq?: TutorFaq) => {
    setModalType(type);
    setSelectedFaq(faq || null);
    setModalOpen(true);
  };

  const handleSave = async (data: { title: string; content: string; exposed: boolean }) => {
    try {
      const res = await api.post('/api/tutors/me/faqs', data);
      setFaqData((prev) => [...prev, res]);
      setModalOpen(false);
    } catch (err: any) {
      alert(err?.message || 'FAQ 저장에 실패했습니다.');
    }
  };

  const handleEdit = async (data: { title: string; content: string; exposed: boolean }) => {
    try {
      if (selectedFaq) {
        await api.put(`/api/tutors/me/faqs/${selectedFaq.tutorFaqNo}`, data);
        setFaqData((prev) =>
          prev.map((faq) => (faq.tutorFaqNo === selectedFaq.tutorFaqNo ? { ...faq, ...data } : faq))
        );
      }
      setModalOpen(false);
    } catch (err: any) {
      alert(err?.message || 'FAQ 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (faq: TutorFaq) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await api.delete(`/api/tutors/me/faqs/${faq.tutorFaqNo}`);
      setFaqData((prev) => prev.filter((f) => f.tutorFaqNo !== faq.tutorFaqNo));
      showToast('FAQ가 성공적으로 삭제되었습니다.', 'success');
    } catch (err: any) {
      showToast(err?.message || 'FAQ 삭제에 실패했습니다.', 'error');
    }
  };

  if (loading) return <div>FAQ 데이터를 불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="info-card">
      <div className="header-row">
        <Header title="자주묻는질문 관리" />
        <div className="button-group">
          <Button className="add-faq-button" onClick={() => handleOpenModal('create')}>
            FAQ 추가
          </Button>
        </div>
      </div>
      <div className="faq-container">
        {faqData
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map((faq) => (
            <TutorFaqItem
              key={faq.tutorFaqNo}
              faq={faq}
              open={openFaqs.has(faq.tutorFaqNo)}
              onToggle={toggleFaq}
              editable={true}
              onEdit={() => handleOpenModal('edit', faq)}
              onDelete={handleDelete}
            />
          ))}
      </div>
      {modalOpen && (
        <FaqRegisterModal
          openType={modalType}
          faqData={selectedFaq || undefined}
          onSave={modalType === 'create' ? handleSave : handleEdit}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
