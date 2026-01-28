"use client";

import { Card, CardDetailText } from "./Card";

interface ProjectCardProps {
  title: string;
  description: string;
  year: string;
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
        <div className="flex items-center">
          <CardDetailText>{year}</CardDetailText>
        </div>
      }
    />
  );
}
