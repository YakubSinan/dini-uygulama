import type { LucideIcon } from "lucide-react";

export function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section className={`rounded-3xl border border-line bg-surface p-5 ${className}`}>{children}</section>;
}

export function CardTitle({
  icon: Icon,
  children,
  action,
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.12em] text-muted">
        {Icon && <Icon size={16} strokeWidth={1.75} className="text-gold" />}
        {children}
      </h2>
      {action}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
  className = "",
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={`flex rounded-full border border-line bg-surface-2 p-1 ${className}`} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
            value === o.value ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
