import Button from '@/shared/components/Button';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale/ko';
import type { ProposalTimeInfo } from '../types/contract';

interface TutorProposalCardProps {
  proposal: ProposalTimeInfo;
  onAccept: (proposalId: number) => void;
}

export default function TutorProposalCard({ proposal, onAccept }: TutorProposalCardProps) {
  const formatDisplayDate = (dateStr: string, timeStr: string) => {
    try {
      const dateObj = new Date(dateStr + 'T' + timeStr);
      return format(dateObj, 'M월 d일 (E) HH:mm', { locale: ko });
    } catch {
      return `${dateStr} ${timeStr}`;
    }
  };

  return (
    <div
      style={{
        padding: 16,
        backgroundColor: '#fff3e0',
        borderRadius: 8,
        border: '1px solid #ffb74d',
        marginBottom: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
            {formatDisplayDate(proposal.proposedDate, proposal.proposedStartTime)}
          </div>
          <div style={{ fontSize: 13, color: '#666' }}>튜터가 제안한 시간입니다</div>
        </div>
        <Button
          className="ui-btn--primary"
          size="sm"
          onClick={() => onAccept(proposal.id)}
        >
          수락
        </Button>
      </div>
    </div>
  );
}
