import React from 'react';
import clsx from 'clsx';

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** 폼으로 쓰고 싶으면 as="form" + onSubmit 전달 */
  as?: 'div' | 'form';
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
};

export default function OnboardingCard({
  title,
  subtitle,
  children,
  footer,
  className,
  as = 'div',
  onSubmit,
}: Props) {
  const Wrapper: any = as;
  const headerEmpty = !title && !subtitle;

  return (
    <div className={clsx('ui-card', className)}>
      {!headerEmpty && (
        <header className="ui-card-header">
          {title ? <h1 className="ui-card-title">{title}</h1> : null}
          {subtitle ? <p className="ui-card-sub">{subtitle}</p> : null}
        </header>
      )}

      <Wrapper
        className={clsx('ui-card-body ui-form-body')}
        {...(as === 'form' ? { onSubmit } : {})}
      >
        {children}
        {footer ? <footer className="ui-card-footer">{footer}</footer> : null}
      </Wrapper>
    </div>
  );
}
