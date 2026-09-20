const STYLES = {
  new: 'bg-amber-50 text-amber-800',
  read: 'bg-sky-50 text-sky-800',
  responded: 'bg-emerald-50 text-emerald-800',
  active: 'bg-emerald-50 text-emerald-800',
  inactive: 'bg-stone-100 text-stone-600',
} as const;

export default function StatusBadge({
  status,
}: {
  status: keyof typeof STYLES | string;
}) {
  const style = STYLES[status as keyof typeof STYLES] ?? STYLES.inactive;
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium capitalize ${style}`}>
      {status}
    </span>
  );
}
