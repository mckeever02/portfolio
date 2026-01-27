"use client";

import { Card, CardDetailSeparator, CardDetailText } from "./Card";

interface WorkCardProps {
  title: string;
  description: string;
  year: string;
  role: string;
  company: string;
  bgColor: string;
  href: string;
  imageUrl?: string;
  videoUrl?: string;
  videoPoster?: string;
  externalLink?: boolean;
  comingSoon?: boolean;
  hoverLabel?: string;
}

export function WorkCard({
  title,
  description,
  year,
  role,
  company,
  bgColor,
  href,
  imageUrl,
  videoUrl,
  videoPoster,
  externalLink = false,
  comingSoon = false,
  hoverLabel,
}: WorkCardProps) {
  return (
    <Card
      title={title}
      description={description}
      bgColor={bgColor}
      href={href}
      imageUrl={imageUrl}
      videoUrl={videoUrl}
      videoPoster={videoPoster}
      externalLink={externalLink}
      comingSoon={comingSoon}
      hoverLabel={hoverLabel}
      details={
        <div className="flex items-center gap-3 min-w-0 whitespace-nowrap overflow-hidden">
          <CardDetailText>{year}</CardDetailText>
          <CardDetailSeparator />
          <span className="truncate text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">{role}</span>
          <CardDetailSeparator />
          <CardDetailText>{company}</CardDetailText>
        </div>
      }
    />
  );
}
