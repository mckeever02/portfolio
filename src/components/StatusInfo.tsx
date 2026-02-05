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
                rotation: -6,
                className: "shadow-sm border-4 border-white",
              },
              {
                src: "/images/1password-app-icon.png",
                alt: "1Password app icon",
                width: 65,
                height: 65,
                offset: { x: -15, y: -40 },
                rotation: 8,
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
          <HoverImageText
            images={[
              {
                src: "/images/belfast-1.jpg",
                alt: "Belfast cityscape",
                width: 160,
                height: 107,
                offset: { x: -90, y: -60 },
                rotation: -8,
                className: "shadow-2xl border-4 border-white",
                cycleSrcs: [
                  "/images/belfast-3.jpg",
                  "/images/belfast-5.jpg",
                  "/images/belfast-7.jpg",
                  "/images/belfast-9.jpg",
                ],
                cycleInterval: 1800,
              },
              {
                src: "/images/belfast-2.jpg",
                alt: "Belfast scenery",
                width: 160,
                height: 107,
                offset: { x: 50, y: -50 },
                rotation: 6,
                className: "shadow-2xl border-4 border-white",
                cycleSrcs: [
                  "/images/belfast-4.jpg",
                  "/images/belfast-6.jpg",
                  "/images/belfast-8.jpg",
                  "/images/belfast-10.jpg",
                ],
                cycleInterval: 1800,
              },
            ]}
          >
            Belfast, N.Ireland
          </HoverImageText>
        </span>
      </div>
    </div>
  );
}
