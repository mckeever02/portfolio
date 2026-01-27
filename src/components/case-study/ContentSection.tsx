"use client";

interface ContentSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function ContentSection({ id, title, children }: ContentSectionProps) {
  return (
    <section id={id} className="flex flex-col gap-2 xs:gap-3 sm:gap-4 scroll-mt-8">
      <h2 className="text-xl xs:text-2xl lg:text-3xl tracking-[-0.4px] lg:tracking-[-0.8px] font-bold text-[var(--foreground)]">{title}</h2>
      {children}
    </section>
  );
}
