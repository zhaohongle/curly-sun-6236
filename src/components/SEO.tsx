import { type ReactNode } from 'react';
import { siteConfig } from '@/config';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  children?: ReactNode;
}

/**
 * SEO component — injects meta tags, Open Graph, and structured data.
 * Renders children as-is (transparent wrapper).
 */
export function SEO({
  title,
  description,
  image,
  children,
}: SEOProps): ReactNode {
  const fullTitle = title ? `${title} — ${siteConfig.name}` : siteConfig.title;
  const desc = description ?? siteConfig.description;
  const imgUrl = image ?? `${siteConfig.url}/og-image.jpg`;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:image" content={imgUrl} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <link rel="canonical" href={siteConfig.url} />
      {children}
    </>
  );
}
