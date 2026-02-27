import { MetadataRoute } from 'next';
import { services } from '@/lib/services-data';
import { cities, serviceTypes } from '@/lib/cities-data';
import { articles } from '@/lib/blog-data';

const baseUrl = 'https://art-et-jardin.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/services/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/realisations/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Service detail pages
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Main SEO pages (service-angers)
  const mainSeoPages: MetadataRoute.Sitemap = serviceTypes.map((service) => ({
    url: `${baseUrl}/${service.service}-angers/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // City SEO pages (service-city for all cities except Angers)
  const citySeoPages: MetadataRoute.Sitemap = [];
  for (const service of serviceTypes) {
    for (const city of cities) {
      if (city.slug === 'angers') continue; // Skip Angers, handled above
      citySeoPages.push({
        url: `${baseUrl}/${service.service}-${city.slug}/`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      });
    }
  }

  // Blog / Conseils pages
  const blogPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/conseils/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/a-propos/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/conseils/${article.slug}/`,
      lastModified: article.publishDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  // Legal pages (low priority)
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/mentions-legales/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/politique-confidentialite/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cgv/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [...mainPages, ...servicePages, ...mainSeoPages, ...citySeoPages, ...blogPages, ...legalPages];
}
