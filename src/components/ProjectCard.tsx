import Link from "next/link";

interface ProjectCardProps {
  title: string;
  description: string;
  year: string;
  bgColor: string;
  href: string;
  imageUrl?: string;
  externalLink?: boolean;
}

export function ProjectCard({
  title,
  description,
  year,
  bgColor,
  href,
  imageUrl,
  externalLink = false,
}: ProjectCardProps) {
  const CardWrapper = externalLink ? "a" : Link;
  const linkProps = externalLink
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <CardWrapper
      {...linkProps}
      className="group flex flex-col border border-[var(--border)] rounded overflow-hidden transition-all duration-300 hover:border-[var(--border-darker)] hover:shadow-lg"
    >
      {/* Visual Area */}
      <div
        className="h-[250px] sm:h-[350px] md:h-[408px] w-full overflow-hidden transition-transform duration-500"
        style={{ backgroundColor: bgColor }}
      >
        {imageUrl && (
          <div
            className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
        )}
      </div>

      {/* Info Area */}
      <div className="bg-white border-t border-[var(--border)] flex flex-col gap-6 px-6 pt-6 pb-3">
        {/* Project Info */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xl font-bold text-[var(--foreground)]">
            {title}
          </h3>
          <p className="text-lg text-[var(--foreground)]">
            {description}
          </p>
        </div>

        {/* Project Details */}
        <div className="flex items-center">
          <span className="text-xs font-bold tracking-[1.2px] uppercase text-[var(--foreground-secondary)] font-[var(--font-era)]">
            {year}
          </span>
        </div>
      </div>
    </CardWrapper>
  );
}
