'use client';

interface HeroClientProps {
  srcSet: string;
  defaultSrc: string;
  blurDataURI: string;
  alt: string;
  overlayClass: string;
}

export function HeroClient({ srcSet, defaultSrc, alt, overlayClass }: HeroClientProps) {
  return (
    <>
      {/* Background image */}
      <div className="absolute inset-0 bg-gray-900">
        <picture>
          <source type="image/webp" srcSet={srcSet} sizes="100vw" />
          <img
            src={defaultSrc}
            alt={alt}
            loading="eager"
            fetchPriority="high"
            decoding="sync"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </picture>
      </div>
      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClass}`} />
    </>
  );
}
