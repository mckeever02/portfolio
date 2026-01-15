export function StatusInfo() {
  return (
    <div className="flex flex-col gap-8">
      {/* Status */}
      <div className="flex flex-col gap-1 w-[384px]">
        <span className="text-xs font-bold tracking-[1.2px] uppercase font-[var(--font-era)] text-[var(--foreground)]">
          Status
        </span>
        <span className="text-base text-[var(--foreground)]">
          AI at 1Password
        </span>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1 w-[384px]">
        <span className="text-xs font-bold tracking-[1.2px] uppercase font-[var(--font-era)] text-[var(--foreground)]">
          Location
        </span>
        <span className="text-base text-[var(--foreground)]">
          Belfast, N.Ireland
        </span>
      </div>
    </div>
  );
}
