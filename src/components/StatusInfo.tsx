export function StatusInfo() {
  return (
    <div className="flex flex-col gap-8">
      {/* Status */}
      <div className="flex flex-col gap-1 w-[384px]">
        <span className="text-xs font-bold tracking-[1.2px] uppercase font-[var(--font-era)] text-[var(--foreground)]">
          Status
        </span>
        <a
          href="https://1password.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-base text-[var(--foreground)] hover:opacity-80 transition-opacity"
        >
          AI at 1Password
        </a>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1 w-[384px]">
        <span className="text-xs font-bold tracking-[1.2px] uppercase font-[var(--font-era)] text-[var(--foreground)]">
          Location
        </span>
        <a
          href="https://maps.google.com/?q=Belfast,Northern+Ireland"
          target="_blank"
          rel="noopener noreferrer"
          className="text-base text-[var(--foreground)] hover:opacity-80 transition-opacity"
        >
          Belfast, N.Ireland
        </a>
      </div>
    </div>
  );
}
