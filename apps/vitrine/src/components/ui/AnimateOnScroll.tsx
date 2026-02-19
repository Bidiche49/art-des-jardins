'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface AnimateOnScrollProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left';
  delay?: number;
  className?: string;
}

export function AnimateOnScroll({
  children,
  animation = 'fade-up',
  delay = 0,
  className = '',
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback: ensure visibility after max delay + buffer
    const fallbackTimer = setTimeout(() => {
      el.classList.add('is-visible');
    }, delay + 1500);

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-visible');
      clearTimeout(fallbackTimer);
      return () => {};
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add('is-visible');
          }, delay);
          observer.unobserve(el);
          clearTimeout(fallbackTimer);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, [delay]);

  return (
    <div ref={ref} className={`animate-on-scroll animate-${animation} ${className}`}>
      {children}
    </div>
  );
}
