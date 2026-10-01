import { prisma } from "../lib/prisma";

// One-time, run once then removed from the build: the admin requested the
// song cover size be set to 200px (matching SoundCloud's track artwork)
// explicitly. The stored value turned out to be a prior custom "105", not
// the old "96" default, so the earlier default-only fix correctly left it
// alone — this sets it directly, as requested.
const KEY = "label.songCoverSize";
const VALUE = "200";

async function main() {
  await prisma.setting.upsert({ where: { key: KEY }, update: { value: VALUE }, create: { key: KEY, value: VALUE } });
  console.log(`[set-song-cover-size-once] set ${KEY} = ${VALUE}.`);
}

main()
  .catch((e) => {
    console.error("[set-song-cover-size-once] skipped:", e instanceof Error ? e.message : e);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
