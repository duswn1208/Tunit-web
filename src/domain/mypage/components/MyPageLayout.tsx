import React from 'react';
import { Card } from '../../../shared/components';

type Props = {
  children: React.ReactNode;
};

export default function MyPageLayout({ children }: Props) {
  return (
    <Card title="마이페이지" bodyClassName="space-y-8">
      {children}
    </Card>
  );
}
