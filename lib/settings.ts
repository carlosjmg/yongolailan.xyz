import { prisma } from "./prisma";

// Sections that can be shown / hidden / marked "coming soon" from the admin.
export const SECTION_KEYS = [
  "catalog",
  "videos",
  "epk",
  "photos",
  "merch",
  "awards",
  "about",
  "contact",
  "links",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export type SectionState = "on" | "off" | "soon";

export const SECTION_LABELS: Record<SectionKey, string> = {
  catalog: "Catalog",
  videos: "Short Films & Videos",
  epk: "EPK / Press",
  photos: "Live",
  merch: "Merch",
  awards: "Awards & Recognition",
  about: "About",
  contact: "Contact",
  links: "Links",
};

// Default site content. Everything here is editable in the admin; these are
// the values the site ships with (seeded on first run).
export const DEFAULT_SETTINGS: Record<string, string> = {
  "hero.eyebrow": "Electronic Ritual · Afro-Caribbean Futurism",
  "hero.name": "Yongolailan",
  "hero.roleLine": "DJ / Producer / Curator / Sound Artist",
  "hero.oneLiner":
    "Electronic ritual music shaped by Afro-diasporic rhythms and Caribbean roots.",
  "hero.image": "/images/ICE.webp",
  // Empty means "use the site gold" — see HERO_ROLE_COLOR_FALLBACK.
  "hero.roleColor": "",
  // Nudge the one-liner + Booking button on desktop, in px (+right/+down).
  "hero.copyX": "0",
  "hero.copyY": "0",
  // Extra nudge for JUST the Booking button, independent of the one-liner (desktop).
  "hero.bookingX": "0",
  "hero.bookingY": "0",
  // Show/hide the Booking button (hero, mobile menu, mobile sticky bar). "off" hides.
  "hero.showBooking": "on",
  // Font size (px) of the top menu links on desktop. Phones use their own size.
  "nav.menuSize": "11",
  // Caption / credit text sizes (px) under releases and media cards.
  "catalog.creditsSize": "10", // Music catalog credit line (e.g. "Lyric by…")
  "videos.descSize": "13",     // Films & Videos description line
  "photos.captionSize": "24",  // Live caption under each item (px)

  // ── Section header styling (applies to every section heading) ──
  "headers.font": "cormorant", // one of lib/fonts HEADER_FONTS keys — the big title
  "headers.titleScale": "100", // % of the default size
  "headers.eyebrowScale": "100",
  "headers.subtitleScale": "100",

  // ── Section headings (every title/subtitle on the site) ──
  // Titles listed here are shown first in the Music Catalog, in this order.
  "catalog.pinned": "Sueño Tropical, Havanece, Chinatown Downtown",
  "text.catalog.eyebrow": "Discography",
  "text.catalog.title": "Catalog",
  "text.catalog.subtitle":
    "A growing archive of electronic ritual music rooted in Afro-Caribbean tradition.",
  "text.videos.eyebrow": "Film & Motion",
  "text.videos.title": "Short Films & Videos",
  "text.videos.subtitle":
    "Music videos, short films, and live sessions — visual storytelling rooted in Afro-Caribbean culture.",
  "text.photos.eyebrow": "On Stage",
  "text.photos.title": "Live Performance & DJ Sessions",
  "text.photos.subtitle":
    "Photos and video from live shows, festivals, and sessions.",
  "text.merch.eyebrow": "Merchandise",
  "text.merch.title": "Merch",
  "text.merch.subtitle": "Vinyl, prints, and special releases.",
  "text.awards.eyebrow": "Recognition",
  "text.awards.title": "Awards & Recognition",
  "text.awards.subtitle": "",
  "text.about.eyebrow": "About",
  "text.about.title": "The Artist",
  "text.contact.eyebrow": "Booking & Press",
  "text.contact.title": "Get in Touch",
  "text.contact.subtitle":
    "Open to bookings, collaborations, press, and live performance inquiries worldwide.",
  "text.links.eyebrow": "Official Links",
  "text.links.title": "Everywhere",

  "contact.inquiryTypes":
    "booking, press, collaborations, licensing, sound design, DJ sets, live performance, general",

  "about.image": "/images/ICE.webp",
  "about.p1":
    "Yongolailan is a Cuban DJ, producer, and live electronic performer based in New York City. His work blends Afro-diasporic rhythms, Afro-Cuban roots, Latin jazz, and contemporary electronic music into immersive Caribbean futurist soundscapes.",
  "about.p2":
    "Founded in Brooklyn, Caribbean Sea Sound serves as both a record label and a platform for connecting Caribbean cultural heritage with international music production. Collaborators include Cimafunk, Arema Arega, Reinier Aldana, and Raúl Paz.",
  "about.stats":
    '[["10+","Years Active"],["9+","Releases"],["3","Awards"],["NYC","Base"]]',

  "epk.bio1":
    "Yongolailan is a multidisciplinary Cuban artist based in New York City, active as a DJ, producer, and live electronic performer. Award-winning and internationally experienced, he blends Afro-diasporic rhythms with contemporary electronic music.",
  "epk.bio2":
    "He is the founder of the Brooklyn-based record label Caribbean Sea Sound, under which he has produced and collaborated with artists such as Cimafunk, Arema Arega, Reinier Aldana, Raúl Paz, and others.",
  "epk.bio3":
    "His debut album Sueño Tropical won the Cubadisco Award in 2015 in the electroacoustic music category. His work connects sequences, samples, sonic memory, and cultural reinterpretation.",
  "epk.oneLiner": "Cuban DJ, producer & live electronic performer based in NYC.",
  "epk.sound": "Afro-Cuban House · Latin Afrobeat · Caribbean Diaspora.",
  "epk.performance": "DJ sets · Live electronic · Festival mix sessions.",
  "epk.recognition": "Cubadisco 2015 · EYEIFE 2024 & 2025.",
  "epk.soundTags":
    '["Afro-Cuban House","Latin Afrobeat","Caribbean Diaspora","Electronic Ritual","Afro-Caribbean Futurism","Immersive","Rhythmic"]',
  "epk.identityFacts":
    '[["Origin","Cuba"],["Based","New York City, USA"],["Label","Caribbean Sea Sound (founder)"],["Genre","Afro-Cuban House · Latin Afrobeat · Caribbean Diaspora"],["Active","2012 – Present"]]',

  "contact.email": "yongolailan.official@gmail.com",
  "contact.whatsapp": "+1 (646) 547-7443",
  "contact.whatsappUrl": "https://wa.me/16465477443",

  "label.name": "Caribbean Sea Sound",
  "label.location": "Brooklyn, New York",
  "label.intro":
    "Caribbean Sea Sound is an independent music platform and label founded in Brooklyn in 2016. Created as a space for discovery, collaboration and artistic exchange, it has showcased artists from the Caribbean and across the Americas.",
  "label.logo": "",
  "label.logoSize": "34",
  // Font size (px) of the "Caribbean Sea Sound" wordmark in the header.
  // Empty = match the logo size.
  "label.wordmarkSize": "",
  // Cover size (px) of each song/production shown on an artist's page.
  "label.songCoverSize": "96",
  // Artist-name size (px) in the roster list, desktop and mobile. The gap
  // between names is expressed in em against this same size in the CSS, so
  // it shrinks and grows together with the letters automatically.
  "label.artistNameSize": "34",
  "label.artistNameSizeMobile": "22",
  // Nudge the label logo in the header, in px. X: +right/−left, Y: +down/−up.
  // The *Mobile keys override on phones; empty = use the desktop value.
  "label.logoOffsetX": "0",
  "label.logoOffsetY": "0",
  "label.logoOffsetXMobile": "",
  "label.logoOffsetYMobile": "",
  "label.tagline": "Independent label & music platform · Brooklyn · Est. 2016",
  "site.domain": "yongolailan.xyz",
  "site.logo": "/images/Yongo-logo-blanco.webp",
  "site.logoSize": "40",
  // Separate logo height on phones. Empty = use the desktop size.
  "site.logoSizeMobile": "",
  // Logo nudge in the top-left, in pixels. X: + right / − left. Y: + down /
  // − up. Y defaults to ~3.5mm (13px), the position it currently sits at.
  // The *Mobile keys override on phones; empty = use the desktop value.
  "site.logoOffsetX": "0",
  "site.logoOffsetY": "13",
  "site.logoOffsetXMobile": "",
  "site.logoOffsetYMobile": "",
  "site.ogImage": "",
  "epk.pdfUrl": "",

  // ── "Just Another Day" single page (/just-another-day) ──
  // Reached by clicking the song title in Arema Arega's label page.
  "jad.info":
    "The new single from Arema Arega & Yongolailan — a nocturnal, palm-lit groove born between the Caribbean and New York. Out now on Caribbean Sea Sound. Name your price on Bandcamp.",
  // Credits/description font size (px), per device.
  "jad.infoSize": "14",
  "jad.infoSizeMobile": "14",

  // ── Optional landing modules — every one is OFF/empty by default, so the
  // live page is unchanged until it's turned on and filled in from the admin.
  "jad.eyebrow": "New Single", // small line above the cover
  // Release date/time, local, e.g. "2026-10-16T00:00". Drives the CTA switch,
  // the "OUT — …" line and the countdown. Empty = no date features.
  "jad.releaseDate": "",
  // Big primary CTA. Before the date → "Pre-Save"; on/after → "Listen Now".
  "jad.cta.enabled": "off",
  "jad.presaveUrl": "", // pre-save / smart link used before release
  "jad.listenUrl": "", // listen-now / smart link used on & after release
  "jad.countdown.enabled": "off", // tiny "N DAYS / N HOURS" until release
  // 15–30s audio preview, played from the hosted track.
  "jad.preview.enabled": "off",
  "jad.preview.start": "0", // seconds into the track where the preview starts
  "jad.preview.duration": "30", // seconds
  // "Watch the visualizer" — opens the background loop full-screen.
  "jad.visualizer.enabled": "off",
  "jad.visualizer.label": "Watch the Visualizer",
  // One-line phrase / lyric under the artists.
  "jad.tagline.enabled": "off",
  "jad.tagline": "",
  // Collapse the credits to a few lines with a "Full credits +" toggle.
  "jad.credits.collapse": "off",
  "jad.credits.lines": "3",
  // Editable lead-in for the Bandcamp support line (BANDCAMP stays the link).
  "jad.bandcampNote": "Support this Song directly on:",
  // Discreet email capture near the foot.
  "jad.email.enabled": "off",
  "jad.email.heading": "Stay connected",
  // Share / copy-link row.
  "jad.share.enabled": "off",
  // Streaming links. Empty = the button shows but is greyed out (no link yet).
  "jad.bandcamp": "",
  "jad.spotify": "",
  "jad.apple": "",
  "jad.soundcloud": "https://soundcloud.com/yongolailan/just-another-day-1",
  "jad.youtube": "",
  "jad.youtubemusic": "",
  "jad.tidal": "",
  "jad.deezer": "",

  "section.catalog": "on",
  "section.epk": "on",
  "section.photos": "on",
  "section.merch": "soon",
  "section.about": "on",
  "section.contact": "on",
  "section.links": "on",
};

export type Settings = Record<string, string>;

/** Read all settings, merged over the shipped defaults. */
export async function getAllSettings(): Promise<Settings> {
  const map: Settings = { ...DEFAULT_SETTINGS };
  try {
    const rows = await prisma.setting.findMany();
    for (const r of rows) map[r.key] = r.value;
  } catch {
    // Database not ready yet — fall back to defaults.
  }
  return map;
}

export async function setSetting(key: string, value: string): Promise<void> {
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function setSettings(entries: Record<string, string>): Promise<void> {
  await prisma.$transaction(
    Object.entries(entries).map(([key, value]) =>
      prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    )
  );
}

/** Editable heading text for a site section. */
export interface SectionText {
  eyebrow: string;
  title: string;
  subtitle?: string;
}

export function sectionText(settings: Settings, key: string): SectionText {
  return {
    eyebrow: settings[`text.${key}.eyebrow`] || "",
    title: settings[`text.${key}.title`] || "",
    subtitle: settings[`text.${key}.subtitle`] || undefined,
  };
}

/** Comma-separated setting → trimmed list. */
export function parseListSetting(value: string | undefined): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function sectionState(settings: Settings, key: SectionKey): SectionState {
  const v = settings[`section.${key}`];
  return v === "off" ? "off" : v === "soon" ? "soon" : "on";
}

/** The site gold, as hex — what the hero one-liner uses when no colour is set. */
export const HERO_ROLE_COLOR_FALLBACK = "#eb881f";

/**
 * Only ever let a real hex colour reach an inline style, so a stray paste in
 * the admin can't turn into arbitrary CSS.
 */
export function safeHexColor(value: string | undefined, fallback: string): string {
  const v = (value || "").trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v) ? v : fallback;
}

/** Safely parse a JSON-array setting (e.g. sound tags, identity facts). */
export function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
