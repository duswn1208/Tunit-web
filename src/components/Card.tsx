import clsx from 'clsx';
import React from 'react';

type Props = {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  as?: 'div' | 'form';
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
};

export default function Card({
  title,
  subtitle,
  footer,
  className,
  bodyClassName,
  as = 'div',
  onSubmit,
  children,
}: Props) {
  const Body: any = as;
  const hasHeader = title || subtitle;

  return (
    <div className={clsx('ui-card', className)}>
      {hasHeader && (
        <header className="ui-card-header">
          {title ? <h1 className="ui-card-title">{title}</h1> : null}
          {subtitle ? <p className="ui-card-sub">{subtitle}</p> : null}
        </header>
      )}
      <Body
        className={clsx('ui-card-body', bodyClassName)}
        {...(as === 'form' ? { onSubmit } : {})}
      >
        <div className="mls-card">
          {children}
          {footer ? (
            <footer>
              <div className="mls-footer">{footer}</div>
            </footer>
          ) : null}
        </div>
      </Body>
    </div>
  );
}
