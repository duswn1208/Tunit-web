import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
import type { TutorFaq } from '../api/types';
import '../css/tutor-faq.css';
import { Button } from '@/shared/components';

interface TutorFaqItemProps {
  faq: TutorFaq;
  open: boolean;
  onToggle: (no: number) => void;
  editable?: boolean;
  onEdit?: (faq: TutorFaq) => void;
  onDelete?: (faq: TutorFaq) => void;
}

export default function TutorFaqItem({
  faq,
  open,
  onToggle,
  editable = false,
  onEdit,
  onDelete,
}: TutorFaqItemProps) {
  return (
    <div>
      <div className="faq-item">
        <button className="faq-button" onClick={() => onToggle(faq.tutorFaqNo)}>
          <div className="faq-item-row">
            <span className="faq-title">{faq.title}</span>
          </div>
          <FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} className="faq-icon" />
        </button>
        {open && <div className="faq-content">{faq.content}</div>}
      </div>
      {editable && (
        <div className="faq-actions">
          <Button title="수정" onClick={() => onEdit && onEdit(faq)}>
            <FontAwesomeIcon icon={faPen} />
          </Button>
          <Button title="삭제" onClick={() => onDelete && onDelete(faq)}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      )}
    </div>
  );
}
