import { prisma } from "../lib/prisma";

// One-time fix, run once then removed from the build: label artists used to
// always display A-Z regardless of their stored sortOrder (the field only
// ever reflected creation order). Now that manual ↑ ↓ reordering is enabled,
// sortOrder has to actually mean something, so this normalizes it to
// alphabetical order once, matching what the site already looked like.
// Deliberately NOT idempotent-forever: running this again after an admin
// drags artists into a custom order would silently undo that, so it's
// removed from package.json's build step right after it ships.
async function main() {
  const artists = await prisma.labelArtist.findMany({ orderBy: { sortOrder: "asc" } });
  const sorted = [...artists].sort((a, b) => a.name.localeCompare(b.name, "es", { sensitivity: "base" }));

  const already = sorted.every((a, i) => a.id === artists[i].id);
  if (already) {
    console.log("[sort-label-artists-once] already alphabetical, nothing to do.");
    return;
  }

  await prisma.$transaction(sorted.map((a, i) => prisma.labelArtist.update({ where: { id: a.id }, data: { sortOrder: i } })));
  console.log(`[sort-label-artists-once] reordered ${sorted.length} artist(s) alphabetically.`);
}

main()
  .catch((e) => {
    console.error("[sort-label-artists-once] skipped:", e instanceof Error ? e.message : e);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
