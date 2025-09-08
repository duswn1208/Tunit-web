interface HeaderProps {
  title: string;
  subtitle?: string;
  addClass?: string;
}

export default function Header({ title, subtitle, addClass }: HeaderProps) {
  return (
    <div className={`mls-header ${addClass}`}>
      <h2 className="text-xl" style={{ fontWeight: 700 }}>
        {title}
      </h2>
      {subtitle && <div className="mls-sub">{subtitle}</div>}
    </div>
  );
}
