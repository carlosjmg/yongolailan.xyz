import { prisma } from "./prisma";

// Sections that can be shown / hidden / marked "coming soon" from the admin.
export const SECTION_KEYS = [
  "catalog",
  "portfolio",
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
  epk: "EPK / Press",
  photos: "Photos & Branding",
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
  "epk.pressQuote":
    "Incredible mix of tradition and modernity in every performance.",
  "epk.pressAttribution": "Press · 2024",
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
