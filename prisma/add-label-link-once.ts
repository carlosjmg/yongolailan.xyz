import { prisma } from "../lib/prisma";

// One-time content add, run once then removed from the build: a link to the
// Caribbean Sea Sound label page in the "Everywhere" links grid.
const URL = "https://yongolailan.xyz/caribbean-sea-sound";

async function main() {
  const existing = await prisma.link.findFirst({ where: { url: URL } });
  if (existing) {
    console.log("[add-label-link-once] already present, nothing to do.");
    return;
  }
  const last = await prisma.link.findFirst({ orderBy: { sortOrder: "desc" } });
  await prisma.link.create({
    data: {
      name: "Caribbean Sea Sound",
      handle: "caribbeanseasound.xyz",
      url: URL,
      color: "#00a3b4",
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
  console.log("[add-label-link-once] added the Caribbean Sea Sound link.");
}

main()
  .catch((e) => {
    console.error("[add-label-link-once] skipped:", e instanceof Error ? e.message : e);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
