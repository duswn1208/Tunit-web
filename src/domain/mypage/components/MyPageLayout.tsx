import React from 'react';
import { Card } from '../../../shared/components';

type Props = {
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  as?: 'div' | 'form';
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  bodyClassName?: string;
};

export default function OnboardingLayout({
  subtitle,
  children,
  footer,
  as = 'div',
  bodyClassName,
  onSubmit,
}: Props) {
  return (
    <Card
      title={'마이페이지'}
      subtitle={subtitle}
      as={as}
      onSubmit={onSubmit}
      bodyClassName={bodyClassName}
    >
      {children}
      {footer}
    </Card>
  );
}
