import React from 'react';
import Card from '@/shared/components/Card';

type Props = {
  step?: number;
  total?: number;
  title?: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  as?: 'div' | 'form';
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  bodyClassName?: string;
};

export default function OnboardingLayout({
  step,
  total,
  title,
  subtitle,
  children,
  footer,
  as = 'div',
  bodyClassName,
  onSubmit,
}: Props) {
  const fullTitle = title ?? (step && total ? `프로필 설정 (${step}/${total})` : undefined);
  return (
    <Card
      title={fullTitle}
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
