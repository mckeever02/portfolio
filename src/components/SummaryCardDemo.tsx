"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, useTransform } from "framer-motion";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

// ===============================
// TEXT TYPE COMPONENT (from React Bits https://github.com/davidhdev/react-bits)
// ===============================

interface TextTypeProps {
  text: string;
  className?: string;
  showCursor?: boolean;
  cursorCharacter?: string;
  typingSpeed?: number;
  initialDelay?: number;
  onComplete?: () => void;
}

function TextType({
  text,
  className = '',
  showCursor = false,
  cursorCharacter = '|',
  typingSpeed = 30,
  initialDelay = 0,
  onComplete,
}: TextTypeProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayedText('');
    setCurrentCharIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (isComplete) return;

    let timeout: ReturnType<typeof setTimeout>;

    if (currentCharIndex < text.length) {
      const delay = currentCharIndex === 0 ? initialDelay : typingSpeed;
      timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentCharIndex]);
        setCurrentCharIndex(prev => prev + 1);
      }, delay);
    } else if (currentCharIndex === text.length && text.length > 0) {
      setIsComplete(true);
      onComplete?.();
    }

    return () => clearTimeout(timeout);
  }, [currentCharIndex, text, typingSpeed, initialDelay, isComplete, onComplete]);

  return (
    <span className={`inline ${className}`}>
      <span>{displayedText}</span>
      {showCursor && !isComplete && (
        <span 
          className="ml-0.5 inline-block animate-pulse"
          style={{ animationDuration: '0.7s' }}
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  );
}

type CardType = "skeleton" | "item-list" | "item-sharing" | "watchtower" | "task";

// ===============================
// CHAT TYPES & DATA
// ===============================

type MessageRole = "user" | "agent";

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  cardType?: Exclude<CardType, "skeleton">;
}

interface ConversationTemplate {
  question: string;
  response: string;
  cardType: Exclude<CardType, "skeleton">;
}

const conversationTemplates: ConversationTemplate[] = [
  {
    question: "Which items are in the Finance vault?",
    response: "Here are the 4 items in your Finance vault:",
    cardType: "item-list",
  },
  {
    question: "Who is NetSuite shared with?",
    response: "NetSuite is shared with 6 people. Here's who has access:",
    cardType: "item-sharing",
  },
  {
    question: "Was Plex involved in a breach recently?",
    response: "Yes, Plex was involved in a data breach in August 2022. Here's the Watchtower report:",
    cardType: "watchtower",
  },
  {
    question: "Rotate the NetSuite password and notify affected users",
    response: "I can help with that. Here's what I'll do:",
    cardType: "task",
  },
];

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
// CHAT UI COMPONENTS
// ===============================

// Sentinel icon SVG
function SentinelIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#sentinel-clip)">
        <path d="M0 8C0 7.55817 0.358172 7.2 0.8 7.2H3.508C3.99291 7.2 4.47307 7.10448 4.92105 6.91889C5.36904 6.7333 5.77608 6.46127 6.11892 6.11836C6.46177 5.77544 6.7337 5.36834 6.91919 4.92031C7.10469 4.47229 7.20011 3.99211 7.2 3.5072V0.799999C7.2 0.358172 7.55817 0 8 0C8.44183 0 8.8 0.358172 8.8 0.8V3.5072C8.7999 3.99217 8.89534 4.47242 9.08088 4.9205C9.26643 5.36858 9.53843 5.77571 9.88136 6.11864C10.2243 6.46157 10.6314 6.73357 11.0795 6.91912C11.5276 7.10466 12.0078 7.20011 12.4928 7.2H15.2C15.6418 7.2 16 7.55817 16 8C16 8.44183 15.6418 8.8 15.2 8.8H12.4928C12.0079 8.7999 11.5277 8.89531 11.0797 9.08081C10.6317 9.2663 10.2246 9.53823 9.88164 9.88108C9.53873 10.2239 9.2667 10.631 9.08111 11.0789C8.89552 11.5269 8.8 12.0071 8.8 12.492V15.2C8.8 15.6418 8.44183 16 8 16C7.55817 16 7.2 15.6418 7.2 15.2V12.492C7.2 11.5128 6.81102 10.5737 6.11864 9.88136C5.42625 9.18898 4.48718 8.8 3.508 8.8H0.799999C0.358171 8.8 0 8.44183 0 8Z" fill="black"/>
        <path d="M2.16525 13.8345C1.85286 13.5221 1.85286 13.0157 2.16525 12.7033L3.86245 11.0061C4.17499 10.6935 4.68174 10.6936 4.99417 11.0063C5.30647 11.3188 5.30635 11.8253 4.99389 12.1377L3.29645 13.8346C2.98404 14.1469 2.47761 14.1469 2.16525 13.8345ZM13.834 2.1657C13.5216 1.85333 13.0152 1.85333 12.7028 2.1657L11.0052 3.8633C10.6928 4.17567 10.6928 4.68213 11.0052 4.9945C11.3176 5.30687 11.824 5.30687 12.1364 4.9945L13.834 3.2969C14.1464 2.98453 14.1464 2.47807 13.834 2.1657ZM2.16517 2.16574C2.47756 1.85334 2.98406 1.85334 3.29645 2.16574L4.99365 3.86294C5.30619 4.17548 5.3061 4.68223 4.99345 4.99466C4.68093 5.30696 4.17442 5.30684 3.86205 4.99438L2.16509 3.29694C1.85277 2.98453 1.85281 2.4781 2.16517 2.16574ZM13.834 13.8345C14.1464 13.5221 14.1464 13.0156 13.8341 12.7032L12.1375 11.0062C11.825 10.6936 11.3182 10.6935 11.0056 11.0061C10.693 11.3187 10.6931 11.8255 11.0057 12.138L12.7027 13.8346C13.0152 14.1469 13.5216 14.1469 13.834 13.8345Z" fill="black"/>
      </g>
      <defs>
        <clipPath id="sentinel-clip">
          <rect width="16" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}

// Shiny text component from React Bits (https://github.com/davidhdev/react-bits)
interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
}

function ShinyText({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#000000',
  spread = 120,
}: ShinyTextProps) {
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  const animationDuration = speed * 1000;

  useAnimationFrame(time => {
    if (disabled) {
      lastTimeRef.current = null;
      return;
    }

    if (lastTimeRef.current === null) {
      lastTimeRef.current = time;
      return;
    }

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    elapsedRef.current += deltaTime;

    const cycleTime = elapsedRef.current % animationDuration;
    const p = (cycleTime / animationDuration) * 100;
    progress.set(p);
  });

  const backgroundPosition = useTransform(progress, p => `${150 - p * 2}% center`);

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  return (
    <motion.span
      className={`inline-block ${className}`}
      style={{ ...gradientStyle, backgroundPosition }}
    >
      {text}
    </motion.span>
  );
}

// Typing indicator with spinning Sentinel icon
function TypingIndicator() {
  return (
    <div className={`flex items-center gap-2 py-3 ${inter.className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <SentinelIcon size={16} />
      </motion.div>
      <ShinyText 
        text="thinking..." 
        className="text-[16px] leading-normal"
        color="rgba(0,0,0,0.4)"
        shineColor="rgba(0,0,0,1)"
        speed={1.2}
        spread={90}
      />
    </div>
  );
}

// User message bubble - white background, black text
function UserBubble({ content }: { content: string }) {
  return (
    <div 
      className={`bg-black/5 px-3 py-3 rounded-[12px] text-[16px] leading-normal ${inter.className}`}
      style={{ color: "black" }}
    >
      {content}
    </div>
  );
}

// Agent message - plain text with optional card
function AgentBubble({ 
  content, 
  cardType,
  isCardLoading,
}: { 
  content: string; 
  cardType?: Exclude<CardType, "skeleton">;
  isCardLoading?: boolean;
}) {
  const config = cardType ? cardConfigs[cardType] : null;
  const [textComplete, setTextComplete] = useState(false);
  // Show skeleton while card is loading OR while text is still typing
  const showSkeleton = isCardLoading || !config || !textComplete;

  // Memoize callback to prevent TextType re-renders
  const handleTextComplete = useCallback(() => {
    setTextComplete(true);
  }, []);

  // Reset text complete when content changes
  useEffect(() => {
    setTextComplete(false);
  }, [content]);

  return (
    <div className="flex flex-col">
      {/* Typed text response */}
      <p 
        className={`text-[16px] leading-normal py-3 ${inter.className}`}
        style={{ color: "black" }}
      >
        <TextType 
          text={content}
          typingSpeed={12}
          showCursor={false}
          onComplete={handleTextComplete}
        />
      </p>
      
      {/* Summary card - shows loading state immediately, content after text completes */}
      {cardType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <CardWrapper>
            {/* Header */}
            <div className="flex items-center justify-between h-[56px] px-[16px] py-1">
              <div className="flex items-center gap-3">
                <TransitionElement
                  isLoading={showSkeleton}
                  skeleton={<SkeletonBox className="w-8 h-8 rounded-[8px]" />}
                  delay={0}
                >
                  {config && (
                    <div className="w-8 h-8 rounded-[8px] overflow-hidden shrink-0">
                      {config.header.icon}
                    </div>
                  )}
                </TransitionElement>
                
                <div className="flex flex-col leading-[1.2]">
                  <TransitionElement
                    isLoading={showSkeleton}
                    skeleton={<div className="skeleton-shimmer h-[10px] w-[114px] rounded-full mb-1" />}
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
        </motion.div>
      )}
    </div>
  );
}

// Chat header with countdown progress ring (CSS transition based)
function ChatHeader({ 
  cycleKey,
  totalDuration,
  isActive,
}: { 
  cycleKey: number;
  totalDuration: number;
  isActive: boolean;
}) {
  const size = 32;
  const strokeWidth = 1;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  
  // When active, animate from 0 to 100% over totalDuration
  // cycleKey forces remount to reset the animation
  const strokeDashoffset = isActive ? 0 : circumference;

  return (
    <div className="flex items-center justify-center py-6">
      {/* Sentinel icon in circle with progress ring */}
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {/* Progress ring SVG - key forces remount on new cycle */}
        <svg
          key={cycleKey}
          className="absolute inset-0 -rotate-90"
          width={size}
          height={size}
        >
          {/* Background circle (light) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-black/20"
          />
          {/* Progress circle (dark, fills up over time) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-black"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
              transition: isActive ? `stroke-dashoffset ${totalDuration}ms linear` : 'none',
            }}
          />
        </svg>
        {/* Icon */}
        <SentinelIcon size={16} />
      </div>
    </div>
  );
}

// ===============================
// MAIN COMPONENT
// ===============================

export function SummaryCardDemo() {
  // Cycle through conversation templates
  const [currentIndex, setCurrentIndex] = useState(0);
  const template = conversationTemplates[currentIndex];
  
  // Conversation state
  const [showAgentResponse, setShowAgentResponse] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isCardLoading, setIsCardLoading] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  
  // Progress ring state
  const [cycleKey, setCycleKey] = useState(0);
  const [isProgressActive, setIsProgressActive] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Timing constants
  const INITIAL_DELAY = 1200;
  const TYPING_DURATION = 3500;
  const CARD_LOADING_DURATION = 1500;
  const DISPLAY_DURATION = 4000;
  const FADE_OUT_DURATION = 350;
  
  // Total cycle duration (for progress ring)
  const TOTAL_CYCLE_DURATION = INITIAL_DELAY + TYPING_DURATION + CARD_LOADING_DURATION + DISPLAY_DURATION + FADE_OUT_DURATION;

  // Function to start a conversation animation
  const startConversation = () => {
    // Increment cycle key to remount progress ring, then activate it
    setCycleKey(prev => prev + 1);
    // Small delay to ensure SVG remounts before starting animation
    requestAnimationFrame(() => {
      setIsProgressActive(true);
    });
    
    // Start typing indicator after initial delay
    setTimeout(() => {
      setIsTyping(true);
      
      // After typing delay, show agent response with loading card
      setTimeout(() => {
        setIsTyping(false);
        setShowAgentResponse(true);
        setIsCardLoading(true);
        
        // After another delay, finish loading the card
        setTimeout(() => {
          setIsCardLoading(false);
          
          // After displaying the complete card, wait then cycle to next
          setTimeout(() => {
            // Fade out entire conversation
            setIsExiting(true);
            
            // After fade out, swap content and fade in
            setTimeout(() => {
              // Reset progress
              setIsProgressActive(false);
              
              setShowAgentResponse(false);
              setCurrentIndex((prev) => (prev + 1) % conversationTemplates.length);
              setIsExiting(false);
              
              // Start next conversation
              startConversation();
            }, FADE_OUT_DURATION);
          }, DISPLAY_DURATION);
        }, CARD_LOADING_DURATION);
      }, TYPING_DURATION);
    }, INITIAL_DELAY);
  };

  // Trigger first conversation when component enters viewport
  useEffect(() => {
    if (hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true);
          startConversation();
        }
      },
      { threshold: 0.3 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasTriggered]);


  return (
    <div 
      ref={containerRef}
      className="w-full p-6 md:p-10 min-h-screen md:min-h-[calc(100vh-100px)]"
      style={{ 
        backgroundImage: "url('/images/work/sentinel/agent-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        transform: "translateZ(0)",
      }}
    >
      {/* Outer blur wrapper */}
      <div 
        className="rounded-[16px] p-2 backdrop-blur-md border border-white/30"
        style={{ 
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          maxWidth: "416px",
          margin: "0 auto",
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      >
        {/* Inner white container */}
        <div 
          className="rounded-[12px] overflow-hidden flex flex-col bg-white"
        >
      {/* Chat header with countdown */}
      <ChatHeader 
        cycleKey={cycleKey} 
        totalDuration={TOTAL_CYCLE_DURATION} 
        isActive={isProgressActive} 
      />

      {/* Messages area */}
      <motion.div 
        className="px-4 pb-6 flex flex-col gap-3"
        style={{ minHeight: "500px", transform: "translateZ(0)" }}
        animate={{ 
          opacity: isExiting ? 0 : 1,
          y: isExiting ? -10 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* User message */}
        <UserBubble content={template.question} />

        {/* Typing indicator OR Agent response - one at a time */}
        <AnimatePresence mode="wait">
          {isTyping && (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
          {showAgentResponse && (
            <motion.div
              key={`response-${currentIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              <AgentBubble 
                content={template.response} 
                cardType={template.cardType}
                isCardLoading={isCardLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
        </div>
      </div>
    </div>
  );
}
