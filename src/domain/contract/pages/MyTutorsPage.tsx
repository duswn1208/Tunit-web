import { useState } from 'react';
import Tab from '@/shared/components/Tab';
import '../css/my-tutors.css';

export default function MyTutorsPage() {
  const [activeTab, setActiveTab] = useState('연결된 튜터');
  const tabList = ['연결된 튜터', '종료된 튜터'];

  return (
    <div className="my-tutors-page">
      <div className="my-tutors-container">
        <h1>나의 튜터</h1>

        <Tab tabs={tabList} selected={activeTab} onSelect={setActiveTab} />

        <div className="tutors-list">
          {activeTab === '연결된 튜터' && (
            <div>
              {/* 연결된 튜터 목록 */}
              <p>연결된 튜터가 없습니다.</p>
            </div>
          )}

          {activeTab === '종료된 튜터' && (
            <div>
              {/* 종료된 튜터 목록 */}
              <p>종료된 튜터가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
