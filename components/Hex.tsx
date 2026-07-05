import { ReactNode } from "react";
import clsx from "clsx";

export function HexBadge({
  children,
  size = 56,
  filled = false,
  className,
}: {
  children: ReactNode;
  size?: number;
  filled?: boolean;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "hex flex items-center justify-center shrink-0",
        filled ? "bg-espresso text-cream" : "bg-white border border-gold/40 text-gold",
        className
      )}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}

export function BeeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <ellipse cx="12" cy="13" rx="4.5" ry="6" fill="currentColor" opacity="0.9" />
      <path
        d="M8 9.5h8M8 12.5h8M8.5 15.5h7"
        stroke="white"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path d="M12 7c-1-2-4-3-5-1.5C6 7 9 8 12 7Z" fill="currentColor" />
      <path d="M12 7c1-2 4-3 5-1.5C18 7 15 8 12 7Z" fill="currentColor" />
      <circle cx="10.3" cy="8.3" r="0.6" fill="white" />
      <circle cx="13.7" cy="8.3" r="0.6" fill="white" />
    </svg>
  );
}
