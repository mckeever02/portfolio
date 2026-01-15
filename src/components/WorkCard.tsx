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
  externalLink?: boolean;
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
  externalLink = false,
}: WorkCardProps) {
  return (
    <Card
      title={title}
      description={description}
      bgColor={bgColor}
      href={href}
      imageUrl={imageUrl}
      videoUrl={videoUrl}
      externalLink={externalLink}
      details={
        <div className="flex items-center gap-3">
          <CardDetailText>{year}</CardDetailText>
          <CardDetailSeparator />
          <CardDetailText>{role}</CardDetailText>
          <CardDetailSeparator />
          <CardDetailText>{company}</CardDetailText>
        </div>
      }
    />
  );
}
