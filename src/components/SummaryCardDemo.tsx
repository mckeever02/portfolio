"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

type CardType = "skeleton" | "item-list" | "item-sharing" | "watchtower" | "task";

const cardTypeLabels: Record<CardType, string> = {
  skeleton: "Loading State",
  "item-list": "Item List",
  "item-sharing": "Item Sharing Details",
  watchtower: "Watchtower Report",
  task: "Task",
};

// Animation variants for skeleton to content transition
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
};

const shimmerToContent = {
  skeleton: { opacity: 1 },
  loaded: { opacity: 1, transition: { duration: 0.3 } },
};

// Skeleton base with shimmer
function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`skeleton-shimmer rounded ${className}`} />;
}

// Transitioning element - shows skeleton or content
function TransitionElement({
  isLoading,
  skeleton,
  children,
  delay = 0,
}: {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <div className="relative">
      {/* Skeleton layer */}
      <motion.div
        initial={false}
        animate={{
          opacity: isLoading ? 1 : 0,
          scale: isLoading ? 1 : 0.95,
        }}
        transition={{ duration: 0.3, delay: isLoading ? 0 : delay }}
        className={isLoading ? "relative" : "absolute inset-0 pointer-events-none"}
      >
        {skeleton}
      </motion.div>
      {/* Content layer */}
      <motion.div
        initial={false}
        animate={{
          opacity: isLoading ? 0 : 1,
          scale: isLoading ? 1.05 : 1,
        }}
        transition={{ duration: 0.3, delay: isLoading ? 0 : delay }}
        className={isLoading ? "absolute inset-0 pointer-events-none" : "relative"}
      >
        {children}
      </motion.div>
    </div>
  );
}

// Card wrapper - matches Figma: corner-radius/large (12px), border/neutral rgba(0,0,0,0.13)
function CardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div 
      className={`bg-white rounded-[12px] max-w-[328px] w-full border overflow-hidden ${inter.className}`}
      style={{ borderColor: "rgba(0,0,0,0.13)" }}
    >
      {children}
    </div>
  );
}

// ===============================
// CARD CONTENT DEFINITIONS
// ===============================

interface CardConfig {
  header: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    subtitle: string;
    actions?: React.ReactNode;
  };
  body: React.ReactNode;
}

// Icon button - Figma: min-h-28px, px-6px, py-5.5px, rounded-8px
function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button 
      className="min-h-[28px] px-1.5 py-[5.5px] flex items-center justify-center rounded-[8px] transition-colors hover:bg-black/5"
      style={{ color: "rgba(0,0,0,0.62)" }}
    >
      {children}
    </button>
  );
}

// List row component for Item List card
// Figma: gap=8px, py=4px, px=8px, icon=24px, text 14px/-0.09px and 12px/0.01px
function ListRow({ 
  icon, 
  title, 
  subtitle 
}: { 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-2 px-2 py-1">
      <div className="w-6 h-6 rounded-[4px] overflow-hidden shrink-0 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0 flex-1 leading-[1.2]">
        <p 
          className="text-[14px] truncate"
          style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "-0.09px" }}
        >
          {title}
        </p>
        <p 
          className="text-[12px] truncate"
          style={{ color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}

// Card configurations for each type
const cardConfigs: Record<Exclude<CardType, "skeleton">, CardConfig> = {
  "item-list": {
    header: {
      icon: (
        <Image 
          src="/images/work/sentinel/vault-finance.png" 
          alt="Finance vault" 
          width={32} 
          height={32}
          className="rounded-md"
        />
      ),
      iconBg: "",
      title: "Finance",
      subtitle: "Shared",
      actions: (
        <>
          <IconBtn>
            {/* Overflow menu */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </IconBtn>
          <IconBtn>
            {/* Chevron up */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </IconBtn>
        </>
      ),
    },
    body: (
      <div className="flex flex-col p-2">
        <ListRow
          icon={
            <div className="w-6 h-6 rounded-[4px] bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
          }
          title="NetSuite"
          subtitle="Work4WorkFinance"
        />
        <ListRow
          icon={
            <Image 
              src="/images/work/sentinel/logo-aws.png" 
              alt="AWS" 
              width={24} 
              height={24}
              className="rounded-[4px]"
            />
          }
          title="Amazon test"
          subtitle="emma.brown@work4work.org"
        />
        <ListRow
          icon={
            <Image 
              src="/images/work/sentinel/logo-starbucks.png" 
              alt="Starbucks" 
              width={24} 
              height={24}
              className="rounded-[4px]"
            />
          }
          title="Starbucks"
          subtitle="emma.brown@work4work.org"
        />
        <ListRow
          icon={
            <Image 
              src="/images/work/sentinel/logo-plex.png" 
              alt="Plex" 
              width={24} 
              height={24}
              className="rounded-[4px]"
            />
          }
          title="Plex"
          subtitle="emma.brown@work4work.org"
        />
      </div>
    ),
  },
  "item-sharing": {
    header: {
      icon: (
        <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      ),
      iconBg: "",
      title: "Netsuite",
      subtitle: "Work4WorkFinance",
      actions: (
        <>
          <IconBtn>
            {/* Overflow menu */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </IconBtn>
          <IconBtn>
            {/* Chevron up */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </IconBtn>
        </>
      ),
    },
    body: (
      <div className="max-h-[300px] overflow-y-auto">
        {/* Located in section */}
        <div className="px-4 pb-3">
          <span 
            className="text-[12px] leading-[1.2] block mb-2"
            style={{ color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
          >
            Located in:
          </span>
          <div className="flex items-center gap-2 px-2 py-1">
            <Image 
              src="/images/work/sentinel/vault-finance.png" 
              alt="Finance vault" 
              width={24} 
              height={24}
              className="rounded-[4px]"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] text-[rgba(0,0,0,0.82)] leading-[1.2] tracking-[-0.09px]">Finance</p>
              <p className="text-[12px] text-[rgba(0,0,0,0.62)] leading-[1.2] tracking-[0.01px]">Shared</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(0,0,0,0.13)] mx-4" />

        {/* People with access section */}
        <div className="px-4 pt-3 pb-2">
          <span 
            className="text-[12px] leading-[1.2] block mb-2"
            style={{ color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
          >
            6 people have access:
          </span>
          <div className="space-y-0">
            {[
              { initials: "SJ", name: "Sonja Johnson", color: "#06b6d4", isYou: true },
              { initials: "EB", name: "Emma Brown", color: "#6366f1", isYou: false },
              { initials: "KS", name: "Kira Smith", color: "#22c55e", isYou: false },
              { initials: "LW", name: "Leon Waters", color: "#f97316", isYou: false },
              { initials: "JS", name: "John Smith", color: "#0ea5e9", isYou: false },
            ].map((person, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-1.5">
                <div 
                  className="w-6 h-6 text-[10px] rounded-full flex items-center justify-center text-white font-medium shrink-0 leading-[1.2]" 
                  style={{ backgroundColor: person.color }}
                >
                  {person.initials}
                </div>
                <span 
                  className="text-[14px] leading-[1.2] flex-1"
                  style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "-0.09px" }}
                >
                  {person.name}
                </span>
                {person.isYou && (
                  <span 
                    className="text-[12px] px-2 py-0.5 rounded-full leading-[1.2]"
                    style={{ backgroundColor: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.82)", letterSpacing: "0.01px" }}
                  >
                    You
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  },
  watchtower: {
    header: {
      icon: (
        <Image 
          src="/images/work/sentinel/logo-plex.png" 
          alt="Plex" 
          width={32} 
          height={32}
          className="rounded-[8px]"
        />
      ),
      iconBg: "",
      title: "Plex",
      subtitle: "Watchtower report",
      actions: (
        <>
          <IconBtn>
            {/* Overflow menu */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </IconBtn>
          <IconBtn>
            {/* Chevron up */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </IconBtn>
        </>
      ),
    },
    body: (
      <div className="max-h-[300px] overflow-y-auto">
        {/* Description paragraph */}
        <div className="px-4 py-2">
          <p 
            className="text-[12px] leading-[1.5]"
            style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "0.01px" }}
          >
            In August 2022 Plex discovered suspicious activity on one of their databases. Plex began an investigation and it appears that a third-party was able to access a limited subset of data that includes emails, usernames, and encrypted passwords.
          </p>
        </div>

        {/* Affected data section */}
        <div className="pt-3 pb-2 px-4">
          <p 
            className="text-[12px] font-medium leading-[1.2]"
            style={{ color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
          >
            Affected data
          </p>
        </div>
        <div className="flex flex-wrap gap-2 px-4 py-2">
          {["Email addresses", "Passwords", "IP addresses", "Usernames"].map((label, i) => (
            <span 
              key={i}
              className="text-[12px] h-[18px] px-2 rounded-full leading-[1.2] flex items-center"
              style={{ backgroundColor: "#ffefeb", color: "#a32600", letterSpacing: "0.01px" }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Affected users section */}
        <div className="pt-3 pb-2 px-4">
          <p 
            className="text-[12px] font-medium leading-[1.2]"
            style={{ color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
          >
            Affected users
          </p>
        </div>
        <div className="px-2 pb-2">
          <div className="flex items-center gap-2 px-2 py-1">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold uppercase shrink-0 leading-[1.2]"
              style={{ backgroundColor: "#c9ade6", color: "rgba(0,0,0,0.62)" }}
            >
              EB
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] text-[rgba(0,0,0,0.82)] leading-[1.2] tracking-[-0.09px]">Emma Brown</p>
              <p className="text-[12px] text-[rgba(0,0,0,0.62)] leading-[1.2] tracking-[0.01px]">emma.brown@work4work.org</p>
            </div>
          </div>
        </div>

        {/* Footer with Learn more button */}
        <div className="flex justify-end p-4">
          <button 
            className="flex items-center gap-2 px-2 py-[5.5px] min-h-[28px] rounded-[8px] text-[14px] leading-[1.2] border transition-colors hover:bg-gray-50"
            style={{ 
              color: "rgba(0,0,0,0.82)", 
              borderColor: "rgba(0,0,0,0.13)",
              letterSpacing: "-0.09px"
            }}
          >
            {/* External link icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Learn more
          </button>
        </div>
      </div>
    ),
  },
  task: {
    header: {
      icon: (
        <div className="w-[32px] h-[32px] rounded-[8px] bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>
      ),
      iconBg: "",
      title: "Netsuite",
      subtitle: "Work4WorkFinance",
      actions: (
        <>
          <IconBtn>
            {/* Overflow menu */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="1" />
              <circle cx="12" cy="5" r="1" />
              <circle cx="12" cy="19" r="1" />
            </svg>
          </IconBtn>
          <IconBtn>
            {/* Chevron up */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6" />
            </svg>
          </IconBtn>
        </>
      ),
    },
    body: (
      <div className="max-h-[300px] overflow-y-auto">
        {/* Step 1 */}
        <div className="flex gap-2 items-center pl-4 pr-3 py-2">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold leading-[1.2]"
              style={{ backgroundColor: "#ededed", color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
            >
              1
            </div>
          </div>
          <p className="text-[12px] leading-[1.5] flex-1" style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "0.01px" }}>
            Send a notification to <span className="font-semibold">Emma Brown</span> to change her password for the <span className="font-semibold">Plex</span> login
          </p>
        </div>

        {/* Connector 1 */}
        <div className="h-4 pl-4 pr-3">
          <div className="w-8 h-full flex items-center justify-center">
            <div className="w-[2px] h-full rounded-full" style={{ backgroundColor: "#ededed" }} />
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-2 items-center pl-4 pr-3 py-2">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold leading-[1.2]"
              style={{ backgroundColor: "#ededed", color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
            >
              2
            </div>
          </div>
          <p className="text-[12px] leading-[1.5] flex-1" style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "0.01px" }}>
            Rotate the password for the <span className="font-semibold">NetSuite</span> login
          </p>
        </div>

        {/* Connector 2 */}
        <div className="h-4 pl-4 pr-3">
          <div className="w-8 h-full flex items-center justify-center">
            <div className="w-[2px] h-full rounded-full" style={{ backgroundColor: "#ededed" }} />
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-2 items-center pl-4 pr-3 py-2">
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            <div 
              className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold leading-[1.2]"
              style={{ backgroundColor: "#ededed", color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
            >
              3
            </div>
          </div>
          <p className="text-[12px] leading-[1.5] flex-1" style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "0.01px" }}>
            Create a Watchtower report for Reused passwords
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-2 justify-end p-4">
          <button 
            className="text-[14px] px-2 py-[5.5px] min-h-[28px] rounded-[8px] leading-[1.2] transition-colors hover:bg-gray-50"
            style={{ 
              color: "rgba(0,0,0,0.82)", 
              letterSpacing: "-0.09px",
              border: "1px solid rgba(0,0,0,0.13)"
            }}
          >
            Cancel
          </button>
          <button 
            className="text-[14px] px-2 py-[5.5px] min-h-[28px] rounded-[8px] bg-[#0570eb] text-white leading-[1.2] hover:bg-[#0560d0] transition-colors"
            style={{ letterSpacing: "-0.09px" }}
          >
            Authorize
          </button>
        </div>
      </div>
    ),
  },
};

// ===============================
// SKELETON STRUCTURES BY CARD TYPE
// ===============================

const skeletonBodies: Record<Exclude<CardType, "skeleton">, React.ReactNode> = {
  "item-list": (
    <div className="flex flex-col p-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1">
          <SkeletonBox className="w-6 h-6 rounded-[4px] shrink-0" />
          <div className="flex flex-col gap-[1px] flex-1">
            <SkeletonBox className="h-[17px] w-20" />
            <SkeletonBox className="h-[14px] w-36" />
          </div>
        </div>
      ))}
    </div>
  ),
  "item-sharing": (
    <div className="max-h-[300px] overflow-y-auto">
      {/* Located in section skeleton */}
      <div className="px-4 pb-3">
        <SkeletonBox className="h-[14px] w-16 mb-2" />
        <div className="flex items-center gap-2 px-2 py-1">
          <SkeletonBox className="w-6 h-6 rounded-[4px] shrink-0" />
          <div className="flex flex-col gap-[1px] flex-1">
            <SkeletonBox className="h-[17px] w-16" />
            <SkeletonBox className="h-[14px] w-12" />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-[rgba(0,0,0,0.08)] mx-4" />

      {/* People section skeleton */}
      <div className="px-4 pt-3 pb-2">
        <SkeletonBox className="h-[14px] w-32 mb-2" />
        <div className="space-y-0">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5">
              <SkeletonBox className="w-6 h-6 rounded-full shrink-0" />
              <SkeletonBox className="h-[17px] w-24 flex-1" />
              {i === 0 && <SkeletonBox className="h-[22px] w-10 rounded-full" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  watchtower: (
    <div className="max-h-[300px] overflow-y-auto">
      {/* Description paragraph skeleton */}
      <div className="px-4 py-2">
        <div className="flex flex-col gap-1">
          <SkeletonBox className="h-[18px] w-full" />
          <SkeletonBox className="h-[18px] w-full" />
          <SkeletonBox className="h-[18px] w-full" />
          <SkeletonBox className="h-[18px] w-3/4" />
        </div>
      </div>

      {/* Affected data section skeleton */}
      <div className="pt-3 pb-2 px-4">
        <SkeletonBox className="h-[14px] w-20" />
      </div>
      <div className="flex flex-wrap gap-2 px-4 py-2">
        <SkeletonBox className="h-[18px] w-24 rounded-full" />
        <SkeletonBox className="h-[18px] w-20 rounded-full" />
        <SkeletonBox className="h-[18px] w-20 rounded-full" />
        <SkeletonBox className="h-[18px] w-20 rounded-full" />
      </div>

      {/* Affected users section skeleton */}
      <div className="pt-3 pb-2 px-4">
        <SkeletonBox className="h-[14px] w-24" />
      </div>
      <div className="px-2 pb-2">
        <div className="flex items-center gap-2 px-2 py-1">
          <SkeletonBox className="w-6 h-6 rounded-full shrink-0" />
          <div className="flex flex-col gap-[1px] flex-1">
            <SkeletonBox className="h-[17px] w-24" />
            <SkeletonBox className="h-[14px] w-40" />
          </div>
        </div>
      </div>

      {/* Footer skeleton */}
      <div className="flex justify-end p-4">
        <SkeletonBox className="h-[28px] w-24 rounded-[8px]" />
      </div>
    </div>
  ),
  task: (
    <div className="max-h-[300px] overflow-y-auto">
      {/* Step 1 skeleton */}
      <div className="flex gap-2 items-center pl-4 pr-3 py-2">
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          <SkeletonBox className="w-6 h-6 rounded-full" />
        </div>
        <div className="flex-1 flex flex-col gap-1">
          <SkeletonBox className="h-[18px] w-full" />
          <SkeletonBox className="h-[18px] w-3/4" />
        </div>
      </div>

      {/* Connector 1 skeleton */}
      <div className="h-4 pl-4 pr-3">
        <div className="w-8 h-full flex items-center justify-center">
          <SkeletonBox className="w-[2px] h-full rounded-full" />
        </div>
      </div>

      {/* Step 2 skeleton */}
      <div className="flex gap-2 items-center pl-4 pr-3 py-2">
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          <SkeletonBox className="w-6 h-6 rounded-full" />
        </div>
        <SkeletonBox className="h-[18px] w-3/4 flex-1" />
      </div>

      {/* Connector 2 skeleton */}
      <div className="h-4 pl-4 pr-3">
        <div className="w-8 h-full flex items-center justify-center">
          <SkeletonBox className="w-[2px] h-full rounded-full" />
        </div>
      </div>

      {/* Step 3 skeleton */}
      <div className="flex gap-2 items-center pl-4 pr-3 py-2">
        <div className="w-8 h-8 shrink-0 flex items-center justify-center">
          <SkeletonBox className="w-6 h-6 rounded-full" />
        </div>
        <SkeletonBox className="h-[18px] w-4/5 flex-1" />
      </div>

      {/* Footer skeleton */}
      <div className="flex gap-2 justify-end p-4">
        <SkeletonBox className="h-[28px] w-16 rounded-[8px]" />
        <SkeletonBox className="h-[28px] w-20 rounded-[8px]" />
      </div>
    </div>
  ),
};

// Default skeleton for generic loading state
const defaultSkeletonBody = (
  <div className="flex flex-col p-2">
    {[0, 1, 2].map((i) => (
      <div key={i} className="flex items-center gap-2 px-2 py-1">
        <SkeletonBox className="w-6 h-6 rounded-[4px] shrink-0" />
        <div className="flex flex-col gap-[1px] flex-1">
          <SkeletonBox className="h-[17px] w-20" />
          <SkeletonBox className="h-[14px] w-36" />
        </div>
      </div>
    ))}
    <div className="flex gap-1.5 px-2 pt-2">
      <SkeletonBox className="h-[22px] w-16 rounded-full" />
      <SkeletonBox className="h-[22px] w-20 rounded-full" />
      <SkeletonBox className="h-[22px] w-14 rounded-full" />
    </div>
  </div>
);

// ===============================
// MAIN COMPONENT
// ===============================

export function SummaryCardDemo() {
  const [selectedType, setSelectedType] = useState<CardType>("skeleton");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingType, setPendingType] = useState<CardType>("skeleton");

  // Handle selection change
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value as CardType;
    setPendingType(newType);
    setIsLoading(true);
  };

  // Transition from loading to loaded
  useEffect(() => {
    if (isLoading && pendingType !== "skeleton") {
      const timer = setTimeout(() => {
        setSelectedType(pendingType);
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    } else if (pendingType === "skeleton") {
      setSelectedType("skeleton");
      setIsLoading(true);
    }
  }, [isLoading, pendingType]);

  // Get current config (or null for skeleton-only state)
  const config = selectedType !== "skeleton" ? cardConfigs[selectedType] : null;
  const skeletonBody = pendingType !== "skeleton" ? skeletonBodies[pendingType] : defaultSkeletonBody;

  // Determine what to show
  const showSkeleton = isLoading || selectedType === "skeleton";

  return (
    <div className="bg-[#4a4a4a] rounded-xl p-6 md:p-8">
      {/* Select menu */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-white/60 text-sm font-medium">Card Type:</span>
        <select
          value={pendingType}
          onChange={handleChange}
          className="bg-white/10 text-white text-sm rounded-lg px-3 py-1.5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 cursor-pointer appearance-none pr-8"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 8px center",
          }}
        >
          {Object.entries(cardTypeLabels).map(([value, label]) => (
            <option key={value} value={value} className="text-black">
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Card */}
      <div className="flex justify-center">
        <CardWrapper>
          {/* Header - Figma: pl-16px, pr-12px, py-4px, gap-8px */}
          <div className="flex items-center justify-between pl-4 pr-3 py-1">
            <div className="flex items-center gap-3">
              {/* Icon - 32px */}
              <TransitionElement
                isLoading={showSkeleton}
                skeleton={<SkeletonBox className="w-8 h-8 rounded-[8px]" />}
                delay={0}
              >
                {config && (
                  config.header.iconBg ? (
                    <div className={`w-8 h-8 rounded-[8px] flex items-center justify-center ${config.header.iconBg}`}>
                      {config.header.icon}
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-[8px] overflow-hidden shrink-0">
                      {config.header.icon}
                    </div>
                  )
                )}
              </TransitionElement>
              
              {/* Title & Subtitle - gap 1px (hairline) */}
              <div className="flex flex-col gap-[1px] leading-[1.2]">
                <TransitionElement
                  isLoading={showSkeleton}
                  skeleton={<SkeletonBox className="h-[17px] w-20" />}
                  delay={0.05}
                >
                  {config && (
                    <h4 
                      className="text-[14px] font-semibold"
                      style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "-0.09px" }}
                    >
                      {config.header.title}
                    </h4>
                  )}
                </TransitionElement>
                <TransitionElement
                  isLoading={showSkeleton}
                  skeleton={<SkeletonBox className="h-[14px] w-12" />}
                  delay={0.1}
                >
                  {config && (
                    <p 
                      className="text-[12px]"
                      style={{ color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
                    >
                      {config.header.subtitle}
                    </p>
                  )}
                </TransitionElement>
              </div>
            </div>
            
            {/* Actions - gap 4px */}
            <TransitionElement
              isLoading={showSkeleton}
              skeleton={
                <div className="flex items-center gap-1">
                  <SkeletonBox className="w-7 h-7 rounded-[8px]" />
                  <SkeletonBox className="w-7 h-7 rounded-[8px]" />
                </div>
              }
              delay={0.15}
            >
              {config?.header.actions && (
                <div className="flex items-center gap-1">{config.header.actions}</div>
              )}
            </TransitionElement>
          </div>

          {/* Body - Figma: max-h-300px, overflow-y-auto */}
          <div className="max-h-[300px] overflow-y-auto">
            <TransitionElement
              isLoading={showSkeleton}
              skeleton={skeletonBody}
              delay={0.2}
            >
              {config && config.body}
            </TransitionElement>
          </div>
        </CardWrapper>
      </div>
    </div>
  );
}
