import { ReactNode, ElementType } from "react";

interface LargeTextProps {
  children: ReactNode;
  className?: string;
  leading?: "tight" | "normal";
  as?: ElementType;
}

export function LargeText({ 
  children, 
  className = "", 
  leading = "tight",
  as: Component = "p"
}: LargeTextProps) {
  const leadingClass = leading === "tight" ? "leading-tight" : "leading-normal";
  
  return (
    <Component className={`text-2xl sm:text-3xl md:text-4xl font-medium text-[var(--foreground)] ${leadingClass} ${className}`}>
      {children}
    </Component>
  );
}
