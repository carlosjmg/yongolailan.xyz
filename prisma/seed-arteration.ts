import { prisma } from "../lib/prisma";
import { SEED_ARTISTS } from "../lib/fest-content";

// ARTeration Fest starter content: the lineup with bilingual bios and photos,
// plus the partner logos from the poster. Runs once per VERSION (a marker is
// stored afterwards), and only ever fills what is empty, so edits made in the
// admin are never overwritten. Safe to run on every build.
const VERSION = "2";

const PARTNERS: { name: string; logo: string }[] = [
  { name: "Isklirte", logo: "/images/arteration/logo-isklirte.webp" },
  { name: "Caribbean Sea Sound", logo: "/images/arteration/logo-csound.webp" },
  { name: "Governors Island Arts", logo: "/images/arteration/logo-gia.webp" },
  { name: "NYLAAT", logo: "/images/arteration/logo-nylaat.webp" },
  { name: "Bloomberg Connects", logo: "/images/arteration/logo-bloomberg.webp" },
  { name: "IME", logo: "/images/arteration/logo-ime.webp" },
  { name: "Bronx Brewery", logo: "/images/arteration/logo-bronx.webp" },
];

// Texts that an earlier version of the page seeded as defaults. If the stored
// value is still exactly that, drop it so the new default shows instead.
const OLD_DEFAULTS: Record<string, string> = {
  "fest.tagline": "Music and art, outdoors on Governors Island.",
  "fest.date": "August 15",
  "fest.about1":
    "ARTeration Fest brings music and art together outdoors, in Nolan Park on Governors Island, New York. One afternoon, one lineup, and a crowd that comes to discover.",
  "fest.about2":
    "Curated by Alexis Mendoza, produced by Carlos José Martínez and presented by NYLAAT, the festival is a meeting point for artists and audiences from across the city and the Caribbean diaspora.",
};

const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

async function main() {
  const marker = await prisma.setting.findUnique({ where: { key: "fest.seedVersion" } });
  if (marker && marker.value === VERSION) {
    console.log("[seed-arteration] already up to date.");
    return;
  }

  // Artists
  const existing = await prisma.festArtist.findMany();
  let created = 0;
  let filled = 0;
  for (let i = 0; i < SEED_ARTISTS.length; i++) {
    const seed = SEED_ARTISTS[i];
    const found = existing.find((a) => norm(a.name) === norm(seed.name));
    if (!found) {
      await prisma.festArtist.create({
        data: {
          name: seed.name,
          role: seed.role,
          roleEs: seed.roleEs,
          bio: seed.bio,
          bioEs: seed.bioEs,
          image: seed.image,
          instagramUrl: seed.instagramUrl ?? null,
          edition: "2026",
          sortOrder: i,
        },
      });
      created++;
      continue;
    }
    const data: Record<string, string> = {};
    if (!found.role && seed.role) data.role = seed.role;
    if (!found.roleEs && seed.roleEs) data.roleEs = seed.roleEs;
    if (!found.bio && seed.bio) data.bio = seed.bio;
    if (!found.bioEs && seed.bioEs) data.bioEs = seed.bioEs;
    if (!found.image && seed.image) data.image = seed.image;
    if (Object.keys(data).length) {
      await prisma.festArtist.update({ where: { id: found.id }, data });
      filled++;
    }
  }

  // Partners (only on a fresh table)
  if ((await prisma.festPartner.count()) === 0) {
    await prisma.festPartner.createMany({ data: PARTNERS.map((p, i) => ({ ...p, sortOrder: i })) });
  }

  // Old default texts -> new defaults
  let reset = 0;
  for (const [key, oldValue] of Object.entries(OLD_DEFAULTS)) {
    const { count } = await prisma.setting.deleteMany({ where: { key, value: oldValue } });
    reset += count;
  }

  await prisma.setting.upsert({
    where: { key: "fest.seedVersion" },
    update: { value: VERSION },
    create: { key: "fest.seedVersion", value: VERSION },
  });
  console.log(`[seed-arteration] artists created: ${created}, filled: ${filled}; texts reset: ${reset}.`);
}

main()
  .catch((e) => console.error("[seed-arteration] skipped:", e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
