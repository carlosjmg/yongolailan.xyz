import { prisma } from "../lib/prisma";

// One-time: give the "Silent Notes" film its poster (public/images/silent-notes-poster.webp).
// Idempotent: a no-op once it's set.
const POSTER = "/images/silent-notes-poster.webp";

async function main() {
  const { count } = await prisma.video.updateMany({
    where: { title: { startsWith: "Silent Notes" }, NOT: { thumbnail: POSTER } },
    data: { thumbnail: POSTER },
  });
  console.log(count ? `[silent-notes-poster] set on ${count} video(s).` : "[silent-notes-poster] nothing to do.");
}

main()
  .catch((e) => console.error("[silent-notes-poster] skipped:", e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
