"use client";

import { Card, CardDetailText } from "./Card";

interface ProjectCardProps {
  title: string;
  description: string;
  year: string;
  role?: string;
  bgColor: string;
  href: string;
  imageUrl?: string;
  videoUrl?: string;
  videoPoster?: string;
  externalLink?: boolean;
}

export function ProjectCard({
  title,
  description,
  year,
  role,
  bgColor,
  href,
  imageUrl,
  videoUrl,
  videoPoster,
  externalLink = false,
}: ProjectCardProps) {
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
      hoverLabel="View project"
      details={
        <div className="flex items-center gap-2">
          <CardDetailText>{year}</CardDetailText>
          {role && (
            <>
              <span className="text-muted-foreground">·</span>
              <CardDetailText>{role}</CardDetailText>
            </>
          )}
        </div>
      }
    />
  );
}
