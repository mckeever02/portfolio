"use client";

import React from "react";
import Image from "next/image";

export interface FeatureCardItem {
  title: string;
  description: string;
  bannerBg?: string;
  icon: React.ReactNode;
}

export function FeatureCard({ item }: { item: FeatureCardItem }) {
  return (
    <div className="bg-[var(--background)] border border-[var(--foreground)]/20 flex flex-col sm:flex-row overflow-hidden">
      <div className="p-1 sm:self-stretch">
        <div
          className="relative py-4 sm:py-0 shrink-0 flex items-center justify-center w-full sm:w-32 sm:h-full sm:min-h-[128px] overflow-hidden"
          style={{
            backgroundColor: item.bannerBg ? undefined : "var(--foreground)",
          }}
        >
          {item.bannerBg && (
            <>
              <Image
                src={item.bannerBg}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 128px"
              />
              <div className="absolute inset-0 bg-black/10" />
            </>
          )}
          <div className="relative rounded-lg overflow-hidden">
            <div className="absolute inset-0 bg-white/35 backdrop-blur-lg" />
            <div className="relative p-1">
              <div className="rounded bg-[var(--background)] text-[var(--foreground)] w-12 h-12 flex items-center justify-center">
                {item.icon}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 flex-1">
        <h3 className="text-xl font-bold mb-2 text-[var(--foreground)] leading-tight">{item.title}</h3>
        <p className="text-[var(--foreground)] text-lg">{item.description}</p>
      </div>
    </div>
  );
}

export function FeatureCardConnector() {
  return (
    <div className="h-12 flex justify-center py-2">
      <div className="w-0.5 h-full bg-[var(--foreground)]/30" />
    </div>
  );
}

export function FeatureCardList({ items, trailingConnector = false }: { items: FeatureCardItem[]; trailingConnector?: boolean }) {
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <div key={item.title}>
          <FeatureCard item={item} />
          {(index < items.length - 1 || trailingConnector) && <FeatureCardConnector />}
        </div>
      ))}
    </div>
  );
}
