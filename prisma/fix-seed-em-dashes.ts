import { prisma } from "../lib/prisma";

// One-time cleanup: a few of the original seed defaults used an em dash
// ("text — more text") and are still live wherever the admin never edited
// that field. Each entry below is an exact old→new pair, so this only ever
// touches rows that still match the original seed text verbatim — anything
// the admin has since edited is left alone. Idempotent: a no-op once fixed.
const AWARD_NOTE_FIXES: Record<string, string> = {
  "Electroacoustic category — Sueño Tropical": "Electroacoustic category: Sueño Tropical",
};

const RELEASE_DESCRIPTION_FIXES: Record<string, string> = {
  "Debut album. Cubadisco Award winner — electroacoustic category.":
    "Debut album. Cubadisco Award winner, electroacoustic category.",
  "Official festival mix session — EYEIFE 2024 Official Mention.":
    "Official festival mix session, EYEIFE 2024 Official Mention.",
};

const PORTFOLIO_DESCRIPTION_FIXES: Record<string, string> = {
  "Immersive web experiences and digital art installations. Building the future digital island for Yongolailan — a Three.js-powered interactive sonic world.":
    "Immersive web experiences and digital art installations. Building the future digital island for Yongolailan, a Three.js-powered interactive sonic world.",
};

async function main() {
  let fixed = 0;

  for (const [oldText, newText] of Object.entries(AWARD_NOTE_FIXES)) {
    const { count } = await prisma.award.updateMany({ where: { note: oldText }, data: { note: newText } });
    fixed += count;
  }
  for (const [oldText, newText] of Object.entries(RELEASE_DESCRIPTION_FIXES)) {
    const { count } = await prisma.release.updateMany({ where: { description: oldText }, data: { description: newText } });
    fixed += count;
  }
  for (const [oldText, newText] of Object.entries(PORTFOLIO_DESCRIPTION_FIXES)) {
    const { count } = await prisma.portfolioItem.updateMany({ where: { description: oldText }, data: { description: newText } });
    fixed += count;
  }

  console.log(fixed > 0 ? `[fix-seed-em-dashes] fixed ${fixed} row(s).` : "[fix-seed-em-dashes] nothing to fix.");
}

main()
  .catch((e) => {
    console.error("[fix-seed-em-dashes] skipped:", e instanceof Error ? e.message : e);
    process.exit(0);
  })
  .finally(() => prisma.$disconnect());
