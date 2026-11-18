import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getAllSettings } from "@/lib/settings";
import { getLabelArtistLinks } from "@/lib/data";
import { newYorkWallTimeToUtcMs } from "@/lib/ny-time";
import PlatformIcon from "@/components/site/PlatformIcon";
import ReleaseBlock from "@/components/site/jad/ReleaseBlock";
import PreviewButton from "@/components/site/jad/PreviewButton";
import VisualizerButton from "@/components/site/jad/VisualizerButton";
import Credits from "@/components/site/jad/Credits";
import EmailCapture from "@/components/site/jad/EmailCapture";
import ShareRow from "@/components/site/jad/ShareRow";
import "@/app/just-another-day/jad.css";

/**
 * The shared release landing page (cover, platforms, credits, optional modules).
 * "Just Another Day" and "Havanece" both render through it; each one only
 * supplies its own config, and its own settings live under "<prefix>.*".
 */
export type LandingConfig = {
  /** Settings prefix: "jad" or "hav". */
  prefix: string;
  /** Public route, e.g. "/just-another-day". */
  route: string;
  title: string;
  artists: string;
  cover: string;
  /** Hosted track for the audio preview; null = this page has no preview. */
  audio: string | null;
  videoWebm: string;
  videoMp4: string;
  /** "song" / "album", used in the Bandcamp note. */
  noun: string;
  /** The closing credit line (links to the label page). */
  creditLine: string;
  defaultEyebrow: string;
  /** schema.org JSON-LD for the page. */
  jsonLd: Record<string, unknown>;
};

/** Streaming platforms in a fixed order, Bandcamp first on purpose
 *  (name-your-price / donations). `key` maps to the "<prefix>.<key>" setting. */
const PLATFORMS: { key: string; name: string; icon: string }[] = [
  { key: "bandcamp", name: "Bandcamp", icon: "bandcamp" },
  { key: "spotify", name: "Spotify", icon: "spotify" },
  { key: "apple", name: "Apple Music", icon: "apple music" },
  { key: "soundcloud", name: "SoundCloud", icon: "soundcloud" },
  { key: "amazon", name: "Amazon Music", icon: "amazon music" },
  { key: "youtubemusic", name: "YouTube Music", icon: "youtube music" },
  { key: "tidal", name: "Tidal", icon: "tidal" },
  { key: "deezer", name: "Deezer", icon: "deezer" },
];

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";

/** Clamp an admin px value so a stray entry can't break the layout. */
const clampPx = (v: string | undefined, fallback: number) => Math.min(40, Math.max(8, Number(v) || fallback));

/** now >= release date? (No/invalid date counts as released.) */
function isReleased(dateStr: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(dateStr.trim());
  if (!m) return true;
  const t = newYorkWallTimeToUtcMs(+m[1], +m[2], +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
  return Date.now() >= t;
}

export default async function ReleaseLanding({ cfg, children }: { cfg: LandingConfig; children?: ReactNode }) {
  noStore();
  const [settings, labelArtists] = await Promise.all([getAllSettings(), getLabelArtistLinks()]);
  const k = (name: string) => settings[`${cfg.prefix}.${name}`] || "";
  const on = (name: string) => settings[`${cfg.prefix}.${name}`] === "on";

  const eyebrow = k("eyebrow") || cfg.defaultEyebrow;
  const info = k("info");
  const bandcamp = k("bandcamp").trim();
  const infoSize = clampPx(k("infoSize"), 14);
  const infoSizeMobile = clampPx(k("infoSizeMobile"), 14);

  const releaseDate = k("releaseDate").trim();
  const ctaEnabled = on("cta.enabled");
  const releaseBlockShown = ctaEnabled || releaseDate !== "";

  const previewEnabled = cfg.audio !== null && on("preview.enabled");
  const previewStart = Math.max(0, Number(k("preview.start")) || 0);
  const previewDuration = Math.min(60, Math.max(5, Number(k("preview.duration")) || 30));

  const visualizerEnabled = on("visualizer.enabled");
  const taglineEnabled = on("tagline.enabled");
  const tagline = k("tagline").trim();
  const emailEnabled = on("email.enabled");
  const shareEnabled = on("share.enabled");

  const sizeVars = {
    "--jad-info-size": `${infoSize}px`,
    "--jad-info-size-mobile": `${infoSizeMobile}px`,
  } as CSSProperties;

  return (
    <main className="jad-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cfg.jsonLd) }} />

      {/* Muted, looping footage behind everything. */}
      <video className="jad-bg" autoPlay muted loop playsInline poster={cfg.cover} preload="metadata" aria-hidden="true">
        <source src={cfg.videoWebm} type="video/webm" />
        <source src={cfg.videoMp4} type="video/mp4" />
      </video>
      <div className="jad-bg-veil" aria-hidden="true" />

      <div className="jad-content">
        {/* SEO / screen-reader heading: the visible title lives in the artwork. */}
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
          {cfg.title} - {cfg.artists}
        </h1>

        <div className="jad-eyebrow">{eyebrow}</div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="jad-cover" src={cfg.cover} alt={`${cfg.title} - ${cfg.artists} cover`} width={1500} height={1500} />

        {taglineEnabled && tagline ? <p className="jad-tagline">{tagline}</p> : null}

        {releaseBlockShown ? (
          <ReleaseBlock
            releaseDate={releaseDate}
            ctaEnabled={ctaEnabled}
            presaveUrl={k("presaveUrl").trim()}
            listenUrl={k("listenUrl").trim()}
            countdown={on("countdown.enabled")}
            title={cfg.title}
            initialReleased={isReleased(releaseDate)}
          />
        ) : null}

        {previewEnabled && cfg.audio ? <PreviewButton src={cfg.audio} start={previewStart} duration={previewDuration} /> : null}

        <div className="jad-eyebrow">Listen &amp; support</div>
        <div className="jad-platforms">
          {PLATFORMS.map((p) => {
            const url = k(p.key).trim();
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
              <span key={p.key} className={cls} tabIndex={0} role="link" aria-disabled="true" aria-label={`${p.name}: link coming soon`}>
                {inner}
              </span>
            );
          })}
        </div>

        {visualizerEnabled ? <VisualizerButton label={k("visualizer.label") || "Watch the Visualizer"} /> : null}

        {info ? (
          <>
            <div className="jad-eyebrow">Credits</div>
            <Credits
              text={info}
              collapse={on("credits.collapse")}
              lines={Math.max(1, Number(k("credits.lines")) || 3)}
              style={sizeVars}
              artists={labelArtists}
            />
          </>
        ) : null}

        <p className="jad-note">
          You can support this {cfg.noun} directly on{" "}
          {bandcamp ? (
            <a className="jad-info-link" href={bandcamp} target="_blank" rel="noopener noreferrer">
              Bandcamp
            </a>
          ) : (
            "Bandcamp"
          )}
          .
        </p>

        {/* Page-specific closing section (e.g. the vinyl on the Havanece page). */}
        {children}

        <p className="jad-note jad-note--wide">
          <Link href="/caribbean-sea-sound" className="jad-label-credit">
            {cfg.creditLine}
          </Link>
        </p>

        {emailEnabled ? <EmailCapture heading={k("email.heading") || "Stay connected"} source={cfg.route.replace(/^\//, "")} /> : null}

        {shareEnabled ? <ShareRow url={`${siteUrl}${cfg.route}`} title={`${cfg.title} - ${cfg.artists}`} /> : null}
      </div>
    </main>
  );
}
