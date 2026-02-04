import { HoverImageText } from "./HoverImageText";

export function StatusInfo() {
  return (
    <div className="flex flex-row md:flex-col gap-8">
      {/* Status */}
      <div className="flex flex-col gap-1 w-full">
        <span className="text-xs font-bold tracking-[1.2px] uppercase font-[var(--font-era)] text-[var(--foreground)]">
          Status
        </span>
        <span className="text-base text-[var(--foreground)]">
          <HoverImageText
            images={[
              {
                src: "/images/1password-2.jpg",
                alt: "1Password booth at RSA Conference",
                width: 180,
                height: 107,
                offset: { x: 20, y: -60 },
                rotation: 5,
                className: "rounded-lg shadow-2xl border-4 border-white",
              },
              {
                src: "/images/1password-app-icon.png",
                alt: "1Password app icon",
                width: 65,
                height: 65,
                offset: { x: -15, y: -40 },
                rotation: -10,
                className: "rounded-2xl shadow-2xl",
              },
            ]}
          >
            AI at 1Password
          </HoverImageText>
        </span>
      </div>

      {/* Location */}
      <div className="flex flex-col gap-1 w-full">
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
