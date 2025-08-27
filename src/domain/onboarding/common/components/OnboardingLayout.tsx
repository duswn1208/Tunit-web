import React from 'react';
import { Card } from '../../../../components';

import '../../../../css/multi-level-selector/mls-base.css';
import '../../../../css/multi-level-selector/mls-container.css';
import '../../../../css/multi-level-selector/mls-list.css';
import '../../../../css/ui/ui-button.css';
import '../../../../css/ui/ui-tokens.css';
import '../../../../css/ui/ui-card.css';
import '../../../../css/ui/ui-form.css';
import '../../../../css/ui/ui-input.css';
import '../../../../css/ui/ui-button.css';

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
  const fullTitle = title ?? (step && total ? `온보딩 (${step}/${total})` : undefined);
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
