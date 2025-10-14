export interface SelectBoxOption {
  value: string;
  label: string;
}

interface SelectBoxProps {
  id?: string;
  name?: string;
  value: string;
  options: SelectBoxOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function SelectBox({
  id,
  name,
  value,
  options,
  onChange,
  placeholder = '선택',
  disabled = false,
  className = '',
}: SelectBoxProps) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={className}
      style={{ minWidth: 120 }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
