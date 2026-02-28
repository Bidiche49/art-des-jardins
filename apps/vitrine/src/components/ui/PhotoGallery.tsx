'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { type ImageEntry, images, categories, getSrcSet, getDefaultSrc } from '@/lib/images-manifest';
import { IconClose, IconChevronLeft, IconChevronRight } from '@/lib/icons';

interface PhotoGalleryProps {
  maxItems?: number;
  showFilters?: boolean;
  initialCategory?: string;
  excludeSlugs?: string[];
}

const categoryLabels: Record<string, string> = {
  creation: 'Creation',
  elagage: 'Elagage',
  entretien: 'Entretien',
  terrasse: 'Terrasse',
  cloture: 'Cloture',
  arrosage: 'Arrosage',
};

export function PhotoGallery({ maxItems, showFilters = true, initialCategory, excludeSlugs }: PhotoGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const allImages = Object.values(images);
  const excluded = excludeSlugs
    ? allImages.filter((img) => !excludeSlugs.includes(img.slug))
    : allImages;
  const filtered = activeCategory
    ? excluded.filter((img) => img.category === activeCategory)
    : excluded;
  const displayed = maxItems ? filtered.slice(0, maxItems) : filtered;

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const navigate = useCallback(
    (direction: 1 | -1) => {
      if (lightboxIndex === null) return;
      const newIndex = (lightboxIndex + direction + displayed.length) % displayed.length;
      setLightboxIndex(newIndex);
    },
    [lightboxIndex, displayed.length]
  );

  useEffect(() => {
    if (lightboxIndex !== null) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [lightboxIndex]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [lightboxIndex, navigate, closeLightbox]);

  return (
    <div>
      {/* Filters */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tout
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {/* Gallery Grid */}
      <div className={`gallery-masonry${displayed.length <= 3 ? ' gallery-max-2' : displayed.length <= 6 ? ' gallery-max-3' : ''}`}>
        {displayed.map((image, index) => (
          <button
            key={image.slug}
            onClick={() => openLightbox(index)}
            className="gallery-item group cursor-pointer overflow-hidden rounded-lg mb-4 break-inside-avoid"
          >
            <div className="relative overflow-hidden rounded-lg">
              <picture>
                <source
                  type="image/webp"
                  srcSet={getSrcSet(image)}
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
                <img
                  src={getDefaultSrc(image, 480)}
                  alt={image.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${image.blurDataURI})`,
                    backgroundSize: 'cover',
                  }}
                />
              </picture>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <dialog
        ref={dialogRef}
        className="lightbox-dialog"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeLightbox();
        }}
      >
        {lightboxIndex !== null && displayed[lightboxIndex] && (
          <div className="lightbox-content">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-10 text-white/80 hover:text-white bg-black/50 rounded-full p-2"
              aria-label="Fermer"
            >
              <IconClose className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-black/50 rounded-full p-2"
              aria-label="Photo precedente"
            >
              <IconChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigate(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white/80 hover:text-white bg-black/50 rounded-full p-2"
              aria-label="Photo suivante"
            >
              <IconChevronRight className="w-6 h-6" />
            </button>
            <picture>
              <source
                type="image/webp"
                srcSet={getSrcSet(displayed[lightboxIndex])}
                sizes="90vw"
              />
              <img
                src={getDefaultSrc(displayed[lightboxIndex], 1200)}
                alt={displayed[lightboxIndex].alt}
                className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg"
              />
            </picture>
            <p className="text-white/50 text-center mt-4 text-sm">
              {lightboxIndex + 1} / {displayed.length}
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
}
