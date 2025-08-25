import React from 'react';
import { Button } from '../ui';

export default function NextButton({
  label = '다음 →',
  loading,
  disabled,
  type = 'button',
  addClass,
  onClick,
}: {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit';
  addClass?: string;
  onClick?: any;
}) {
  return (
    <Button className={addClass} type={type} loading={loading} disabled={disabled}>
      {label}
    </Button>
  );
}
