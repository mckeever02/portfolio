"use client";

interface ContentSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export function ContentSection({ id, title, children }: ContentSectionProps) {
  return (
    <section id={id} className="flex flex-col gap-4 scroll-mt-8">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">{title}</h2>
      {children}
    </section>
  );
}
