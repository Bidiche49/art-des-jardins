import Script from 'next/script';

/**
 * Analytics component using Plausible Analytics (RGPD-friendly, no cookies)
 *
 * To use:
 * 1. Create an account at https://plausible.io (paid) or self-host
 * 2. Add your domain to Plausible
 * 3. Set NEXT_PUBLIC_PLAUSIBLE_DOMAIN in .env
 *
 * Alternative: Umami (self-hosted, free)
 * - https://umami.is
 * - Set NEXT_PUBLIC_UMAMI_WEBSITE_ID and NEXT_PUBLIC_UMAMI_URL in .env
 */

interface AnalyticsProps {
  plausibleDomain?: string;
  umamiWebsiteId?: string;
  umamiUrl?: string;
}

export function Analytics({
  plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN,
  umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
  umamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL,
}: AnalyticsProps) {
  // Don't render analytics in development
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  // Plausible Analytics
  if (plausibleDomain) {
    return (
      <Script
        defer
        data-domain={plausibleDomain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    );
  }

  // Umami Analytics (self-hosted alternative)
  if (umamiWebsiteId && umamiUrl) {
    return (
      <Script
        defer
        data-website-id={umamiWebsiteId}
        src={`${umamiUrl}/script.js`}
        strategy="afterInteractive"
      />
    );
  }

  // No analytics configured
  return null;
}

/**
 * Track custom events with Plausible
 * Usage: trackEvent('Contact Form Submitted', { service: 'paysagisme' })
 */
export function trackEvent(eventName: string, props?: Record<string, string | number | boolean>) {
  if (typeof window !== 'undefined' && (window as unknown as { plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void }).plausible) {
    (window as unknown as { plausible: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void }).plausible(eventName, { props });
  }
}
