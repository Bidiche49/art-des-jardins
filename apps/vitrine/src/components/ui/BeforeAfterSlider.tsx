'use client';

import { useState, useRef, useCallback } from 'react';
import { IconSliderArrows } from '@/lib/icons';

interface BeforeAfterSliderProps {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  title?: string;
  location?: string;
}

export function BeforeAfterSlider({
  before,
  after,
  beforeAlt,
  afterAlt,
  title,
  location,
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const isDragging = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setPosition(percent);
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setPosition((p) => Math.max(0, p - 2));
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      setPosition((p) => Math.min(100, p + 2));
    }
  }, []);

  return (
    <div className="group">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl select-none aspect-[4/3] touch-none shadow-lg group-hover:shadow-xl transition-shadow duration-300"
        role="slider"
        aria-label="Comparer avant et après"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onKeyDown={handleKeyDown}
        style={{ cursor: 'col-resize' }}
      >
        {/* After (full width behind) */}
        <img
          src={after}
          alt={afterAlt}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          loading="lazy"
          draggable={false}
        />

        {/* Before (clipped) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={before}
            alt={beforeAlt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            draggable={false}
          />
        </div>

        {/* Slider line + handle */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-lg z-10 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-xl flex items-center justify-center ring-2 ring-secondary-400/50">
            <IconSliderArrows className="w-5 h-5 text-secondary-600" />
          </div>
        </div>

        {/* Labels */}
        <span className="absolute bottom-3 left-3 bg-primary-800/80 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none tracking-wide uppercase">
          Avant
        </span>
        <span className="absolute bottom-3 right-3 bg-secondary-500/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full pointer-events-none tracking-wide uppercase">
          Après
        </span>
      </div>

      {(title || location) && (
        <div className="mt-4 px-1">
          {title && <p className="font-semibold text-gray-900">{title}</p>}
          {location && (
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
