import Link from 'next/link';
import { getImage, getSrcSet, getDefaultSrc, type ImageEntry } from '@/lib/images-manifest';
import { IconChevronRight } from '@/lib/icons';

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  imageSlug: string;
  badge?: string;
}

export function ServiceCard({ title, description, href, imageSlug, badge }: ServiceCardProps) {
  const image = getImage(imageSlug);

  return (
    <Link href={href} className="service-card group flex flex-row md:flex-col h-full bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all">
      <div className="w-1/3 md:w-full aspect-square md:aspect-[4/3] overflow-hidden relative shrink-0">
        {badge && (
          <span className="absolute top-2 left-2 z-10 bg-green-600 text-white text-[10px] md:text-xs font-semibold px-2 py-0.5 md:py-1 rounded-full shadow-sm">
            {badge}
          </span>
        )}
        {image ? (
          <picture>
            <source
              type="image/webp"
              srcSet={getSrcSet(image)}
              sizes="(max-width: 768px) 33vw, (max-width: 1024px) 50vw, 25vw"
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
      <div className="p-3 md:p-5 flex flex-col flex-1 justify-center md:justify-start">
        <h3 className="text-base md:text-xl font-semibold mb-1 md:mb-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 text-xs md:text-sm md:flex-grow">{description}</p>
        <span className="inline-flex items-center mt-2 md:mt-3 text-primary-600 font-medium text-xs md:text-sm group-hover:gap-2 transition-all">
          En savoir plus
          <IconChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-1" />
        </span>
      </div>
    </Link>
  );
}
