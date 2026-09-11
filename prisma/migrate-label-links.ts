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

// A first run of this script (2026-09-11) classified links by domain but
// dropped the one that didn't match any of the five platforms instead of
// keeping it — this puts it back into `otherUrl` now that that field exists.
// Safe to keep: a no-op as soon as the row has been fixed once.
const RECOVER: Record<string, string> = {
  cmtqj8qyy0001sfjrav8zat3y: "https://too.fm/flotandonevacio",
};

async function main() {
  for (const [id, url] of Object.entries(RECOVER)) {
    const row = await prisma.labelProduction.findUnique({ where: { id } });
    if (row && !row.otherUrl && !row.linkUrl) {
      await prisma.labelProduction.update({ where: { id }, data: { otherUrl: url } });
      console.log(`[migrate-label-links] recovered "${row.title}" (${id}) into otherUrl.`);
    }
  }

  // Excludes "" as well as null — old blank submissions before these fields
  // existed left several rows with empty strings, not real values.
  const rows = (
    await prisma.labelProduction.findMany({
      where: { OR: [{ linkUrl: { not: null } }, { audioFile: { not: null } }] },
    })
  ).filter((r) => r.linkUrl || r.audioFile);

  if (rows.length === 0) {
    console.log("[migrate-label-links] nothing to migrate.");
    return;
  }

  let moved = 0;
  let movedToOther = 0;
  for (const row of rows) {
    const data: Record<string, string | null> = {};

    if (row.linkUrl) {
      const field = classify(row.linkUrl);
      if (field && !row[field]) {
        data[field] = row.linkUrl;
        moved++;
      } else if (!row.otherUrl) {
        // Doesn't match a known platform (e.g. a Linktree/too.fm smart link)
        // — keep it rather than discard it.
        data.otherUrl = row.linkUrl;
        movedToOther++;
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

  console.log(`[migrate-label-links] processed ${rows.length} row(s) — moved ${moved}, moved to "other" ${movedToOther}.`);
}

main()
  .catch((e) => {
    console.error("[migrate-label-links] skipped:", e instanceof Error ? e.message : e);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
