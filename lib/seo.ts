import type { Award, Link as SiteLink, Release } from "@prisma/client";
import type { Settings } from "./settings";

/**
 * Structured data for the home page.
 *
 * The point of this is entity recognition: when someone searches "Yongolailan"
 * or "Caribbean Sea Sound", Google has to be sure this site *is* that artist
 * and that label rather than a page merely mentioning them. `sameAs` is the
 * strongest signal available — it ties this domain to the profiles Google has
 * already indexed (Spotify, Instagram, YouTube…), so only real URLs go in.
 */

const REAL_URL = /^https?:\/\/.+\..+/i;

export function sameAsFrom(links: SiteLink[]): string[] {
  const seen = new Set<string>();
  for (const l of links) {
    const url = (l.url || "").trim();
    if (REAL_URL.test(url)) seen.add(url);
  }
  return [...seen];
}

export function homeJsonLd({
  siteUrl,
  settings,
  links,
  releases,
  awards,
}: {
  siteUrl: string;
  settings: Settings;
  links: SiteLink[];
  releases: Release[];
  awards: Award[];
}) {
  const name = settings["hero.name"] || "Yongolailan";
  const labelName = settings["label.name"] || "Caribbean Sea Sound";
  const labelLocation = settings["label.location"] || "Brooklyn, New York";
  const sameAs = sameAsFrom(links);
  const image = settings["site.ogImage"] || settings["hero.image"] || "";
  const absoluteImage = image.startsWith("http") ? image : image ? `${siteUrl}${image}` : undefined;

  const artist = {
    "@type": "MusicGroup",
    "@id": `${siteUrl}/#artist`,
    name,
    alternateName: "Yongo",
    url: siteUrl,
    ...(absoluteImage ? { image: absoluteImage } : {}),
    description: settings["about.p1"] || undefined,
    genre: ["Afro-Cuban House", "Latin Afrobeat", "Electronic", "Caribbean"],
    foundingLocation: { "@type": "Place", name: "Cuba" },
    location: { "@type": "Place", name: "New York City, USA" },
    ...(sameAs.length ? { sameAs } : {}),
    ...(awards.length
      ? { award: awards.map((a) => [a.title, a.year].filter(Boolean).join(" ")) }
      : {}),
    ...(releases.length
      ? {
          album: releases.slice(0, 20).map((r) => ({
            "@type": r.releaseType === "Album" ? "MusicAlbum" : "MusicRelease",
            name: r.title,
            ...(r.year ? { datePublished: r.year } : {}),
            byArtist: { "@id": `${siteUrl}/#artist` },
          })),
        }
      : {}),
    memberOf: { "@id": `${siteUrl}/#label` },
  };

  const label = {
    "@type": "Organization",
    "@id": `${siteUrl}/#label`,
    name: labelName,
    alternateName: "Caribbean Sea Sound Records",
    url: `${siteUrl}/caribbean-sea-sound`,
    description: settings["label.intro"] || undefined,
    foundingLocation: { "@type": "Place", name: labelLocation },
    founder: { "@id": `${siteUrl}/#artist` },
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name,
    inLanguage: "en",
    publisher: { "@id": `${siteUrl}/#artist` },
  };

  return { "@context": "https://schema.org", "@graph": [artist, label, website] };
}
