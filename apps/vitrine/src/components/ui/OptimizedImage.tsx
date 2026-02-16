'use client';

import { useState, useCallback } from 'react';
import { type ImageEntry, getSrcSet, getDefaultSrc } from '@/lib/images-manifest';

interface OptimizedImageProps {
  image: ImageEntry;
  alt?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  aspectRatio?: string;
}

export function OptimizedImage({
  image,
  alt,
  sizes,
  className = '',
  priority = false,
  aspectRatio,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const srcSet = getSrcSet(image);
  const defaultSrc = getDefaultSrc(image, 800);

  // Get dimensions from the largest available size for aspect ratio
  const sizeEntries = Object.values(image.sizes);
  const largest = sizeEntries[sizeEntries.length - 1];

  return (
    <div
      className={`optimized-image-wrapper ${loaded ? 'is-loaded' : ''} ${className}`}
      style={{
        backgroundImage: `url(${image.blurDataURI})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        aspectRatio: aspectRatio || `${largest.width} / ${largest.height}`,
      }}
    >
      <picture>
        <source type="image/webp" srcSet={srcSet} sizes={sizes} />
        <img
          src={defaultSrc}
          alt={alt || image.alt}
          width={largest.width}
          height={largest.height}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : undefined}
          onLoad={handleLoad}
          className="optimized-image"
          style={{ aspectRatio: aspectRatio || `${largest.width} / ${largest.height}` }}
        />
      </picture>
    </div>
  );
}
