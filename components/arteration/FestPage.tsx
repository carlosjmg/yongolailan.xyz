import Link from "next/link";
import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getAllSettings } from "@/lib/settings";
import { getFestArtists, getFestVideos, getFestPhotos, getFestPartners } from "@/lib/data";
import { newYorkWallTimeToUtcMs } from "@/lib/ny-time";
import { UI, type Lang } from "@/lib/fest-content";
import FestVideos from "./FestVideos";
import FestGallery from "./FestGallery";
import FestArtists, { type FestYearView } from "./FestArtists";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";
const pathFor = (lang: Lang) => (lang === "es" ? "/arteration/es" : "/arteration");

/** "YYYY-MM-DDTHH:MM" (New York wall time) -> UTC ms, or NaN. */
function nyMs(v: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec((v || "").trim());
  if (!m) return NaN;
  return newYorkWallTimeToUtcMs(+m[1], +m[2], +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
}

/** A setting in the visitor's language, falling back to English. */
function pick(s: Record<string, string>, key: string, lang: Lang): string {
  if (lang === "es") {
    const es = (s[key + "Es"] || "").trim();
    if (es) return es;
  }
  return (s[key] || "").trim();
}

export async function festMetadata(lang: Lang): Promise<Metadata> {
  let name = "ARTeration Fest";
  let year = "2026";
  let description = "";
  const image = `${siteUrl}/images/arteration/og.jpg`;
  try {
    const s = await getAllSettings();
    name = s["fest.name"] || name;
    year = s["fest.year"] || year;
    const bits = [pick(s, "fest.date", lang), s["fest.venue"], s["fest.venue2"], s["fest.city"]].filter(Boolean);
    description = `${name} ${year}: ${bits.join(", ")}. ${pick(s, "fest.tagline", lang)}`.trim();
  } catch {
    /* database unavailable: fall back to the defaults */
  }
  const title = `${name} ${year}`;
  const url = `${siteUrl}${pathFor(lang)}`;
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { en: `${siteUrl}/arteration`, es: `${siteUrl}/arteration/es`, "x-default": `${siteUrl}/arteration` },
    },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: name,
      locale: lang === "es" ? "es_US" : "en_US",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default async function FestPage({ lang }: { lang: Lang }) {
  noStore();
  const ui = UI[lang];
  const [s, artists, videos, photos, partners] = await Promise.all([
    getAllSettings(),
    getFestArtists(),
    getFestVideos(),
    getFestPhotos(),
    getFestPartners(),
  ]);

  const name = s["fest.name"] || "ARTeration Fest";
  const year = (s["fest.year"] || "2026").trim();
  const venue = (s["fest.venue"] || "").trim();
  const venue2 = (s["fest.venue2"] || "").trim();
  const city = (s["fest.city"] || "").trim();
  const date = pick(s, "fest.date", lang);
  const time = (s["fest.time"] || "").trim();
  const presented = (s["fest.presentedBy"] || "").trim();
  const curated = (s["fest.curatedBy"] || "").trim();
  const produced = (s["fest.producedBy"] || "").trim();
  const tagline = pick(s, "fest.tagline", lang);
  const instagram = (s["fest.instagram"] || "").trim();
  const ticketUrl = (s["fest.ticketUrl"] || "").trim();
  const ticketLabel = (s["fest.ticketLabel"] || "Info & tickets").trim();
  const poster = (s["fest.poster"] || "/images/arteration/poster.webp").trim();
  const aboutTitle = pick(s, "fest.aboutTitle", lang);
  const about = ["fest.about1", "fest.about2", "fest.about3"].map((k) => pick(s, k, lang)).filter(Boolean);

  // Title: "ARTeration Fest" gets the poster's coloured A-R-T; any other name is plain.
  const [first, ...restWords] = name.split(" ");
  const fancy = /^ART/i.test(first) && first.length > 3;
  const lastWords = restWords.join(" ");

  // Days to go (only while the festival is still ahead).
  const start = nyMs(s["fest.startIso"]);
  const end = nyMs(s["fest.endIso"]);
  const now = Date.now();
  let countdown = "";
  if (!Number.isNaN(start)) {
    if (now < start) countdown = ui.daysToGo(Math.ceil((start - now) / 86400000));
    else if (!Number.isNaN(end) && now <= end) countdown = ui.today;
  }

  // Artists, grouped by festival year (newest first).
  const byYear = new Map<string, typeof artists>();
  for (const a of artists) {
    const y = a.edition.trim() || year;
    byYear.set(y, [...(byYear.get(y) || []), a]);
  }
  const years: FestYearView[] = [...byYear.keys()]
    .sort((a, b) => b.localeCompare(a))
    .map((y) => ({
      year: y,
      artists: (byYear.get(y) || []).map((a) => ({
        id: a.id,
        name: a.name,
        role: (lang === "es" && a.roleEs ? a.roleEs : a.role) || "",
        bio: (lang === "es" && a.bioEs ? a.bioEs : a.bio) || "",
        image: a.image || null,
        instagramUrl: a.instagramUrl || null,
        linkUrl: a.linkUrl || null,
      })),
    }));
  const currentNames = (byYear.get(year) || []).map((a) => a.name);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${name} ${year}`,
    inLanguage: lang,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: `${siteUrl}${pathFor(lang)}`,
    image: `${siteUrl}${poster.startsWith("/") ? poster : "/images/arteration/poster.webp"}`,
    description: tagline || name,
    location: {
      "@type": "Place",
      name: [venue, venue2].filter(Boolean).join(", "),
      address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
    },
    performer: currentNames.map((n) => ({ "@type": "PerformingGroup", name: n })),
    organizer: [presented, produced].filter(Boolean).map((n) => ({ "@type": "Organization", name: n })),
  };
  if (!Number.isNaN(start)) jsonLd.startDate = new Date(start).toISOString();
  if (!Number.isNaN(end)) jsonLd.endDate = new Date(end).toISOString();

  return (
    <div lang={lang}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Header ─────────────────────────────────────────── */}
      <header className="af-header">
        <div className="af-header-inner">
          <Link href={pathFor(lang)} className="af-mark" aria-label={name}>
            <span className="af-c1">A</span>
            <span className="af-c2">R</span>
            <span className="af-c3">T</span>
            <span className="af-c4">eration</span>
          </Link>
          <nav className="af-nav" aria-label="Festival">
            <a href="#about">{ui.nav.about}</a>
            <a href="#artists">{ui.nav.artists}</a>
            <a href="#videos">{ui.nav.videos}</a>
            <a href="#photos">{ui.nav.photos}</a>
            <a href="#partners">{ui.nav.partners}</a>
          </nav>
          <div className="af-header-end">
            <div className="af-lang" aria-label={ui.lang}>
              <Link href="/arteration" hrefLang="en" className={lang === "en" ? "is-on" : ""} aria-current={lang === "en" ? "true" : undefined}>
                EN
              </Link>
              <span aria-hidden="true">/</span>
              <Link href="/arteration/es" hrefLang="es" className={lang === "es" ? "is-on" : ""} aria-current={lang === "es" ? "true" : undefined}>
                ES
              </Link>
            </div>
            {instagram ? (
              <a href={instagram} target="_blank" rel="noopener noreferrer" className="af-ig" aria-label="Instagram">
                <InstagramGlyph />
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ─────────────────────────────────────────── */}
        <section className="af-hero">
          <div className="af-wrap af-hero-grid">
            <div className="af-hero-text">
              <p className="af-eyebrow">
                {year}
                {countdown ? <span className="af-chip">{countdown}</span> : null}
              </p>
              <h1 className="af-title" aria-label={name}>
                {fancy ? (
                  <span className="af-title-top" aria-hidden="true">
                    <span className="af-c1">{first[0]}</span>
                    <span className="af-c2">{first[1]}</span>
                    <span className="af-c3">{first[2]}</span>
                    <span className="af-c4">{first.slice(3)}</span>
                  </span>
                ) : (
                  <span className="af-title-top af-c4" aria-hidden="true">
                    {first}
                  </span>
                )}
                {lastWords ? (
                  <span className="af-title-fest" aria-hidden="true">
                    {lastWords}
                  </span>
                ) : null}
              </h1>
              {tagline ? <p className="af-tagline">{tagline}</p> : null}

              <div className="af-facts">
                {date ? <div className="af-fact-date">{date}</div> : null}
                <div className="af-fact-line">
                  {[venue, venue2].filter(Boolean).join(", ")}
                  {time ? <span> · {time}</span> : null}
                </div>
                {city ? <div className="af-fact-city">{city}</div> : null}
              </div>

              <div className="af-cta">
                <a className="af-btn af-btn-solid" href="#artists">
                  {ui.seeArtists} <Arrow />
                </a>
                {ticketUrl ? (
                  <a className="af-btn af-btn-outline" href={ticketUrl} target="_blank" rel="noopener noreferrer">
                    {ticketLabel}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="af-hero-poster">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={poster} alt={`${name} ${year}`} width={1122} height={1402} />
            </div>
          </div>
        </section>

        {/* ── About ────────────────────────────────────────── */}
        <section className="af-section" id="about">
          <div className="af-wrap af-about">
            <div>
              <p className="af-kicker">{ui.about}</p>
              {aboutTitle ? <h2 className="af-h2">{aboutTitle}</h2> : null}
            </div>
            <div>
              {about.map((t, i) => (
                <p className={i === 0 ? "af-body af-lead" : "af-body"} key={i}>
                  {t}
                </p>
              ))}
              <ul className="af-credits">
                {presented ? (
                  <li>
                    <span>{ui.presentedBy}</span> {presented}
                  </li>
                ) : null}
                {curated ? (
                  <li>
                    <span>{ui.curatedBy}</span> {curated}
                  </li>
                ) : null}
                {produced ? (
                  <li>
                    <span>{ui.producedBy}</span> {produced}
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </section>

        {/* ── Pillars ──────────────────────────────────────── */}
        <section className="af-section af-pillars-sec">
          <div className="af-wrap">
            <p className="af-kicker">{ui.pillarsKicker}</p>
            <ol className="af-pillars">
              {ui.pillars.map((p, i) => (
                <li key={p.title}>
                  <span className="af-pillar-num">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{p.title}</h3>
                  <p>{p.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Quote ────────────────────────────────────────── */}
        <section className="af-quote">
          <div className="af-wrap">
            <p className="af-quote-text">
              <span>{ui.quote[0]}</span>
              <span>{ui.quote[1]}</span>
            </p>
            <p className="af-quote-note">{ui.quoteNote}</p>
          </div>
        </section>

        {/* ── Artists ──────────────────────────────────────── */}
        <section className="af-section af-lineup" id="artists">
          <div className="af-wrap">
            <p className="af-kicker">{ui.artistsKicker}</p>
            <h2 className="af-h2">{ui.artistsTitle}</h2>
            <p className="af-section-intro">{ui.artistsIntro}</p>
            <FestArtists
              years={years}
              labels={{ noBio: ui.noBio, instagram: ui.instagram, website: lang === "es" ? "Sitio web" : "Website", soon: ui.soon }}
            />
          </div>
        </section>

        {/* ── Videos ───────────────────────────────────────── */}
        <section className="af-section" id="videos">
          <div className="af-wrap">
            <p className="af-kicker">{ui.videosKicker}</p>
            <h2 className="af-h2">{ui.videos}</h2>
            {videos.length === 0 ? (
              <div className="af-placeholder">{ui.videosSoon}</div>
            ) : (
              <FestVideos
                videos={videos.map((v) => ({
                  id: v.id,
                  title: (lang === "es" && v.titleEs ? v.titleEs : v.title) || "",
                  embedUrl: v.embedUrl,
                  thumbnail: v.thumbnail,
                  edition: v.edition,
                }))}
              />
            )}
          </div>
        </section>

        {/* ── Photos ───────────────────────────────────────── */}
        <section className="af-section af-photos" id="photos">
          <div className="af-wrap">
            <p className="af-kicker">{ui.photosKicker}</p>
            <h2 className="af-h2">{ui.photos}</h2>
            {photos.length === 0 ? (
              <div className="af-placeholder">{ui.photosSoon}</div>
            ) : (
              <FestGallery
                photos={photos.map((p) => ({
                  id: p.id,
                  image: p.image,
                  caption: (lang === "es" && p.captionEs ? p.captionEs : p.caption) || "",
                  edition: p.edition,
                }))}
              />
            )}
          </div>
        </section>

        {/* ── Partners ─────────────────────────────────────── */}
        {partners.length > 0 ? (
          <section className="af-section af-partners" id="partners">
            <div className="af-wrap">
              <p className="af-kicker">{ui.partnersKicker}</p>
              <div className="af-partner-row">
                {partners.map((p) => {
                  const logo = p.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.logo} alt={p.name} loading="lazy" />
                  ) : (
                    <span>{p.name}</span>
                  );
                  return p.url ? (
                    <a key={p.id} className="af-partner" href={p.url} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
                      {logo}
                    </a>
                  ) : (
                    <div key={p.id} className="af-partner" aria-label={p.name}>
                      {logo}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="af-footer">
        <div className="af-footer-inner">
          <div className="af-footer-brand">
            <div className="af-footer-title">{name}</div>
            <p>
              {presented ? (
                <>
                  {ui.presentedBy} {presented}.{" "}
                </>
              ) : null}
              {produced ? (
                <>
                  {ui.producedBy} {produced}.
                </>
              ) : null}
            </p>
          </div>
          <div className="af-footer-links">
            {instagram ? (
              <a href={instagram} target="_blank" rel="noopener noreferrer">
                {ui.followUs} ↗
              </a>
            ) : null}
            <Link href="/caribbean-sea-sound">Caribbean Sea Sound</Link>
            <Link href="/">Yongolailan</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
