import { prisma } from "@/lib/prisma";
import { getCollection } from "./collections";

export function delegateFor(model: string): any {
  switch (model) {
    case "release":
      return prisma.release;
    case "portfolioItem":
      return prisma.portfolioItem;
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
    default:
      throw new Error(`Unknown model: ${model}`);
  }
}

export async function getRecords(collectionKey: string): Promise<any[]> {
  const col = getCollection(collectionKey);
  if (!col) return [];
  return delegateFor(col.model).findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getRecord(collectionKey: string, id: string): Promise<any | null> {
  const col = getCollection(collectionKey);
  if (!col) return null;
  return delegateFor(col.model).findUnique({ where: { id } });
}
