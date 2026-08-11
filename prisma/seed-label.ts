import { prisma } from "../lib/prisma";
import { slugify } from "../lib/utils";

// Caribbean Sea Sound roster. Alphabetised by the site at render time, so the
// order here doesn't matter. No bios/photos/songs are invented — records are
// created empty for the artist to fill from the admin. Runs on every deploy
// but is fully idempotent and never overwrites edited content.
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
  "Mucharima y Los Niches",
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

// One-off name corrections. Applied only when the old name still exists and the
// new name is free, so re-running (or the artist renaming again) is a no-op.
const RENAMES: [string, string][] = [
  ["Kento", "Kento Ishimoto"],
  ["Negrones", "Mucharima y Los Niches"],
];

// Artists to drop — but only while still empty, so nothing you've filled in is
// ever deleted.
const REMOVALS = ["Yoly Mayor"];

function uniqueSlug(base: string, takenBy: Map<string, string>, id: string): string {
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
  const all = await prisma.labelArtist.findMany({
    include: { _count: { select: { productions: true } } },
  });
  const byName = new Map(all.map((a) => [a.name, a]));
  const takenBy = new Map<string, string>();
  for (const a of all) if (a.slug) takenBy.set(a.slug, a.id);

  // Backfill any missing slug so every artist is reachable.
  let fixed = 0;
  for (const a of all) {
    if (a.slug) continue;
    const slug = uniqueSlug(slugify(a.name), takenBy, a.id);
    await prisma.labelArtist.update({ where: { id: a.id }, data: { slug } });
    a.slug = slug;
    fixed++;
  }

  // Renames.
  let renamed = 0;
  for (const [oldName, newName] of RENAMES) {
    const old = byName.get(oldName);
    if (!old || byName.has(newName)) continue;
    const slug = uniqueSlug(slugify(newName), takenBy, old.id);
    await prisma.labelArtist.update({ where: { id: old.id }, data: { name: newName, slug } });
    byName.delete(oldName);
    byName.set(newName, { ...old, name: newName, slug });
    renamed++;
  }

  // Removals — only if the record is still empty.
  let removed = 0;
  const kept: string[] = [];
  for (const name of REMOVALS) {
    const a = byName.get(name);
    if (!a) continue;
    const empty = !a.bio && !a.shortDescription && !a.image && !a.profileImage && a._count.productions === 0;
    if (!empty) {
      kept.push(name);
      continue;
    }
    await prisma.labelArtist.delete({ where: { id: a.id } });
    byName.delete(name);
    removed++;
  }

  // Create anything still missing (e.g. Cimafunk).
  let created = 0;
  for (let i = 0; i < ARTISTS.length; i++) {
    const name = ARTISTS[i];
    if (byName.has(name)) continue;
    const slug = uniqueSlug(slugify(name), takenBy, "new");
    await prisma.labelArtist.create({ data: { name, slug, sortOrder: i, published: true } });
    byName.set(name, { name } as never);
    created++;
  }

  console.log(
    `[seed-label] created ${created}, renamed ${renamed}, removed ${removed}, backfilled ${fixed} slug(s)` +
      (kept.length ? `; kept (had content): ${kept.join(", ")}` : "")
  );
}

main()
  .catch((e) => {
    console.error("[seed-label] skipped:", e instanceof Error ? e.message : e);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
