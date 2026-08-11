import { prisma } from "../lib/prisma";
import { slugify } from "../lib/utils";

// Caribbean Sea Sound initial roster — used ONLY to populate a fresh, empty
// database. Once any artist exists, the admin is the single source of truth and
// this never touches the roster again (so it can't fight edits, re-add deleted
// artists, or create duplicates). It always backfills a missing slug, which is
// harmless and keeps every artist reachable.
const ARTISTS = [
  "Arema Arega",
  "Bumbly",
  "Charlie Gonzalez",
  "Cimafunk",
  "Faustino",
  "Golden Brass Collective",
  "Kento Ishimoto",
  "Machiran",
  "Mari Paz",
  "Mucharrima y Los Niches",
  "Reynier Aldana",
  "Rocío Sixto",
  "Rucosmic",
  "Undertrumpet",
  "Víctor Rosso",
  "Victoria Amazónica",
  "Yelfris Valdez",
  "Yongolailan",
  "Yunfa",
];

async function main() {
  const all = await prisma.labelArtist.findMany({ select: { id: true, name: true, slug: true } });

  // Backfill slugs for any artist that lacks one (safe on any DB).
  const taken = new Set(all.map((a) => a.slug).filter(Boolean));
  let fixed = 0;
  for (const a of all) {
    if (a.slug) continue;
    let slug = slugify(a.name) || "artist";
    let n = 2;
    while (taken.has(slug)) slug = `${slugify(a.name)}-${n++}`;
    taken.add(slug);
    await prisma.labelArtist.update({ where: { id: a.id }, data: { slug } });
    fixed++;
  }

  // Only seed the roster on a completely empty table.
  if (all.length > 0) {
    console.log(`[seed-label] roster already has ${all.length} artist(s) — leaving it to the admin (backfilled ${fixed} slug).`);
    return;
  }

  for (let i = 0; i < ARTISTS.length; i++) {
    const name = ARTISTS[i];
    await prisma.labelArtist.create({ data: { name, slug: slugify(name), sortOrder: i, published: true } });
  }
  console.log(`[seed-label] fresh DB — created ${ARTISTS.length} artists.`);
}

main()
  .catch((e) => {
    console.error("[seed-label] skipped:", e instanceof Error ? e.message : e);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
