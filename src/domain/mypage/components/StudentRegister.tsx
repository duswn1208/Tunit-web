import { useState } from 'react';
import { HiUserAdd } from 'react-icons/hi';
import Tab from '@/shared/components/Tab';
import ExcelUploader from './ExcelUploader';
import StudentRegisterForm from './StudentRegisterForm';
import './StudentRegister.css';
import '@/shared/css/components/tab.css';

const TABS = ['엑셀 업로드', '직접 입력'] as const;
type TabLabel = (typeof TABS)[number];

export default function StudentRegister() {
  const [selectedTab, setSelectedTab] = useState<TabLabel>('엑셀 업로드');

  return (
    <div className="student-register-container">
      <div className="student-register-header">
        <div className="student-register-header-icon">
          <HiUserAdd />
        </div>
        <h3 className="student-register-header-title">학생 등록</h3>
      </div>
      <Tab tabs={[...TABS]} selected={selectedTab} onSelect={(tab) => setSelectedTab(tab as TabLabel)} />
      {selectedTab === '엑셀 업로드' && <ExcelUploader />}
      {selectedTab === '직접 입력' && <StudentRegisterForm />}
    </div>
  );
}
