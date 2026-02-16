import { getImage, getSrcSet, getDefaultSrc } from '@/lib/images-manifest';

interface InlineGalleryProps {
  slugs: string[];
  columns?: 2 | 3;
}

export function InlineGallery({ slugs, columns = 3 }: InlineGalleryProps) {
  const colClass = columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <div className={`grid ${colClass} gap-4 my-8`}>
      {slugs.map((slug) => {
        const image = getImage(slug);
        if (!image) return null;

        return (
          <div key={slug} className="rounded-lg overflow-hidden shadow-sm">
            <picture>
              <source
                type="image/webp"
                srcSet={getSrcSet(image)}
                sizes={columns === 2 ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
              />
              <img
                src={getDefaultSrc(image, 480)}
                alt={image.alt}
                width={480}
                height={360}
                loading="lazy"
                decoding="async"
                className="w-full h-48 md:h-56 object-cover"
                style={{
                  backgroundImage: `url(${image.blurDataURI})`,
                  backgroundSize: 'cover',
                }}
              />
            </picture>
          </div>
        );
      })}
    </div>
  );
}
