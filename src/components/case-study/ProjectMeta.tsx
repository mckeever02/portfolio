import { ReactNode } from "react";
import { TeamAvatars } from "./TeamAvatars";

interface TeamMember {
  name: string;
  avatar: string;
}

interface ProjectMetaProps {
  subtitle: string;
  timeline: string;
  role: string;
  team: TeamMember[];
}

function MetaItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex-1 flex flex-col gap-2 min-w-0">
      <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
        {label}
      </span>
      {children}
    </div>
  );
}

export function ProjectMeta({ subtitle, timeline, role, team }: ProjectMetaProps) {
  return (
    <div className="bg-[var(--card-background)] border border-[var(--border-darker)] flex flex-col gap-6 p-6">
      <h1 className="text-[22px] xs:text-[24px] sm:text-[32px] lg:text-[40px] leading-[1.4] xs:tracking-[-0.32px] text-[var(--foreground)]">
        {subtitle}
      </h1>

      <svg
        className="w-full h-2 text-[var(--foreground)]"
        viewBox="0 0 768 8"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0 4L8 7L16 4L24 7L32 4L40 7L48 4L56 7L64 4L72 7L80 4L88 7L96 4L104 7L112 4L120 7L128 4L136 7L144 4L152 7L160 4L168 7L176 4L184 7L192 4L200 7L208 4L216 7L224 4L232 7L240 4L248 7L256 4L264 7L272 4L280 7L288 4L296 7L304 4L312 7L320 4L328 7L336 4L344 7L352 4L360 7L368 4L376 7L384 4L392 7L400 4L408 7L416 4L424 7L432 4L440 7L448 4L456 7L464 4L472 7L480 4L488 7L496 4L504 7L512 4L520 7L528 4L536 7L544 4L552 7L560 4L568 7L576 4L584 7L592 4L600 7L608 4L616 7L624 4L632 7L640 4L648 7L656 4L664 7L672 4L680 7L688 4L696 7L704 4L712 7L720 4L728 7L736 4L744 7L752 4L760 7L768 4"
          stroke="currentColor"
          strokeOpacity="0.15"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      <div className="flex gap-8">
        {timeline && (
          <MetaItem label="Timeline">
            <span className="text-base text-[var(--foreground)]">{timeline}</span>
          </MetaItem>
        )}
        {team && team.length > 0 && (
          <MetaItem label="Team">
            <TeamAvatars team={team} />
          </MetaItem>
        )}
        {role && (
          <MetaItem label="Role">
            <span className="text-base text-[var(--foreground)]">{role}</span>
          </MetaItem>
        )}
      </div>
    </div>
  );
}
