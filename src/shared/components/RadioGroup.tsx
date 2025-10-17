import React from 'react';
import '@/shared/css/ui/ui-radio.css';

export type RadioOption = { label: React.ReactNode; value: string };

type Props = {
  name: string;
  options: RadioOption[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export default function RadioGroup({ name, options, defaultValue, onChange, className }: Props) {
  return (
    <div className={['ui-radio-group', className].filter(Boolean).join(' ')}>
      {options.map((opt) => (
        <label key={String(opt.value)} className="ui-radio">
          <input
            type="radio"
            name={name}
            value={opt.value}
            defaultChecked={opt.value === defaultValue}
            onChange={(e) => onChange?.(e.currentTarget.value)}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
