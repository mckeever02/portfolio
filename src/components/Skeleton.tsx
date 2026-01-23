"use client";

interface SkeletonProps {
  className?: string;
}

/**
 * Base skeleton component with shimmer animation
 */
export function Skeleton({ className = "" }: SkeletonProps) {
  return <div className={`skeleton-shimmer rounded ${className}`} />;
}

/**
 * Rectangular skeleton placeholder
 */
export function SkeletonRect({ className = "" }: SkeletonProps) {
  return <Skeleton className={`rounded-lg ${className}`} />;
}

/**
 * Circular skeleton for avatars
 */
export function SkeletonCircle({ className = "" }: SkeletonProps) {
  return <Skeleton className={`rounded-full ${className}`} />;
}

/**
 * Text line skeleton
 */
export function SkeletonLine({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-4 ${className}`} />;
}

/**
 * Pill/tag skeleton
 */
export function SkeletonPill({ className = "" }: SkeletonProps) {
  return <Skeleton className={`h-6 rounded-full ${className}`} />;
}

/**
 * Avatar with text skeleton combo
 */
export function SkeletonAvatar({ 
  className = "",
  size = "md" 
}: SkeletonProps & { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <SkeletonCircle className={sizeClasses[size]} />
      <div className="space-y-2 flex-1">
        <SkeletonLine className="h-4 w-24" />
        <SkeletonLine className="h-3 w-32" />
      </div>
    </div>
  );
}

/**
 * Card header skeleton with icon, title, and actions
 */
export function SkeletonCardHeader({ className = "" }: SkeletonProps) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex items-center gap-3">
        <SkeletonRect className="w-8 h-8" />
        <div className="space-y-1.5">
          <SkeletonLine className="h-4 w-20" />
          <SkeletonLine className="h-3 w-28" />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <SkeletonRect className="w-5 h-5" />
        <SkeletonRect className="w-5 h-5" />
      </div>
    </div>
  );
}

/**
 * List row skeleton with icon and two lines of text
 */
export function SkeletonListRow({ className = "" }: SkeletonProps) {
  return (
    <div className={`flex items-center gap-2 py-1 ${className}`}>
      <SkeletonRect className="w-6 h-6 shrink-0" />
      <div className="space-y-1 flex-1 min-w-0">
        <SkeletonLine className="h-3.5 w-24" />
        <SkeletonLine className="h-3 w-36" />
      </div>
    </div>
  );
}

/**
 * Section title skeleton
 */
export function SkeletonSectionTitle({ className = "" }: SkeletonProps) {
  return <SkeletonLine className={`h-3 w-20 ${className}`} />;
}

/**
 * Button skeleton
 */
export function SkeletonButton({ className = "" }: SkeletonProps) {
  return <SkeletonRect className={`h-7 w-20 ${className}`} />;
}

/**
 * Step indicator skeleton (numbered circle with text)
 */
export function SkeletonStep({ className = "" }: SkeletonProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SkeletonCircle className="w-6 h-6 shrink-0" />
      <div className="space-y-1 flex-1">
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-3/4" />
      </div>
    </div>
  );
}
