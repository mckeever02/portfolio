const items = [
  { label: "Status", value: "AI at 1Password" },
  { label: "Location", value: "Belfast, N.Ireland" },
];

export function StatusInfo() {
  return (
    <div className="flex flex-row lg:flex-col gap-8">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col gap-1 w-full">
          <span className="text-xs font-bold tracking-[1.2px] uppercase font-[var(--font-era)] text-[var(--foreground)]">
            {item.label}
          </span>
          <span className="text-base text-[var(--foreground)]">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
}
