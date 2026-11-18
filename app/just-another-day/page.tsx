import type { Metadata } from "next";
import { getAllSettings } from "@/lib/settings";
import ReleaseLanding, { type LandingConfig } from "@/components/site/jad/ReleaseLanding";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";
const COVER = "/images/just-another-day-cover.jpg";
const TITLE = "Just Another Day";
const ARTISTS = "Arema Arega & Yongolailan";

const CONFIG: LandingConfig = {
  prefix: "jad",
  route: "/just-another-day",
  title: TITLE,
  artists: ARTISTS,
  cover: COVER,
  audio: "/audio/just-another-day.mp3",
  videoWebm: "/video/just-another-day-loop.webm",
  videoMp4: "/video/just-another-day-loop.mp4",
  noun: "song",
  creditLine: "CARIBBEAN SEA SOUND & AREMA AREGA © ℗ 2026",
  defaultEyebrow: "New Single",
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: TITLE,
    byArtist: [
      { "@type": "MusicGroup", name: "Arema Arega" },
      { "@type": "MusicGroup", name: "Yongolailan" },
    ],
    image: `${siteUrl}${COVER}`,
    url: `${siteUrl}/just-another-day`,
    inLanguage: "en",
    recordingOf: { "@type": "MusicComposition", name: TITLE },
    publisher: { "@type": "Organization", name: "Caribbean Sea Sound" },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  let description = "The new single from Arema Arega & Yongolailan, out now on Caribbean Sea Sound.";
  try {
    const s = await getAllSettings();
    if (s["jad.info"]) description = s["jad.info"].replace(/\s+/g, " ").trim();
  } catch {
    /* database unavailable — fall back to the default description */
  }
  const title = `${TITLE} - ${ARTISTS}`;
  const url = `${siteUrl}/just-another-day`;
  const image = `${siteUrl}${COVER}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "music.song",
      url,
      title,
      description,
      siteName: "Yongolailan",
      images: [{ url: image, width: 1500, height: 1500, alt: `${TITLE} cover` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default function JustAnotherDayPage() {
  return <ReleaseLanding cfg={CONFIG} />;
}
