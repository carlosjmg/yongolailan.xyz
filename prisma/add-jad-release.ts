import { prisma } from "../lib/prisma";

// One-time: add "Just Another Day" to the Music Catalog, built from the info
// already on its landing page (/just-another-day). Idempotent: does nothing if
// a release with that title already exists, so later edits in the admin are
// never overwritten. Safe to run on every build.
const TITLE = "Just Another Day";

async function main() {
  const existing = await prisma.release.findFirst({ where: { title: TITLE }, select: { id: true } });
  if (existing) {
    console.log("[add-jad-release] already in the catalog, nothing to do.");
    return;
  }

  const rows = await prisma.setting.findMany({ where: { key: { startsWith: "jad." } } });
  const s: Record<string, string> = {};
  for (const r of rows) s[r.key] = (r.value || "").trim();
  const link = (...keys: string[]) => {
    for (const k of keys) if (s[k]) return s[k];
    return null;
  };

  const description =
    s["jad.info"] ||
    "The new single from Arema Arega & Yongolailan, a nocturnal, palm-lit groove born between the Caribbean and New York. Out now on Caribbean Sea Sound. Name your price on Bandcamp.";

  // Release year from the landing page's release date, if one is set.
  const year = /^(\d{4})/.exec(s["jad.releaseDate"] || "")?.[1] || "2026";

  // Newest release goes first in the catalog.
  const first = await prisma.release.findFirst({ orderBy: { sortOrder: "asc" }, select: { sortOrder: true } });
  const sortOrder = first ? first.sortOrder - 1 : 0;

  await prisma.release.create({
    data: {
      title: TITLE,
      year,
      genre: "",
      releaseType: "Single",
      description,
      credits: "Arema Arega & Yongolailan · Caribbean Sea Sound",
      coverImage: "/images/just-another-day-cover.jpg",
      accentColor: "#f26a1f",
      spotifyUrl: link("jad.spotify"),
      appleUrl: link("jad.apple"),
      soundcloudUrl: link("jad.soundcloud"),
      youtubeUrl: link("jad.youtubemusic", "jad.youtube"),
      bandcampUrl: link("jad.bandcamp"),
      buyUrl: link("jad.bandcamp"),
      featured: false,
      published: true,
      sortOrder,
    },
  });
  console.log("[add-jad-release] added Just Another Day to the catalog.");
}

main()
  .catch((e) => {
    // Never fail the deploy over this.
    console.error("[add-jad-release] skipped:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
