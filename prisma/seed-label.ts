import { prisma } from "../lib/prisma";
import { slugify } from "../lib/utils";

// Caribbean Sea Sound initial roster. Alphabetical; the site sorts by name too,
// so future additions slot in automatically. No bios/photos/songs are invented
// here — each record is created empty for the artist to fill from the admin.
// Runs on every deploy but only ever CREATES missing artists (never overwrites
// edited fields), so it is safe to re-run.
const ARTISTS = [
  "Arema Arega",
  "Bumbly",
  "Charlie Gonzalez",
  "Faustino",
  "Golden Brass Collective",
  "Kento",
  "Machiran",
  "Mari Paz",
  "Negrones",
  "Reynier Aldana",
  "Rocío Sixto",
  "Rucosmic",
  "Víctor Rosso",
  "Victoria Amazónica",
  "Yoly Mayor",
  "Yongolailan",
  "Yunfa",
];

async function uniqueSlug(base: string, takenBy: Map<string, string>, id: string): Promise<string> {
  let slug = base || "artist";
  for (let i = 2; i < 500; i++) {
    const owner = takenBy.get(slug);
    if (!owner || owner === id) {
      takenBy.set(slug, id);
      return slug;
    }
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

async function main() {
  // Backfill slugs first, so any artist that predates the slug column (or was
  // created before this feature) becomes reachable. Never touches other fields.
  const all = await prisma.labelArtist.findMany({ select: { id: true, name: true, slug: true } });
  const takenBy = new Map<string, string>();
  for (const a of all) if (a.slug) takenBy.set(a.slug, a.id);
  let fixed = 0;
  for (const a of all) {
    if (a.slug) continue;
    const slug = await uniqueSlug(slugify(a.name), takenBy, a.id);
    await prisma.labelArtist.update({ where: { id: a.id }, data: { slug } });
    fixed++;
  }

  const existingNames = new Set(all.map((a) => a.name));
  const existingSlugs = new Set(all.map((a) => a.slug).filter(Boolean));

  let created = 0;
  for (let i = 0; i < ARTISTS.length; i++) {
    const name = ARTISTS[i];
    const slug = slugify(name);
    if (existingNames.has(name) || existingSlugs.has(slug)) continue;
    await prisma.labelArtist.create({ data: { name, slug, sortOrder: i, published: true } });
    existingNames.add(name);
    existingSlugs.add(slug);
    created++;
  }
  console.log(`[seed-label] created ${created} new artist(s), backfilled ${fixed} slug(s).`);
}

main()
  .catch((e) => {
    // Never fail the build on a seed hiccup — the schema is already applied.
    console.error("[seed-label] skipped:", e instanceof Error ? e.message : e);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
