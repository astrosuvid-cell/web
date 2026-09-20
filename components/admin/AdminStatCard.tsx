import type { LucideIcon } from 'lucide-react';

interface AdminStatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  trend?: string;
}

export default function AdminStatCard({ label, value, hint, icon: Icon, trend }: AdminStatCardProps) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-stone-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-stone-900">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-stone-500">{hint}</p>}
          {trend && <p className="mt-2 text-xs font-medium text-emerald-700">{trend}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-stone-100 text-stone-600">
          <Icon size={18} strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
