import { prisma } from "../lib/prisma";

// ARTeration Fest starter content (the 2026 poster's lineup and partner logos).
// Runs once: a "fest.seeded" marker is stored afterwards, so later edits and
// deletions in the admin are never undone. Safe to run on every build.
const LINEUP = [
  "Misty",
  "Faustino",
  "IKKI",
  "Yongolailan",
  "Luis McDougal",
  "Disco Curandera",
  "Carlos Manuel Rivera",
  "Esteban Vélez",
  "Bhietxa",
  "Chico Raro",
];

const PARTNERS: { name: string; logo: string }[] = [
  { name: "Isklirte", logo: "/images/arteration/logo-isklirte.webp" },
  { name: "Caribbean Sea Sound", logo: "/images/arteration/logo-csound.webp" },
  { name: "Governors Island Arts", logo: "/images/arteration/logo-gia.webp" },
  { name: "NYLAAT", logo: "/images/arteration/logo-nylaat.webp" },
  { name: "Bloomberg Connects", logo: "/images/arteration/logo-bloomberg.webp" },
  { name: "IME", logo: "/images/arteration/logo-ime.webp" },
  { name: "Bronx Brewery", logo: "/images/arteration/logo-bronx.webp" },
];

async function main() {
  const marker = await prisma.setting.findUnique({ where: { key: "fest.seeded" } });
  if (marker && marker.value) {
    console.log("[seed-arteration] already seeded.");
    return;
  }

  if ((await prisma.festArtist.count()) === 0) {
    await prisma.festArtist.createMany({
      data: LINEUP.map((name, i) => ({ name, edition: "2026", sortOrder: i })),
    });
  }
  if ((await prisma.festPartner.count()) === 0) {
    await prisma.festPartner.createMany({
      data: PARTNERS.map((p, i) => ({ ...p, sortOrder: i })),
    });
  }
  await prisma.setting.upsert({
    where: { key: "fest.seeded" },
    update: { value: "1" },
    create: { key: "fest.seeded", value: "1" },
  });
  console.log("[seed-arteration] seeded lineup and partners.");
}

main()
  .catch((e) => console.error("[seed-arteration] skipped:", e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
