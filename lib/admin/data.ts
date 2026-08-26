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

export async function getRecords(collectionKey: string): Promise<any[]> {
  const col = getCollection(collectionKey);
  if (!col) return [];
  return delegateFor(col.model).findMany({
    orderBy: { sortOrder: "asc" },
    ...(col.include ? { include: col.include } : {}),
  });
}

/** Choices for a select whose options come from another table. */
export async function getFieldOptions(
  model: string,
  labelField: string
): Promise<{ value: string; label: string }[]> {
  const rows = await delegateFor(model).findMany({ orderBy: { sortOrder: "asc" } });
  return rows.map((r: Record<string, unknown>) => ({
    value: String(r.id),
    label: String(r[labelField] ?? r.id),
  }));
}

export async function getRecord(collectionKey: string, id: string): Promise<any | null> {
  const col = getCollection(collectionKey);
  if (!col) return null;
  return delegateFor(col.model).findUnique({ where: { id } });
}
