import { prisma } from "../lib/prisma";

// One-time fix, run once then removed from the build: the admin settings
// form saves every field on every submit, so the old default ("96") is very
// likely already stored explicitly even though the admin never touched this
// field. Bumping the code default alone wouldn't change anything already
// saved, so this updates the row only if it's still exactly the old default —
// any value the admin actually chose is left alone.
const KEY = "label.songCoverSize";
const OLD_DEFAULT = "96";
const NEW_DEFAULT = "200";

async function main() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  if (!row || row.value !== OLD_DEFAULT) {
    console.log("[bump-song-cover-size-once] nothing to fix.");
    return;
  }
  await prisma.setting.update({ where: { key: KEY }, data: { value: NEW_DEFAULT } });
  console.log(`[bump-song-cover-size-once] updated ${KEY}: ${OLD_DEFAULT} -> ${NEW_DEFAULT}.`);
}

main()
  .catch((e) => {
    console.error("[bump-song-cover-size-once] skipped:", e instanceof Error ? e.message : e);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
