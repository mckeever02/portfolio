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
