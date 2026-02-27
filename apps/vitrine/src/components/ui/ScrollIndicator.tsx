'use client';

import { useEffect, useRef } from 'react';

export function ScrollIndicator() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const opacity = Math.max(0, 1 - window.scrollY / 150);
      ref.current.style.opacity = String(opacity);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-opacity hidden lg:flex"
    >
      <svg
        width="26"
        height="40"
        viewBox="0 0 26 40"
        fill="none"
        className="text-white/70"
      >
        <rect
          x="1"
          y="1"
          width="24"
          height="38"
          rx="12"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle
          cx="13"
          cy="12"
          r="2"
          fill="currentColor"
          className="scroll-indicator-dot"
        />
      </svg>
    </div>
  );
}
