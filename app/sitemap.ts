import type { MetadataRoute } from "next";
import { getLabelArtistSlugs } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";
  const now = new Date();

  const artistSlugs = await getLabelArtistSlugs();

  return [
    { url: site, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${site}/caribbean-sea-sound`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...artistSlugs.map((slug) => ({
      url: `${site}/caribbean-sea-sound/artists/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
