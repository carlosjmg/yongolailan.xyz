import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { unstable_noStore as noStore } from "next/cache";
import { getAllSettings } from "@/lib/settings";
import PlatformIcon from "@/components/site/PlatformIcon";
import ReleaseBlock from "@/components/site/jad/ReleaseBlock";
import PreviewButton from "@/components/site/jad/PreviewButton";
import VisualizerButton from "@/components/site/jad/VisualizerButton";
import Credits from "@/components/site/jad/Credits";
import EmailCapture from "@/components/site/jad/EmailCapture";
import ShareRow from "@/components/site/jad/ShareRow";
import "./jad.css";

/** Clamp an admin px value so a stray entry can't break the layout. */
const clampPx = (v: string | undefined, fallback: number) =>
  Math.min(40, Math.max(8, Number(v) || fallback));

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

/** now >= release date? (No/invalid date counts as released.) */
function isReleased(dateStr: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(dateStr.trim());
  if (!m) return true;
  const t = new Date(+m[1], +m[2] - 1, +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0).getTime();
  return Date.now() >= t;
}

export async function generateMetadata(): Promise<Metadata> {
  let description =
    "The new single from Arema Arega & Yongolailan, out now on Caribbean Sea Sound.";
  try {
    const s = await getAllSettings();
    if (s["jad.info"]) description = s["jad.info"].replace(/\s+/g, " ").trim();
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
  const on = (k: string) => settings[k] === "on";

  const eyebrow = settings["jad.eyebrow"] || "New Single";
  const info = settings["jad.info"] || "";
  const bandcamp = (settings["jad.bandcamp"] || "").trim();
  const bandcampNote = settings["jad.bandcampNote"] || "Support this Song directly on:";
  const infoSize = clampPx(settings["jad.infoSize"], 14);
  const infoSizeMobile = clampPx(settings["jad.infoSizeMobile"], 14);

  const releaseDate = (settings["jad.releaseDate"] || "").trim();
  const ctaEnabled = on("jad.cta.enabled");
  const releaseBlockShown = ctaEnabled || releaseDate !== "";

  const previewEnabled = on("jad.preview.enabled");
  const previewStart = Math.max(0, Number(settings["jad.preview.start"]) || 0);
  const previewDuration = Math.min(60, Math.max(5, Number(settings["jad.preview.duration"]) || 30));

  const visualizerEnabled = on("jad.visualizer.enabled");
  const taglineEnabled = on("jad.tagline.enabled");
  const tagline = (settings["jad.tagline"] || "").trim();
  const emailEnabled = on("jad.email.enabled");
  const shareEnabled = on("jad.share.enabled");

  const sizeVars = {
    "--jad-info-size": `${infoSize}px`,
    "--jad-info-size-mobile": `${infoSizeMobile}px`,
  } as CSSProperties;

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
        preload="metadata"
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

        <div className="jad-eyebrow">{eyebrow}</div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="jad-cover" src={COVER} alt={`${TITLE} — ${ARTISTS} cover`} width={1500} height={1500} />

        <div className="jad-artists">{ARTISTS}</div>

        {taglineEnabled && tagline ? <p className="jad-tagline">{tagline}</p> : null}

        {releaseBlockShown ? (
          <ReleaseBlock
            releaseDate={releaseDate}
            ctaEnabled={ctaEnabled}
            presaveUrl={(settings["jad.presaveUrl"] || "").trim()}
            listenUrl={(settings["jad.listenUrl"] || "").trim()}
            countdown={on("jad.countdown.enabled")}
            title={TITLE}
            initialReleased={isReleased(releaseDate)}
          />
        ) : null}

        {previewEnabled ? (
          <PreviewButton src={AUDIO} start={previewStart} duration={previewDuration} />
        ) : null}

        {info ? (
          <Credits
            text={info}
            collapse={on("jad.credits.collapse")}
            lines={Math.max(1, Number(settings["jad.credits.lines"]) || 3)}
            style={sizeVars}
          />
        ) : null}

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
              <a key={p.key} className={cls} href={url} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
                {inner}
              </a>
            ) : (
              <span key={p.key} className={cls} tabIndex={0} role="link" aria-disabled="true" aria-label={`${p.name} — link coming soon`}>
                {inner}
              </span>
            );
          })}
        </div>

        {visualizerEnabled ? <VisualizerButton label={settings["jad.visualizer.label"] || "Watch the Visualizer"} /> : null}

        <p className="jad-note">
          {bandcampNote}
          <br />
          {bandcamp ? (
            <a className="jad-bandcamp" href={bandcamp} target="_blank" rel="noopener noreferrer">
              BANDCAMP
            </a>
          ) : (
            <b className="jad-bandcamp">BANDCAMP</b>
          )}
        </p>

        {emailEnabled ? <EmailCapture heading={settings["jad.email.heading"] || "Stay connected"} /> : null}

        {shareEnabled ? <ShareRow url={`${siteUrl}/just-another-day`} title={`${TITLE} — ${ARTISTS}`} /> : null}
      </div>
    </main>
  );
}
