import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getAllSettings } from "@/lib/settings";
import AudioPlayer from "@/components/site/AudioPlayer";
import PlatformIcon from "@/components/site/PlatformIcon";
import "./jad.css";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";
const COVER = "/images/just-another-day-cover.jpg";
const AUDIO = "/audio/just-another-day.mp3";
const TITLE = "Just Another Day";
const ARTISTS = "Arema Arega & Yongolailan";

// Fixed order — Bandcamp first, on purpose (name-your-price / donations).
// `key` maps to the "jad.<key>" setting that holds the streaming link.
const PLATFORMS: { key: string; name: string; icon: string }[] = [
  { key: "bandcamp", name: "Bandcamp", icon: "bandcamp" },
  { key: "spotify", name: "Spotify", icon: "spotify" },
  { key: "apple", name: "Apple Music", icon: "apple music" },
  { key: "soundcloud", name: "SoundCloud", icon: "soundcloud" },
  { key: "youtube", name: "YouTube", icon: "youtube" },
  { key: "youtubemusic", name: "YouTube Music", icon: "youtube music" },
  { key: "tidal", name: "Tidal", icon: "tidal" },
  { key: "deezer", name: "Deezer", icon: "deezer" },
];

export async function generateMetadata(): Promise<Metadata> {
  let description =
    "The new single from Arema Arega & Yongolailan, out now on Caribbean Sea Sound.";
  try {
    const s = await getAllSettings();
    if (s["jad.info"]) description = s["jad.info"];
  } catch {
    /* database unavailable — fall back to the default description */
  }
  const title = `${TITLE} — ${ARTISTS}`;
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

export default async function JustAnotherDayPage() {
  noStore();
  const settings = await getAllSettings();
  const info = settings["jad.info"] || "";
  const bandcamp = (settings["jad.bandcamp"] || "").trim();

  const jsonLd = {
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
  };

  return (
    <main className="jad-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Muted, looping palm footage behind everything. */}
      <video
        className="jad-bg"
        autoPlay
        muted
        loop
        playsInline
        poster={COVER}
        preload="auto"
        aria-hidden="true"
      >
        <source src="/video/just-another-day-loop.webm" type="video/webm" />
        <source src="/video/just-another-day-loop.mp4" type="video/mp4" />
      </video>
      <div className="jad-bg-veil" aria-hidden="true" />

      <div className="jad-content">
        {/* SEO / screen-reader heading — the visible title lives in the artwork. */}
        <h1
          style={{
            position: "absolute",
            width: 1,
            height: 1,
            overflow: "hidden",
            clip: "rect(0 0 0 0)",
            whiteSpace: "nowrap",
            margin: -1,
          }}
        >
          {TITLE} — {ARTISTS}
        </h1>

        <div className="jad-eyebrow">New Single</div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="jad-cover" src={COVER} alt={`${TITLE} — ${ARTISTS} cover`} width={1500} height={1500} />

        <div className="jad-artists">{ARTISTS}</div>

        {info ? <p className="jad-info">{info}</p> : null}

        <div className="jad-player-wrap">
          <AudioPlayer src={AUDIO} title={TITLE} />
        </div>

        <div className="jad-listen-label">Listen &amp; support</div>
        <div className="jad-platforms">
          {PLATFORMS.map((p) => {
            const url = (settings[`jad.${p.key}`] || "").trim();
            const cls = "jad-plat" + (url ? "" : " is-disabled");
            const inner = (
              <>
                <PlatformIcon name={p.icon} size={22} />
                <span className="jad-tip">{p.name}</span>
              </>
            );
            return url ? (
              <a
                key={p.key}
                className={cls}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.name}
              >
                {inner}
              </a>
            ) : (
              <span
                key={p.key}
                className={cls}
                tabIndex={0}
                role="link"
                aria-disabled="true"
                aria-label={`${p.name} — link coming soon`}
              >
                {inner}
              </span>
            );
          })}
        </div>

        <p className="jad-note">
          Support the Artist directly on
          <br />
          {bandcamp ? (
            <a className="jad-bandcamp" href={bandcamp} target="_blank" rel="noopener noreferrer">
              BANDCAMP
            </a>
          ) : (
            <b className="jad-bandcamp">BANDCAMP</b>
          )}
        </p>
      </div>
    </main>
  );
}
