"use client";

import React from "react";
import Image from "next/image";

export interface GridCardItem {
  title: string;
  description: string;
  bannerBg?: string;
  icon: React.ReactNode;
}

export function GridCard({ item }: { item: GridCardItem }) {
  return (
    <div className="bg-[var(--background)] border border-[var(--foreground)]/20 flex flex-col overflow-hidden h-full">
      {/* Banner with background image */}
      <div className="p-1">
        <div
          className="relative h-28 flex items-center justify-center overflow-hidden"
          style={{
            backgroundColor: item.bannerBg ? undefined : "var(--foreground)",
          }}
        >
          {item.bannerBg && (
            <Image
              src={item.bannerBg}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
          <div className="relative rounded-lg bg-white/30 backdrop-blur-sm p-1">
            <div className="rounded bg-[var(--background)] text-[var(--foreground)] w-12 h-12 flex items-center justify-center">
              {item.icon}
            </div>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] leading-tight">{item.title}</h3>
        <p className="text-[var(--foreground)] text-lg">{item.description}</p>
      </div>
    </div>
  );
}

export function GridCardList({ 
  items, 
  columns = 3 
}: { 
  items: GridCardItem[];
  columns?: 2 | 3 | 4;
}) {
  const colsClass = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-4",
  }[columns];

  return (
    <div className={`grid grid-cols-1 ${colsClass} gap-4`}>
      {items.map((item) => (
        <GridCard key={item.title} item={item} />
      ))}
    </div>
  );
}
