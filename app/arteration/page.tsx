import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getAllSettings } from "@/lib/settings";
import { getFestArtists, getFestVideos, getFestPhotos, getFestPartners } from "@/lib/data";
import { newYorkWallTimeToUtcMs } from "@/lib/ny-time";
import FestVideos from "@/components/arteration/FestVideos";
import FestGallery from "@/components/arteration/FestGallery";

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yongolailan.xyz";

/** "YYYY-MM-DDTHH:MM" (New York wall time) -> UTC ms, or NaN. */
function nyMs(v: string): number {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec((v || "").trim());
  if (!m) return NaN;
  return newYorkWallTimeToUtcMs(+m[1], +m[2], +m[3], m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
}

export async function generateMetadata(): Promise<Metadata> {
  let name = "ARTeration Fest";
  let year = "2026";
  let description = "";
  let image = `${siteUrl}/images/arteration/og.jpg`;
  try {
    const s = await getAllSettings();
    name = s["fest.name"] || name;
    year = s["fest.year"] || year;
    const bits = [s["fest.date"], s["fest.venue"], s["fest.venue2"], s["fest.city"]].filter(Boolean);
    description = `${name} ${year}: ${bits.join(", ")}. ${s["fest.tagline"] || ""}`.trim();
  } catch {
    /* database unavailable: fall back to the defaults */
  }
  const title = `${name} ${year}`;
  const url = `${siteUrl}/arteration`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, siteName: name, images: [{ url: image, width: 1200, height: 630, alt: title }] },
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

export default async function ArterationPage() {
  noStore();
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
  const date = (s["fest.date"] || "").trim();
  const time = (s["fest.time"] || "").trim();
  const presented = (s["fest.presentedBy"] || "").trim();
  const curated = (s["fest.curatedBy"] || "").trim();
  const produced = (s["fest.producedBy"] || "").trim();
  const tagline = (s["fest.tagline"] || "").trim();
  const instagram = (s["fest.instagram"] || "").trim();
  const ticketUrl = (s["fest.ticketUrl"] || "").trim();
  const ticketLabel = (s["fest.ticketLabel"] || "Info & tickets").trim();
  const poster = (s["fest.poster"] || "/images/arteration/poster.webp").trim();
  const about = [s["fest.about1"], s["fest.about2"]].filter((t) => t && t.trim());

  // Title: "ARTeration Fest" gets the poster's coloured A-R-T; any other name is plain.
  const [first, ...restWords] = name.split(" ");
  const fancy = /^ART/i.test(first) && first.length > 3;
  const lastWords = restWords.join(" ");

  // Days to go
  const start = nyMs(s["fest.startIso"]);
  const end = nyMs(s["fest.endIso"]);
  const now = Date.now();
  let countdown = "";
  if (!Number.isNaN(start)) {
    if (now < start) {
      const days = Math.ceil((start - now) / 86400000);
      countdown = days === 1 ? "Tomorrow" : `${days} days to go`;
    } else if (!Number.isNaN(end) && now <= end) {
      countdown = "Happening today";
    }
  }

  // Lineup: this year's artists, then earlier editions grouped by year.
  const current = artists.filter((a) => !a.edition.trim() || a.edition.trim() === year);
  const pastByYear = new Map<string, typeof artists>();
  for (const a of artists) {
    const y = a.edition.trim();
    if (!y || y === year) continue;
    pastByYear.set(y, [...(pastByYear.get(y) || []), a]);
  }
  const pastYears = [...pastByYear.keys()].sort((a, b) => b.localeCompare(a));

  const marqueeNames = current.length ? current.map((a) => a.name) : [name];

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${name} ${year}`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    url: `${siteUrl}/arteration`,
    image: `${siteUrl}${poster.startsWith("/") ? poster : "/images/arteration/poster.webp"}`,
    description: [about[0], tagline].filter(Boolean)[0] || name,
    location: {
      "@type": "Place",
      name: [venue, venue2].filter(Boolean).join(", "),
      address: { "@type": "PostalAddress", addressLocality: "New York", addressRegion: "NY", addressCountry: "US" },
    },
    performer: current.map((a) => ({ "@type": "PerformingGroup", name: a.name })),
    organizer: [presented, produced].filter(Boolean).map((n) => ({ "@type": "Organization", name: n })),
  };
  if (!Number.isNaN(start)) jsonLd.startDate = new Date(start).toISOString();
  if (!Number.isNaN(end)) jsonLd.endDate = new Date(end).toISOString();

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Hero ───────────────────────────────────────────── */}
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
              {venue ? <div className="af-fact-venue">{venue}</div> : null}
              {venue2 ? <div className="af-fact-venue2">{venue2}</div> : null}
              {time ? <div className="af-fact-time">{time}</div> : null}
              {city ? <div className="af-fact-city">{city}</div> : null}
            </div>

            <div className="af-cta">
              <a className="af-btn af-btn-solid" href="#lineup">
                See the lineup <Arrow />
              </a>
              {ticketUrl ? (
                <a className="af-btn af-btn-outline" href={ticketUrl} target="_blank" rel="noopener noreferrer">
                  {ticketLabel}
                </a>
              ) : null}
              {instagram ? (
                <a className="af-btn af-btn-outline" href={instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              ) : null}
            </div>
          </div>

          <div className="af-hero-poster">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={poster} alt={`${name} ${year} poster`} width={1122} height={1402} />
          </div>
        </div>
      </section>

      {/* ── Marquee ───────────────────────────────────────── */}
      <div className="af-marquee" aria-hidden="true">
        <div className="af-marquee-track">
          {[0, 1].map((k) => (
            <div className="af-marquee-set" key={k}>
              {marqueeNames.map((n, i) => (
                <span key={`${k}-${i}`}>
                  {n}
                  <i className="af-star" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── About ─────────────────────────────────────────── */}
      <section className="af-section" id="about">
        <div className="af-wrap af-about">
          <div>
            <p className="af-kicker">About</p>
            <h2 className="af-h2">A day for art to meet music.</h2>
            {about.map((t, i) => (
              <p className="af-body" key={i}>
                {t}
              </p>
            ))}
            <ul className="af-credits">
              {presented ? (
                <li>
                  <span>Presented by</span> {presented}
                </li>
              ) : null}
              {curated ? (
                <li>
                  <span>Curated by</span> {curated}
                </li>
              ) : null}
              {produced ? (
                <li>
                  <span>Produced by</span> {produced}
                </li>
              ) : null}
            </ul>
          </div>
          <div className="af-tiles">
            {date ? (
              <div className="af-tile af-tile-orange">
                <small>Date</small>
                <strong>{date}</strong>
                <span>{year}</span>
              </div>
            ) : null}
            {time ? (
              <div className="af-tile af-tile-purple">
                <small>Time</small>
                <strong>{time}</strong>
              </div>
            ) : null}
            {venue ? (
              <div className="af-tile af-tile-green">
                <small>Place</small>
                <strong>{venue}</strong>
                <span>{venue2}</span>
              </div>
            ) : null}
            {city ? (
              <div className="af-tile af-tile-mustard">
                <small>City</small>
                <strong>{city}</strong>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* ── Lineup ────────────────────────────────────────── */}
      <section className="af-section af-lineup" id="lineup">
        <div className="af-wrap">
          <p className="af-kicker">{year}</p>
          <h2 className="af-h2">Lineup</h2>
          {current.length === 0 ? (
            <p className="af-empty">The lineup will be announced soon.</p>
          ) : (
            <ol className="af-lineup-list">
              {current.map((a, i) => {
                const href = a.instagramUrl || a.linkUrl || "";
                const inner = (
                  <>
                    <span className="af-lu-num">{String(i + 1).padStart(2, "0")}</span>
                    {a.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="af-lu-photo" src={a.image} alt="" loading="lazy" />
                    ) : null}
                    <span className="af-lu-name">{a.name}</span>
                    {a.role ? <span className="af-lu-role">{a.role}</span> : null}
                    {href ? (
                      <span className="af-lu-go" aria-hidden="true">
                        <Arrow />
                      </span>
                    ) : null}
                  </>
                );
                return (
                  <li key={a.id}>
                    {href ? (
                      <a className="af-lu-row" href={href} target="_blank" rel="noopener noreferrer">
                        {inner}
                      </a>
                    ) : (
                      <div className="af-lu-row">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ol>
          )}

          {pastYears.length > 0 ? (
            <div className="af-past">
              <h3 className="af-h3">Past editions</h3>
              {pastYears.map((y) => (
                <div className="af-past-year" key={y}>
                  <div className="af-past-label">{y}</div>
                  <div className="af-past-names">
                    {(pastByYear.get(y) || []).map((a) => {
                      const href = a.instagramUrl || a.linkUrl || "";
                      return href ? (
                        <a key={a.id} href={href} target="_blank" rel="noopener noreferrer">
                          {a.name}
                        </a>
                      ) : (
                        <span key={a.id}>{a.name}</span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── Videos ────────────────────────────────────────── */}
      <section className="af-section" id="videos">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="af-deco af-deco-flower" src="/images/arteration/flower.webp" alt="" aria-hidden="true" />
        <div className="af-wrap">
          <p className="af-kicker">Watch</p>
          <h2 className="af-h2">Videos</h2>
          {videos.length === 0 ? (
            <div className="af-placeholder">Videos from the festival will live here.</div>
          ) : (
            <FestVideos videos={videos.map((v) => ({ id: v.id, title: v.title, embedUrl: v.embedUrl, thumbnail: v.thumbnail, edition: v.edition }))} />
          )}
        </div>
      </section>

      {/* ── Photos ────────────────────────────────────────── */}
      <section className="af-section af-photos" id="photos">
        <div className="af-wrap">
          <p className="af-kicker">Moments</p>
          <h2 className="af-h2">Photos</h2>
          {photos.length === 0 ? (
            <div className="af-placeholder">Photos from the festival will live here.</div>
          ) : (
            <FestGallery photos={photos.map((p) => ({ id: p.id, image: p.image, caption: p.caption, edition: p.edition }))} />
          )}
        </div>
      </section>

      {/* ── Partners ──────────────────────────────────────── */}
      {partners.length > 0 ? (
        <section className="af-section af-partners" id="partners">
          <div className="af-wrap">
            <p className="af-kicker">With the support of</p>
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
  );
}
