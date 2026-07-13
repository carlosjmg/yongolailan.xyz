import { prisma } from "../lib/prisma";

// Real content pulled from the existing site + the artist's planning docs.
// Streaming/social URLs are intentionally left blank so the site never shows
// dead links — the artist fills them in from the admin panel.

const RELEASES = [
  {
    title: "Ọ̀SUN",
    year: "2024",
    genre: "Afro-Cuban Electronic",
    description: "A ritual invocation of the Yoruba orisha of love and rivers.",
    credits: "Produced by Yongolailan",
    accentColor: "oklch(62% 0.18 60)",
    sortOrder: 0,
  },
  {
    title: "YEMAYA",
    year: "2024",
    genre: "Afro-Cuban House",
    description: "Deep ocean rhythms honoring the mother of waters.",
    credits: "Produced by Yongolailan · Caribbean Sea Sound",
    accentColor: "oklch(62% 0.14 220)",
    featured: true,
    featuredType: "Latest Single",
    sortOrder: 1,
  },
  {
    title: "Sueño Tropical",
    year: "2015",
    genre: "Electroacoustic",
    description: "Debut album. Cubadisco Award winner — electroacoustic category.",
    credits: "Produced by Yongolailan · Award: Cubadisco 2015",
    accentColor: "oklch(62% 0.14 165)",
    featured: true,
    featuredType: "Featured Release",
    sortOrder: 2,
  },
  {
    title: "HAVANECE",
    year: "2023",
    genre: "Latin Afrobeat",
    description: "The pulse of Havana refracted through Brooklyn nights.",
    credits: "Produced by Yongolailan · Caribbean Sea Sound",
    accentColor: "oklch(62% 0.16 25)",
    sortOrder: 3,
  },
  {
    title: "OBATALA",
    year: "2023",
    genre: "Electronic Ritual",
    description: "White light and ancient wisdom in electronic form.",
    credits: "Produced by Yongolailan",
    accentColor: "oklch(80% 0.04 60)",
    sortOrder: 4,
  },
  {
    title: "PALO-HIGH-YONGO",
    year: "2022",
    genre: "Caribbean Diaspora",
    description: "Afro-Cuban Palo traditions fused with contemporary electronics.",
    credits: "Produced by Yongolailan · Caribbean Sea Sound",
    accentColor: "oklch(55% 0.12 30)",
    sortOrder: 5,
  },
  {
    title: "ONAKE",
    year: "2022",
    genre: "Afro-Electronic",
    description: "Percussive energy channeling deep Afro-diasporic roots.",
    credits: "Produced by Yongolailan",
    accentColor: "oklch(62% 0.15 300)",
    sortOrder: 6,
  },
  {
    title: "VA & VEN",
    year: "2021",
    genre: "Collaboration",
    description: "A trans-Atlantic dance between two musical worlds.",
    credits: "ft. Machiran · Produced by Yongolailan",
    accentColor: "oklch(62% 0.14 140)",
    sortOrder: 7,
  },
  {
    title: "EYEIFE Festival Mix",
    year: "2024",
    genre: "Live Mix Session",
    description: "Official festival mix session — EYEIFE 2024 Official Mention.",
    credits: "Live Set · EYEIFE Festival",
    accentColor: "oklch(62% 0.14 200)",
    featured: true,
    featuredType: "Live Session",
    sortOrder: 8,
  },
];

const PORTFOLIO = [
  {
    area: "music",
    title: "Music",
    subtitle: "Caribbean Sea Sound",
    description:
      "Brooklyn-based label & platform founded by Yongolailan. A hub for Caribbean diaspora music, international collaborations, and Afro-Cuban electronic production. Collaborators include Cimafunk, Arema Arega, Reinier Aldana, Raúl Paz.",
    tag: "Record Label · Production",
    color: "oklch(72% 0.16 60)",
    sortOrder: 0,
  },
  {
    area: "films",
    title: "Films",
    subtitle: "Visual Narratives",
    description:
      "Music videos, short films, and visual art pieces connecting Afro-Caribbean storytelling with electronic aesthetics. Full film portfolio available on request.",
    tag: "Film · Music Video",
    color: "oklch(72% 0.14 200)",
    sortOrder: 1,
  },
  {
    area: "games",
    title: "Games",
    subtitle: "Interactive Worlds",
    description:
      "Exploring Caribbean cultural heritage through interactive game experiences. Sound design, narrative design, and cultural consultation.",
    tag: "Game Design · Sound",
    color: "oklch(72% 0.14 140)",
    sortOrder: 2,
  },
  {
    area: "web",
    title: "Web Experiences",
    subtitle: "Digital Islands",
    description:
      "Immersive web experiences and digital art installations. Building the future digital island for Yongolailan — a Three.js-powered interactive sonic world.",
    tag: "Web · Immersive Tech",
    color: "oklch(72% 0.14 300)",
    sortOrder: 3,
  },
];

const LINKS = [
  { name: "Instagram", handle: "@yongolailan", color: "oklch(62% 0.18 350)" },
  { name: "Spotify", handle: "Yongolailan", color: "oklch(72% 0.18 140)" },
  { name: "YouTube", handle: "Yongolailan", color: "oklch(62% 0.18 25)" },
  { name: "SoundCloud", handle: "yongolailan", color: "oklch(65% 0.18 40)" },
  { name: "Apple Music", handle: "Yongolailan", color: "oklch(65% 0.16 0)" },
  { name: "Bandcamp", handle: "yongolailan", color: "oklch(58% 0.16 200)" },
  { name: "TikTok", handle: "@yongolailan", color: "oklch(75% 0.05 200)" },
  { name: "Tidal", handle: "Yongolailan", color: "oklch(72% 0.14 220)" },
  { name: "YouTube Music", handle: "Yongolailan", color: "oklch(62% 0.18 20)" },
  { name: "Deezer", handle: "Yongolailan", color: "oklch(62% 0.18 280)" },
  { name: "Pandora", handle: "Yongolailan", color: "oklch(62% 0.16 250)" },
  { name: "Linktree", handle: "yongolailan", color: "oklch(72% 0.16 60)" },
  { name: "X / Twitter", handle: "@yongolailan", color: "oklch(68% 0.01 200)" },
].map((l, i) => ({ ...l, url: "#", sortOrder: i }));

const AWARDS = [
  { title: "Cubadisco Award", year: "2015", note: "Electroacoustic category — Sueño Tropical", sortOrder: 0 },
  { title: "EYEIFE Festival", year: "2024", note: "Official Mention", sortOrder: 1 },
  { title: "EYEIFE Festival", year: "2025", note: "Official Mention", sortOrder: 2 },
];

const PHOTOS = [
  { image: "/images/IMG_8117.webp", caption: "Live Performance · Press Photo", category: "press", sortOrder: 0 },
  { image: "/images/ICE.webp", caption: "Artist Photo · Press Ready", category: "artist", sortOrder: 1 },
];

async function main() {
  if ((await prisma.release.count()) === 0) {
    await prisma.release.createMany({ data: RELEASES });
    console.log(`Seeded ${RELEASES.length} releases.`);
  }
  if ((await prisma.portfolioItem.count()) === 0) {
    await prisma.portfolioItem.createMany({ data: PORTFOLIO });
    console.log(`Seeded ${PORTFOLIO.length} portfolio items.`);
  }
  if ((await prisma.link.count()) === 0) {
    await prisma.link.createMany({ data: LINKS });
    console.log(`Seeded ${LINKS.length} links.`);
  }
  if ((await prisma.award.count()) === 0) {
    await prisma.award.createMany({ data: AWARDS });
    console.log(`Seeded ${AWARDS.length} awards.`);
  }
  if ((await prisma.photo.count()) === 0) {
    await prisma.photo.createMany({ data: PHOTOS });
    console.log(`Seeded ${PHOTOS.length} photos.`);
  }
  console.log("Seed complete.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
