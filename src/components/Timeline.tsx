import Image from "next/image";

interface TimelineItem {
  company: string;
  role: string;
  period: string;
  icon: string;
}

const timelineItems: TimelineItem[] = [
  {
    company: "1Password",
    role: "Senior Product Designer",
    period: "2020 - Present",
    icon: "/images/timeline/1password.svg",
  },
  {
    company: "Sweepr",
    role: "Senior Product Designer",
    period: "2018 - 2020",
    icon: "/images/timeline/sweepr.svg",
  },
  {
    company: "Adoreboard",
    role: "Product Designer",
    period: "2017 - 2019",
    icon: "/images/timeline/adoreboard.svg",
  },
  {
    company: "Rotor Videos",
    role: "Frontend Developer",
    period: "2016 - 2017",
    icon: "/images/timeline/rotor.svg",
  },
  {
    company: "Little Thunder Co.",
    role: "Designer",
    period: "2014 - 2015",
    icon: "/images/timeline/littlethunder.svg",
  },
];

export function Timeline() {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-base font-bold tracking-[1.6px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
        Timeline
      </h3>

      <div className="flex flex-col gap-0">
        {timelineItems.map((item, index) => (
          <div key={item.company} className="flex gap-4">
            {/* Icon Column */}
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div className="w-8 h-8 rounded border border-[var(--border-darker)] overflow-hidden bg-[#070e0c] flex-shrink-0">
                <Image
                  src={item.icon}
                  alt={item.company}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Divider (not on last item) */}
              {index < timelineItems.length - 1 && (
                <div className="w-[2px] flex-1 min-h-[24px] bg-[rgba(33,32,28,0.2)] rounded-sm" />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 pb-8">
              <div className="flex flex-col gap-1">
                <h4 className="text-lg font-bold text-[var(--foreground)]">
                  {item.company}
                </h4>
                <p className="text-base text-[var(--foreground)]">
                  {item.role}
                </p>
              </div>
              <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
                {item.period}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
