import { useCallback, useEffect, useState } from 'react';
import Header from '@/shared/components/Header';
import Button from '@/shared/components/Button';
import { useToast } from '@/shared/contexts/ToastContext';
import { useAlert } from '@/shared/contexts/AlertContext';
import { useProfileData } from '../hooks/useProfileData';
import {
  CAREER_HISTORY_TYPE_LABEL,
  addCareerHistory,
  deleteCareerHistory,
  fetchCareerHistory,
  replaceAllCareerHistory,
  type CareerHistory,
  type CareerHistorySaveDto,
  type CareerHistoryType,
} from '@/domain/tutor/api/careerHistoryApi';
import CareerHistoryRegisterModal from '../components/CareerHistoryRegisterModal';
import './TutorCareerHistoryManagementPage.css';

const TYPE_ORDER: CareerHistoryType[] = ['EDUCATION', 'CERTIFICATION', 'CAREER', 'AWARD'];

function formatPeriod(start?: string | null, end?: string | null) {
  if (!start && !end) return '-';
  const s = start?.slice(0, 7).replace('-', '.');
  const e = end?.slice(0, 7).replace('-', '.');
  if (s && e) return `${s} – ${e}`;
  if (s) return `${s} – 현재`;
  return e ?? '-';
}

export default function TutorCareerHistoryManagementPage() {
  const { profileData } = useProfileData();
  const { showToast } = useToast();
  const { showAlert } = useAlert();
  const tutorProfileNo: number | undefined = profileData?.tutorProfile?.tutorProfileNo;

  const [list, setList] = useState<CareerHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [selected, setSelected] = useState<CareerHistory | null>(null);

  const reload = useCallback(async () => {
    if (!tutorProfileNo) return;
    try {
      const data = await fetchCareerHistory(Number(tutorProfileNo));
      setList(data);
    } catch (err: any) {
      showAlert({
        title: '불러오기 실패',
        message: err?.message || '경력 정보를 불러오지 못했습니다.',
      });
    } finally {
      setLoading(false);
    }
  }, [tutorProfileNo, showAlert]);

  useEffect(() => {
    reload();
  }, [reload]);

  const handleAdd = () => {
    setSelected(null);
    setModalType('create');
    setModalOpen(true);
  };

  const handleEdit = (item: CareerHistory) => {
    setSelected(item);
    setModalType('edit');
    setModalOpen(true);
  };

  const handleSave = async (dto: CareerHistorySaveDto) => {
    try {
      if (modalType === 'create') {
        await addCareerHistory({ ...dto, displayOrder: list.length });
        showToast('경력이 추가되었습니다.', 'success');
      } else if (selected) {
        // 수정은 단건 endpoint가 없어 전체 교체로 처리
        const next = list.map((item) =>
          item.tutorCareerHistoryNo === selected.tutorCareerHistoryNo
            ? { ...item, ...dto, displayOrder: item.displayOrder }
            : item,
        );
        await replaceAllCareerHistory(
          next.map((item) => ({
            type: item.type,
            title: item.title,
            subTitle: item.subTitle,
            startDate: item.startDate,
            endDate: item.endDate,
            description: item.description,
            displayOrder: item.displayOrder,
          })),
        );
        showToast('경력이 수정되었습니다.', 'success');
      }
      setModalOpen(false);
      await reload();
    } catch (err: any) {
      showAlert({
        title: '저장 실패',
        message: err?.message || '경력 저장에 실패했습니다.',
      });
    }
  };

  const handleDelete = async (item: CareerHistory) => {
    if (!window.confirm(`${item.title} 항목을 삭제하시겠어요?`)) return;
    try {
      await deleteCareerHistory(item.tutorCareerHistoryNo);
      showToast('삭제되었습니다.', 'success');
      await reload();
    } catch (err: any) {
      showAlert({
        title: '삭제 실패',
        message: err?.message || '경력 삭제에 실패했습니다.',
      });
    }
  };

  const groups = TYPE_ORDER.map((type) => ({
    type,
    items: list.filter((c) => c.type === type).sort((a, b) => a.displayOrder - b.displayOrder),
  }));

  return (
    <div className="career-mgmt-page">
      <div className="career-mgmt-header">
        <Header title="경력 · 자격 관리" />
        <Button className="ui-btn--primary" onClick={handleAdd}>
          경력 추가
        </Button>
      </div>

      {loading ? (
        <div className="career-mgmt-empty">불러오는 중...</div>
      ) : list.length === 0 ? (
        <div className="career-mgmt-empty">
          등록된 경력이 없습니다. 학력 · 자격증 · 수상이력 · 재직경험을 추가해보세요.
        </div>
      ) : (
        <div className="career-mgmt-groups">
          {groups.map(({ type, items }) =>
            items.length === 0 ? null : (
              <section key={type} className="career-mgmt-group">
                <h3 className="career-mgmt-group-title">{CAREER_HISTORY_TYPE_LABEL[type]}</h3>
                <ul className="career-mgmt-list">
                  {items.map((item) => (
                    <li key={item.tutorCareerHistoryNo} className="career-mgmt-row">
                      <div className="career-mgmt-row-info">
                        <div className="career-mgmt-row-main">
                          <span className="career-mgmt-row-title">{item.title}</span>
                          {item.subTitle && (
                            <span className="career-mgmt-row-subtitle">{item.subTitle}</span>
                          )}
                        </div>
                        <div className="career-mgmt-row-period">
                          {formatPeriod(item.startDate, item.endDate)}
                        </div>
                        {item.description && (
                          <p className="career-mgmt-row-desc">{item.description}</p>
                        )}
                      </div>
                      <div className="career-mgmt-row-actions">
                        <button
                          type="button"
                          className="career-mgmt-action-btn"
                          onClick={() => handleEdit(item)}
                        >
                          수정
                        </button>
                        <button
                          type="button"
                          className="career-mgmt-action-btn career-mgmt-action-btn--danger"
                          onClick={() => handleDelete(item)}
                        >
                          삭제
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ),
          )}
        </div>
      )}

      {modalOpen && (
        <CareerHistoryRegisterModal
          openType={modalType}
          initial={selected}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
