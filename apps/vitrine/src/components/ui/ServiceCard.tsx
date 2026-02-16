import Link from 'next/link';
import { getImage, getSrcSet, getDefaultSrc, type ImageEntry } from '@/lib/images-manifest';

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  imageSlug: string;
}

export function ServiceCard({ title, description, href, imageSlug }: ServiceCardProps) {
  const image = getImage(imageSlug);

  return (
    <Link href={href} className="service-card group block bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
      <div className="aspect-[4/3] overflow-hidden relative">
        {image ? (
          <picture>
            <source
              type="image/webp"
              srcSet={getSrcSet(image)}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
            <img
              src={getDefaultSrc(image, 480)}
              alt={image.alt}
              width={480}
              height={360}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </picture>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200" />
        )}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <span className="inline-flex items-center mt-3 text-primary-600 font-medium text-sm group-hover:gap-2 transition-all">
          En savoir plus
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
