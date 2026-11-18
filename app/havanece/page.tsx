import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getAllSettings } from "@/lib/settings";
import { getMerch, getReleases } from "@/lib/data";
import ReleaseLanding, { type LandingConfig } from "@/components/site/jad/ReleaseLanding";
import VinylSection from "@/components/site/jad/VinylSection";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";
const TITLE = "Havanece";
const ARTISTS = "Yongolailan";
// Used only if the catalog entry has no cover yet.
const FALLBACK_COVER = "/images/havanece-cover.jpg";

const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]/g, "");

/** The cover is the one set on the catalog entry, so changing it there changes it here. */
async function getCover(): Promise<string> {
  const releases = await getReleases();
  const rel = releases.find((r) => norm(r.title) === "havanece");
  return rel?.coverImage || FALLBACK_COVER;
}

export async function generateMetadata(): Promise<Metadata> {
  let description = "HAVANECE, the album by Yongolailan, on Caribbean Sea Sound.";
  try {
    const s = await getAllSettings();
    if (s["hav.info"]) description = s["hav.info"].replace(/\s+/g, " ").trim();
  } catch {
    /* database unavailable: fall back to the default description */
  }
  const title = `${TITLE} - ${ARTISTS}`;
  const url = `${siteUrl}/havanece`;
  const cover = await getCover();
  const image = cover.startsWith("http") ? cover : `${siteUrl}${cover}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "music.album",
      url,
      title,
      description,
      siteName: "Yongolailan",
      images: [{ url: image, width: 1000, height: 1000, alt: `${TITLE} cover` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function HavanecePage() {
  noStore();
  const [cover, merch] = await Promise.all([getCover(), getMerch()]);
  const vinyl = merch.find((m) => /havanece/i.test(m.title) && /vinyl|vinilo/i.test(m.title));
  const absCover = cover.startsWith("http") ? cover : `${siteUrl}${cover}`;

  const cfg: LandingConfig = {
    prefix: "hav",
    route: "/havanece",
    title: TITLE,
    artists: ARTISTS,
    cover,
    audio: null,
    // The same loop as Just Another Day for now; swap these two paths for the
    // album's own video when it arrives.
    videoWebm: "/video/just-another-day-loop.webm",
    videoMp4: "/video/just-another-day-loop.mp4",
    noun: "album",
    creditLine: "LA MUSIC & CARIBBEAN SEA SOUND © ℗ 2024",
    defaultEyebrow: "The Album",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "MusicAlbum",
      name: TITLE,
      byArtist: { "@type": "MusicGroup", name: ARTISTS },
      image: absCover,
      url: `${siteUrl}/havanece`,
      datePublished: "2024",
      genre: "Afrocuban Jazz Chill-Hop",
      inLanguage: "es",
      publisher: { "@type": "Organization", name: "Caribbean Sea Sound" },
    },
  };

  return <ReleaseLanding cfg={cfg}>{vinyl ? <VinylSection item={vinyl} /> : null}</ReleaseLanding>;
}
