import { prisma } from "../lib/prisma";

// One-time: put "Sueño Tropical" third in the Music Catalog (Just Another Day
// is first via catalog.latest, then one pinned title, then Sueño Tropical).
// Idempotent: a no-op once Sueño Tropical already sits at index 1 of the list.
const KEY = "catalog.pinned";
const DEFAULT = "Sueño Tropical, Havanece, Chinatown Downtown";
const norm = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();

async function main() {
  const row = await prisma.setting.findUnique({ where: { key: KEY } });
  const current = row ? row.value : DEFAULT;
  const list = current.split(/[,\n]/).map((t) => t.trim()).filter(Boolean);
  const idx = list.findIndex((t) => norm(t) === norm("Sueño Tropical"));
  const name = idx === -1 ? "Sueño Tropical" : list[idx];
  const rest = list.filter((_, i) => i !== idx);
  rest.splice(Math.min(1, rest.length), 0, name);
  const next = rest.join(", ");
  if (next === list.join(", ") && row) {
    console.log("[move-sueno-third] already in place.");
    return;
  }
  await prisma.setting.upsert({ where: { key: KEY }, update: { value: next }, create: { key: KEY, value: next } });
  console.log(`[move-sueno-third] ${KEY}: "${current}" -> "${next}"`);
}

main()
  .catch((e) => console.error("[move-sueno-third] skipped:", e))
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
