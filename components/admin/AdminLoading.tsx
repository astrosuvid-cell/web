export default function AdminLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f4ef]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-stone-800" />
        <p className="text-sm text-stone-500">{label}</p>
      </div>
    </div>
  );
}
