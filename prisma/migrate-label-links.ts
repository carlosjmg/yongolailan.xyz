import { prisma } from "../lib/prisma";

// One-time migration: the old single `linkUrl` field on LabelProduction was
// replaced by five platform-specific fields (see lib/admin/collections.ts).
// This copies each existing link into the right platform field by matching
// its domain, then clears both legacy fields (audioFile has no replacement —
// the on-site player was removed) so a later `db push` can drop them with no
// data loss. Idempotent: once a row has no legacy value left, it's a no-op.
const PLATFORM_BY_HOST: { match: string; field: "spotifyUrl" | "appleUrl" | "soundcloudUrl" | "youtubeUrl" | "bandcampUrl" }[] = [
  { match: "spotify.com", field: "spotifyUrl" },
  { match: "music.apple.com", field: "appleUrl" },
  { match: "itunes.apple.com", field: "appleUrl" },
  { match: "soundcloud.com", field: "soundcloudUrl" },
  { match: "youtube.com", field: "youtubeUrl" },
  { match: "youtu.be", field: "youtubeUrl" },
  { match: "bandcamp.com", field: "bandcampUrl" },
];

function classify(url: string) {
  const hit = PLATFORM_BY_HOST.find((p) => url.includes(p.match));
  return hit?.field;
}

async function main() {
  const rows = await prisma.labelProduction.findMany({
    where: { OR: [{ linkUrl: { not: null } }, { audioFile: { not: null } }] },
  });

  if (rows.length === 0) {
    console.log("[migrate-label-links] nothing to migrate.");
    return;
  }

  let moved = 0;
  let unclassified = 0;
  for (const row of rows) {
    const data: Record<string, string | null> = {};

    if (row.linkUrl) {
      const field = classify(row.linkUrl);
      if (field && !row[field]) {
        data[field] = row.linkUrl;
        moved++;
      } else if (!field) {
        unclassified++;
        console.log(`[migrate-label-links] "${row.title}" (${row.id}) — couldn't classify: ${row.linkUrl}`);
      }
      data.linkUrl = null;
    }

    if (row.audioFile) {
      // No replacement for the on-site player — intentionally dropped.
      data.audioFile = null;
    }

    if (Object.keys(data).length > 0) {
      await prisma.labelProduction.update({ where: { id: row.id }, data });
    }
  }

  console.log(`[migrate-label-links] processed ${rows.length} row(s) — moved ${moved}, unclassified ${unclassified}.`);
}

main()
  .catch((e) => {
    console.error("[migrate-label-links] skipped:", e instanceof Error ? e.message : e);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
