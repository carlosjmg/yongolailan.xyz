import { prisma } from "./prisma";

// Sections that can be shown / hidden / marked "coming soon" from the admin.
export const SECTION_KEYS = [
  "catalog",
  "portfolio",
  "videos",
  "epk",
  "photos",
  "merch",
  "about",
  "contact",
  "links",
] as const;
export type SectionKey = (typeof SECTION_KEYS)[number];

export type SectionState = "on" | "off" | "soon";

export const SECTION_LABELS: Record<SectionKey, string> = {
  catalog: "Catalog",
  portfolio: "Portfolio",
  videos: "Short Films & Videos",
  epk: "EPK / Press",
  photos: "Live Performance",
  merch: "Merch",
  about: "About",
  contact: "Contact",
  links: "Links",
};

// Default site content. Everything here is editable in the admin; these are
// the values the site ships with (seeded on first run).
export const DEFAULT_SETTINGS: Record<string, string> = {
  "hero.eyebrow": "Electronic Ritual · Afro-Caribbean Futurism",
  "hero.name": "Yongolailan",
  "hero.roleLine": "DJ · Producer · Live Electronic Performer",
  "hero.oneLiner":
    "Electronic ritual music shaped by Afro-diasporic rhythms and Caribbean roots.",
  "hero.image": "/images/ICE.webp",

  // ── Section headings (every title/subtitle on the site) ──
  "text.catalog.eyebrow": "Discography",
  "text.catalog.title": "Catalog",
  "text.catalog.subtitle":
    "A growing archive of electronic ritual music rooted in Afro-Caribbean tradition.",
  "text.portfolio.eyebrow": "Portfolio",
  "text.portfolio.title": "Creative Work",
  "text.portfolio.subtitle":
    "Music, film, games, and digital experiences rooted in Caribbean culture.",
  "text.videos.eyebrow": "Film & Motion",
  "text.videos.title": "Short Films & Videos",
  "text.videos.subtitle":
    "Music videos, short films, and live sessions — visual storytelling rooted in Afro-Caribbean culture.",
  "text.photos.eyebrow": "On Stage",
  "text.photos.title": "Live Performance",
  "text.photos.subtitle":
    "Photos and video from live shows, festivals, and sessions.",
  "text.merch.eyebrow": "Merchandise",
  "text.merch.title": "Merch",
  "text.merch.subtitle": "Vinyl, prints, and special releases.",
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
  "site.domain": "yongolailan.xyz",
  "site.logo": "/images/Yongo-logo-blanco.webp",
  "site.logoSize": "40",
  "epk.pdfUrl": "",

  "section.catalog": "on",
  "section.portfolio": "on",
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

/** Safely parse a JSON-array setting (e.g. sound tags, identity facts). */
export function parseJsonSetting<T>(value: string | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
