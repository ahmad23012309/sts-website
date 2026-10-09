import type { MetadataRoute } from "next";
import { getVehicles } from "@/lib/cms";
import { orderedCategories } from "@/lib/vehicleDisplay";
import { site } from "@/lib/site";

/**
 * Generated from the content itself, so a new vehicle or category appears in
 * the sitemap without anyone remembering to add it.
 *
 * Only routes that exist are listed. A sitemap that points at pages which are
 * not built yet teaches search engines to distrust it.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const vehicles = await getVehicles();
  const now = new Date();

  const fixed: MetadataRoute.Sitemap = [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/fleet`, changeFrequency: "weekly", priority: 0.9 },
    {
      url: `${site.url}/fare-calculator`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/fuel-prices`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${site.url}/attributions`,
      changeFrequency: "monthly",
      priority: 0.2,
    },
  ];

  const categories: MetadataRoute.Sitemap = orderedCategories
    .filter((category) =>
      vehicles.some((vehicle) => vehicle.category === category),
    )
    .map((category) => ({
      url: `${site.url}/fleet/category/${category}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  const vehiclePages: MetadataRoute.Sitemap = vehicles.map((vehicle) => ({
    url: `${site.url}/fleet/${vehicle.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...fixed, ...categories, ...vehiclePages].map((entry) => ({
    ...entry,
    lastModified: now,
  }));
}
