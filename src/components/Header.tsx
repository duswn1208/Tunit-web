interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="mls-header">
      <h2 className="text-xl" style={{ fontWeight: 700 }}>
        {title}
      </h2>
      {subtitle && <div className="mls-sub">{subtitle}</div>}
    </div>
  );
}
