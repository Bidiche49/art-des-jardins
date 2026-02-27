'use client';

import { useEffect, useRef, useState } from 'react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 16, suffix: ' ans', label: 'D\'expérience cumulée' },
  { value: 30, suffix: ' km', label: 'Zone d\'intervention' },
  { value: 100, suffix: '%', label: 'Assuré RC Pro & décennale' },
  { value: 48, suffix: 'h', label: 'Devis gratuit sous' },
];

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, isVisible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    let raf: number;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, isVisible, duration]);

  return count;
}

function StatItem({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
  const count = useCountUp(stat.value, isVisible);

  return (
    <div className="text-center">
      <div className="font-serif text-5xl md:text-6xl font-bold text-secondary-400 mb-2">
        {count}
        <span className="text-4xl md:text-5xl">{stat.suffix}</span>
      </div>
      <div className="text-white/80 text-sm md:text-base font-sans">{stat.label}</div>
    </div>
  );
}

export function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-16 lg:py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-primary-800" />
      <img src="/images/realisations/entretien-2-1200w.webp" alt="" loading="lazy" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      <div className="absolute inset-0 bg-primary-900/60" />

      {/* Content */}
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <div className="flex-1">
                <StatItem stat={stat} isVisible={isVisible} />
              </div>
              {i < stats.length - 1 && (
                <div className="hidden md:block w-px h-16 bg-white/20 ml-6" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
