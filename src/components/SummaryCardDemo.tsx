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

// ===============================
// UNIFIED ROW COMPONENT
// ===============================

// Avatar colors matching 1Password design system
const avatarColors = {
  magenta: "#e6b7e6",
  violet: "#c9ade6",
  purple: "#b8b8e6",
  lavender: "#adc9e6",
  blue: "#ade6e6",
  turquoise: "#ade6c9",
  lime: "#c9e6ad",
  yellow: "#e6e6ad",
  gold: "#e6d4ad",
  orange: "#e6c9ad",
  peach: "#e6b8ad",
  red: "#e6adad",
  pink: "#e6adc9",
  green: "#ade6ad",
} as const;

type AvatarColor = keyof typeof avatarColors;

// Avatar component for initials-based avatars (matches login item style)
function Avatar({ 
  initials, 
  color,
  size = 24,
}: { 
  initials: string; 
  color: AvatarColor;
  size?: number;
}) {
  return (
    <div 
      className="rounded-[6px] flex items-center justify-center font-semibold shrink-0 leading-[1.2] uppercase"
      style={{ 
        backgroundColor: avatarColors[color], 
        color: "rgba(0,0,0,0.62)",
        width: size, 
        height: size,
        fontSize: size < 24 ? 8 : 10,
        letterSpacing: "0.01px",
      }}
    >
      {initials}
    </div>
  );
}

// Unified row component for all list-style items
interface RowProps {
  icon: React.ReactNode;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  trailing?: React.ReactNode;
  iconShape?: "square" | "circle";
  size?: "default" | "compact";
  isLoading?: boolean;
}

function Row({ 
  icon, 
  title, 
  subtitle, 
  trailing,
  iconShape = "square",
  size = "default",
  isLoading = false,
}: RowProps) {
  return (
    <div className={`flex items-center gap-3 px-4 ${size === "compact" ? "h-[40px]" : "h-[56px]"}`}>
      <div className={`w-6 h-6 overflow-hidden shrink-0 flex items-center justify-center ${
        iconShape === "circle" ? "rounded-full" : "rounded-[4px]"
      }`}>
        {isLoading ? (
          <div className={`skeleton-shimmer w-6 h-6 ${iconShape === "circle" ? "rounded-full" : "rounded-[6px]"}`} />
        ) : icon}
      </div>
      <div className="min-w-0 flex-1 leading-[1.2]">
        {isLoading ? (
          <>
            <div className="skeleton-shimmer h-[10px] w-[114px] rounded-full mb-1" />
            <div className="skeleton-shimmer h-[10px] w-[66px] rounded-full" />
          </>
        ) : (
          <>
            <p 
              className="text-[14px] truncate"
              style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "-0.09px" }}
            >
              {title}
            </p>
            {subtitle && (
              <p 
                className="text-[12px] truncate"
                style={{ color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
              >
                {subtitle}
              </p>
            )}
          </>
        )}
      </div>
      {trailing && !isLoading && trailing}
    </div>
  );
}

// Badge component for trailing badges like "You"
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span 
      className="text-[12px] px-2 py-0.5 rounded-full leading-[1.2]"
      style={{ backgroundColor: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.82)", letterSpacing: "0.01px" }}
    >
      {children}
    </span>
  );
}

// Section label for card content sections
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p 
      className="text-[14px] font-medium leading-[1.2] px-4 py-2"
      style={{ color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
    >
      {children}
    </p>
  );
}

// Step component for task cards
function Step({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-2 items-center pl-4 pr-3 py-2">
      <div className="w-8 h-8 shrink-0 flex items-center justify-center">
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center text-[12px] font-semibold leading-[1.2]"
          style={{ backgroundColor: "#ededed", color: "rgba(0,0,0,0.62)", letterSpacing: "0.01px" }}
        >
          {number}
        </div>
      </div>
      <p className="text-[12px] leading-[1.5] flex-1" style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "0.01px" }}>
        {children}
      </p>
    </div>
  );
}

// Connector line between steps
function StepConnector() {
  return (
    <div className="h-4 pl-4 pr-3">
      <div className="w-8 h-full flex items-center justify-center">
        <div className="w-[2px] h-full rounded-full" style={{ backgroundColor: "#ededed" }} />
      </div>
    </div>
  );
}

// Step list that renders steps with connectors between them
function StepList({ steps }: { steps: React.ReactNode[] }) {
  return (
    <>
      {steps.map((step, i) => (
        <div key={i}>
          {step}
          {i < steps.length - 1 && <StepConnector />}
        </div>
      ))}
    </>
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
      <div className="flex flex-col">
        <Row
          icon={<Image src="/images/work/sentinel/logo-netsuite.png" alt="NetSuite" width={24} height={24} className="rounded-[4px]" />}
          title="NetSuite"
          subtitle="Work4WorkFinance"
        />
        <Row
          icon={<Image src="/images/work/sentinel/logo-aws.png" alt="AWS" width={24} height={24} className="rounded-[4px]" />}
          title="Amazon test"
          subtitle="emma.brown@work4work.org"
        />
        <Row
          icon={<Image src="/images/work/sentinel/logo-starbucks.png" alt="Starbucks" width={24} height={24} className="rounded-[4px]" />}
          title="Starbucks"
          subtitle="emma.brown@work4work.org"
        />
        <Row
          icon={<Image src="/images/work/sentinel/logo-plex.png" alt="Plex" width={24} height={24} className="rounded-[4px]" />}
          title="Plex"
          subtitle="emma.brown@work4work.org"
        />
      </div>
    ),
  },
  "item-sharing": {
    header: {
      icon: (
        <Image 
          src="/images/work/sentinel/logo-netsuite.png" 
          alt="NetSuite" 
          width={32} 
          height={32}
          className="rounded-[8px]"
        />
      ),
      iconBg: "",
      title: "NetSuite",
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
      <div>
        {/* Located in section */}
        <div>
          <SectionLabel>Located in:</SectionLabel>
          <Row
            icon={<Image src="/images/work/sentinel/vault-finance.png" alt="Finance vault" width={24} height={24} className="rounded-[4px]" />}
            title="Finance"
            subtitle="Shared"
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-[rgba(0,0,0,0.13)] mx-4" />

        {/* People with access section */}
        <div className="pt-1 pb-2">
          <SectionLabel>6 people have access:</SectionLabel>
          {[
            { initials: "SJ", name: "Sonja Johnson", color: "magenta" as AvatarColor, isYou: true },
            { initials: "EB", name: "Emma Brown", color: "violet" as AvatarColor, isYou: false },
            { initials: "KS", name: "Kira Smith", color: "turquoise" as AvatarColor, isYou: false },
            { initials: "LW", name: "Leon Waters", color: "orange" as AvatarColor, isYou: false },
            { initials: "JS", name: "John Smith", color: "blue" as AvatarColor, isYou: false },
          ].map((person, i) => (
            <Row
              key={i}
              icon={<Avatar initials={person.initials} color={person.color} />}
              title={person.name}
              trailing={person.isYou ? <Badge>You</Badge> : undefined}
              size="compact"
            />
          ))}
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
      <div>
        {/* Description paragraph */}
        <div className="px-4 py-2">
          <p 
            className="text-[13px] leading-[1.5]"
            style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "0.01px" }}
          >
            In August 2022 Plex discovered suspicious activity on one of their databases. Plex began an investigation and it appears that a third-party was able to access a limited subset of data that includes emails, usernames, and encrypted passwords.
          </p>
        </div>

        {/* Affected data section */}
        <SectionLabel>Affected data</SectionLabel>
        <div className="flex flex-wrap gap-2 px-3">
          {["Email addresses", "Passwords", "IP addresses", "Usernames"].map((label, i) => (
            <span 
              key={i}
              className="text-[12px] py-1 px-2 rounded-full leading-[1.2] flex items-center"
              style={{ backgroundColor: "#ffefeb", color: "#a32600", letterSpacing: "0.01px" }}
            >
              {label}
            </span>
          ))}
        </div>

        {/* Affected users section */}
        <div className="pt-3">
          <SectionLabel>Affected users</SectionLabel>
          <div className="pb-2">
            <Row
              icon={<Avatar initials="EB" color="violet" />}
              title="Emma Brown"
              subtitle="emma.brown@work4work.org"
              size="compact"
            />
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
        <Image 
          src="/images/work/sentinel/logo-netsuite.png" 
          alt="NetSuite" 
          width={32} 
          height={32}
          className="rounded-[8px]"
        />
      ),
      iconBg: "",
      title: "NetSuite",
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
      <div>
        <StepList steps={[
          <Step number={1}>
            Send a notification to <span className="font-semibold">Emma Brown</span> to change her password for the <span className="font-semibold">Plex</span> login
          </Step>,
          <Step number={2}>
            Rotate the password for the <span className="font-semibold">NetSuite</span> login
          </Step>,
          <Step number={3}>
            Create a Watchtower report for Reused passwords
          </Step>,
        ]} />

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
// UNIVERSAL SKELETON
// ===============================

// Universal skeleton body used for all card types
const UniversalSkeleton = () => (
  <div className="overflow-hidden">
    {/* 3 skeleton rows using Row component */}
    <Row icon={null} title="" isLoading />
    <Row icon={null} title="" isLoading />
    <Row icon={null} title="" isLoading />
    {/* Footer with 2 buttons */}
    <div className="flex gap-2 justify-end px-4 py-4">
      <div className="skeleton-shimmer h-[28px] w-[84px] rounded-[8px]" />
      <div className="skeleton-shimmer h-[28px] w-[84px] rounded-[8px]" />
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
          {/* Header - Figma: h-56px, pl-16px, pr-12px, py-4px, gap-8px */}
          <div className="flex items-center justify-between h-[56px] px-[16px] py-1">
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
              
              {/* Title & Subtitle - gap 4px */}
              <div className="flex flex-col leading-[1.2]">
                <TransitionElement
                  isLoading={showSkeleton}
                  skeleton={<div className="skeleton-shimmer h-[10px] w-[114px] rounded-full mb-1" />}
                  delay={0.05}
                >
                  {config && (
                    <h4 
                      className="text-[16px] font-semibold"
                      style={{ color: "rgba(0,0,0,0.82)", letterSpacing: "-0.09px" }}
                    >
                      {config.header.title}
                    </h4>
                  )}
                </TransitionElement>
                <TransitionElement
                  isLoading={showSkeleton}
                  skeleton={<div className="skeleton-shimmer h-[10px] w-[66px] rounded-full" />}
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
            
            {/* Actions - only show when loaded */}
            {!showSkeleton && config?.header.actions && (
              <div className="flex items-center gap-1">{config.header.actions}</div>
            )}
          </div>

          {/* Body */}
          <div className={showSkeleton ? 'overflow-hidden' : ''}>
            <TransitionElement
              isLoading={showSkeleton}
              skeleton={<UniversalSkeleton />}
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
