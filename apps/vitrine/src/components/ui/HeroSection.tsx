import { type ImageEntry, getImage, getSrcSet, getDefaultSrc } from '@/lib/images-manifest';
import { HeroClient } from './HeroClient';
import { ScrollIndicator } from './ScrollIndicator';

interface HeroSectionProps {
  imageSlug: string;
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
  overlay?: 'default' | 'strong' | 'light';
  fullHeight?: boolean;
}

export function HeroSection({
  imageSlug,
  title,
  subtitle,
  breadcrumbs,
  children,
  overlay = 'default',
  fullHeight = false,
}: HeroSectionProps) {
  const image = getImage(imageSlug);
  if (!image) {
    // Fallback to gradient if image not found
    return (
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 lg:py-24">
        <div className="container-custom">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{title}</h1>
          {subtitle && <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl">{subtitle}</p>}
          {children}
        </div>
      </section>
    );
  }

  const srcSet = getSrcSet(image);
  const defaultSrc = getDefaultSrc(image, 1920);

  const overlayClass = {
    default: 'hero-overlay',
    strong: 'hero-overlay-strong',
    light: 'hero-overlay-light',
  }[overlay];

  return (
    <section className={`hero-section relative text-white min-h-[500px] flex items-center ${fullHeight ? 'lg:flex-1' : 'lg:min-h-[700px]'}`}>
      {/* Preload hero image for better LCP */}
      <link rel="preload" as="image" type="image/webp" imageSrcSet={srcSet} imageSizes="100vw" />
      <HeroClient
        srcSet={srcSet}
        defaultSrc={defaultSrc}
        blurDataURI={image.blurDataURI}
        alt={image.alt}
        overlayClass={overlayClass}
      />
      <div className="container-custom relative z-10 py-16 lg:py-24">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        <div className="w-16 h-1 bg-secondary-500 rounded-full mb-6" />
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 hero-text-shadow">{title}</h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl hero-text-shadow-subtle">{subtitle}</p>
        )}
        {children}
      </div>
      {fullHeight && <ScrollIndicator />}
    </section>
  );
}

function BreadcrumbSchema({ items }: { items: { label: string; href?: string }[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => {
      const entry: Record<string, unknown> = {
        '@type': 'ListItem',
        position: i + 1,
        name: item.label,
      };
      if (item.href) {
        entry.item = `https://art-et-jardin.fr${item.href}`;
      }
      return entry;
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <>
      <BreadcrumbSchema items={items} />
      <nav className="text-white/70 text-sm mb-4" aria-label="Breadcrumb">
        {items.map((item, i) => (
          <span key={i}>
            {i > 0 && <span className="mx-2">/</span>}
            {item.href ? (
              <a href={item.href} className="hover:text-white transition-colors">
                {item.label}
              </a>
            ) : (
              <span className="text-white">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
