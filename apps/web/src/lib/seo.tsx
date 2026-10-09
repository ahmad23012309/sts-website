import type { Metadata } from "next";
import { site } from "@/lib/site";

export function buildMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
}): Metadata {
  const url = new URL(path, site.url).toString();

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      siteName: site.name,
      title,
      description,
      url,
      locale: site.locale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * Organisation and local business markup.
 *
 * This is what places the company in local search results and map packs, so the
 * address and telephone values must be the real ones before launch.
 */
export function organizationJsonLd() {
  const sameAs = Object.values(site.social).filter((url) => url.length > 0);

  return {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": `${site.url}#organization`,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: site.url,
    telephone: site.contact.phone,
    email: site.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.addressLine,
      addressLocality: site.contact.city,
      addressCountry: "PK",
    },
    areaServed: site.cities.map((city) => ({
      "@type": "City",
      name: city,
    })),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}#website`,
    name: site.name,
    url: site.url,
    publisher: { "@id": `${site.url}#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: new URL(item.path, site.url).toString(),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * Product and offer markup for a vehicle.
 *
 * priceValidUntil is deliberately short: the with-fuel rate is tied to the
 * notified fuel price, which moves, and a stale price in search results is
 * worse than none.
 */
export function vehicleJsonLd(vehicle: {
  name: string;
  description: string;
  path: string;
  make: string;
  model: string;
  price: number;
  image?: string;
}) {
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 14);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: vehicle.name,
    description: vehicle.description,
    brand: { "@type": "Brand", name: vehicle.make },
    model: vehicle.model,
    ...(vehicle.image ? { image: vehicle.image } : {}),
    offers: {
      "@type": "Offer",
      url: new URL(vehicle.path, site.url).toString(),
      priceCurrency: "PKR",
      price: vehicle.price,
      priceValidUntil: validUntil.toISOString().slice(0, 10),
      availability: "https://schema.org/InStock",
      seller: { "@id": `${site.url}#organization` },
    },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
