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

  // Keyboard accessibility
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
    <div>
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-xl select-none aspect-[4/3] touch-none"
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
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-10 pointer-events-none"
          style={{ left: `${position}%` }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <IconSliderArrows className="w-5 h-5 text-gray-700" />
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded pointer-events-none">
          Avant
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded pointer-events-none">
          Après
        </div>
      </div>

      {(title || location) && (
        <div className="mt-3">
          {title && <p className="font-medium text-gray-900">{title}</p>}
          {location && <p className="text-sm text-gray-500">{location}</p>}
        </div>
      )}
    </div>
  );
}
