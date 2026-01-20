import Image from "next/image";
import Link from "next/link";

interface TimelineItem {
  company: string;
  role: string;
  period: string;
  icon: string;
  url: string;
}

const timelineItems: TimelineItem[] = [
  {
    company: "1Password",
    role: "Senior Product Designer",
    period: "2020—Present",
    icon: "/images/1password.png",
    url: "https://1password.com",
  },
  {
    company: "Sweepr",
    role: "Senior Product Designer",
    period: "2018—2020",
    icon: "/images/sweepr.png",
    url: "https://sweepr.com",
  },
  {
    company: "Adoreboard",
    role: "Product Designer",
    period: "2017—2019",
    icon: "/images/adoreboard.png",
    url: "https://adoreboard.com",
  },
  {
    company: "Rotor Videos",
    role: "Frontend Developer",
    period: "2016—2017",
    icon: "/images/rotor.png",
    url: "https://rotorvideos.com",
  },
  {
    company: "Little Thunder Co.",
    role: "Designer",
    period: "2014—2015",
    icon: "/images/little-thunder-co.png",
    url: "https://littlethunder.co",
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
          <div key={item.company} className="flex gap-4 group">
            {/* Icon Column */}
            <div className="flex flex-col items-center">
              {/* Icon */}
              <div className="w-8 h-8 my-1 rounded border border-[var(--border-darker)] overflow-hidden bg-[var(--card-background)] flex-shrink-0 icon-tilt">
                <Image
                  src={item.icon}
                  alt={`${item.company} logo`}
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Divider (not on last item) */}
              {index < timelineItems.length - 1 && (
                <div className="w-[2px] flex-1 min-h-[24px] bg-[var(--nav-track)] rounded-sm" />
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 pb-8 mt-1">
              <div className="flex flex-col gap-1">
                <Link 
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg font-bold text-[var(--foreground)] wavy-link"
                >
                  {item.company}
                </Link>
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
