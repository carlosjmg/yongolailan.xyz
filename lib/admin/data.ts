import { prisma } from "@/lib/prisma";
import { getCollection } from "./collections";

export function delegateFor(model: string): any {
  switch (model) {
    case "release":
      return prisma.release;
    case "video":
      return prisma.video;
    case "game":
      return prisma.game;
    case "photo":
      return prisma.photo;
    case "link":
      return prisma.link;
    case "award":
      return prisma.award;
    case "merchItem":
      return prisma.merchItem;
    case "labelArtist":
      return prisma.labelArtist;
    case "labelProduction":
      return prisma.labelProduction;
    default:
      throw new Error(`Unknown model: ${model}`);
  }
}

// Accent- and case-insensitive, so it matches the public directory exactly
// and is identical on SQLite and Postgres (DB collations disagree on í vs i).
function byName(field: string) {
  return (a: Record<string, unknown>, b: Record<string, unknown>) =>
    String(a[field] ?? "").localeCompare(String(b[field] ?? ""), "es", { sensitivity: "base" });
}

export async function getRecords(collectionKey: string): Promise<any[]> {
  const col = getCollection(collectionKey);
  if (!col) return [];
  const rows = await delegateFor(col.model).findMany({
    orderBy: { sortOrder: "asc" },
    ...(col.include ? { include: col.include } : {}),
  });
  if (col.alphabetical) rows.sort(byName(col.titleField));
  return rows;
}

/** Choices for a select whose options come from another table. */
export async function getFieldOptions(
  model: string,
  labelField: string
): Promise<{ value: string; label: string }[]> {
  const rows = await delegateFor(model).findMany({ orderBy: { sortOrder: "asc" } });
  return rows
    .map((r: Record<string, unknown>) => ({
      value: String(r.id),
      label: String(r[labelField] ?? r.id),
    }))
    .sort((a: { label: string }, b: { label: string }) =>
      a.label.localeCompare(b.label, "es", { sensitivity: "base" })
    );
}

export async function getRecord(collectionKey: string, id: string): Promise<any | null> {
  const col = getCollection(collectionKey);
  if (!col) return null;
  return delegateFor(col.model).findUnique({ where: { id } });
}
