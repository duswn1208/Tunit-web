import React from 'react';
import clsx from 'clsx';

type Props = {
  label?: React.ReactNode;
  htmlFor?: string;
  hint?: React.ReactNode;
  error?: React.ReactNode; // string | ReactNode
  required?: boolean;
  className?: string;
  children: React.ReactNode; // <input/textarea/select> 등
  childrenClsx?: string; // children을 감싸는 className
};

export default function FormField({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
  childrenClsx,
}: Props) {
  return (
    <div className={clsx('ui-field', error && 'ui-has-error', className)}>
      {label && (
        <label className="ui-label" htmlFor={htmlFor}>
          {label} {required ? <span aria-hidden="true">*</span> : null}
        </label>
      )}
      <div className={(clsx('ui-input'), childrenClsx)}>{children}</div>
      {hint && !error ? <div className="ui-hint">{hint}</div> : null}
      {error ? <div className="ui-error">{error}</div> : null}
    </div>
  );
}
