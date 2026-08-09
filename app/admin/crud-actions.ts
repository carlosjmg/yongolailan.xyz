"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/session";
import { getCollection } from "@/lib/admin/collections";
import { delegateFor } from "@/lib/admin/data";
import { slugify } from "@/lib/utils";

async function assertAdmin() {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
}

/** A slug unique within the model, derived from `source` (e.g. an artist name). */
async function uniqueSlug(model: string, source: string, currentId: string | null): Promise<string> {
  const base = slugify(source) || "item";
  const delegate = delegateFor(model);
  let slug = base;
  for (let i = 2; i < 500; i++) {
    const clash = await delegate.findFirst({ where: { slug }, select: { id: true } });
    if (!clash || clash.id === currentId) return slug;
    slug = `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

export async function saveRecord(collectionKey: string, id: string | null, formData: FormData) {
  await assertAdmin();
  const col = getCollection(collectionKey);
  if (!col) throw new Error("Unknown collection");
  const delegate = delegateFor(col.model);

  const data: Record<string, unknown> = {};
  for (const f of col.fields) {
    if (f.type === "boolean") {
      data[f.name] = formData.get(f.name) === "on";
      continue;
    }
    const raw = formData.get(f.name);
    const value = raw === null ? "" : String(raw).trim();
    if (value) {
      data[f.name] = value;
    } else if (f.required) {
      throw new Error(`${f.label} is required.`);
    } else if (f.type === "color") {
      // Color columns are non-nullable with a DB default — omit when empty so
      // the default (on create) or the existing value (on update) is kept.
      continue;
    } else {
      // Empty string is safe for both nullable and non-nullable text columns,
      // and reads as "absent" everywhere on the site.
      data[f.name] = "";
    }
  }

  // Keep a URL-safe slug in sync for collections that route by it.
  if (col.slugFrom) {
    const source = String(data[col.slugFrom] ?? "");
    data.slug = await uniqueSlug(col.model, source, id);
  }

  if (id) {
    await delegate.update({ where: { id }, data });
  } else {
    const last = await delegate.findFirst({ orderBy: { sortOrder: "desc" } });
    (data as { sortOrder?: number }).sortOrder = (last?.sortOrder ?? -1) + 1;
    await delegate.create({ data });
  }

  revalidatePath("/");
  revalidatePath(`/admin/${collectionKey}`);
  redirect(`/admin/${collectionKey}`);
}

export async function deleteRecord(collectionKey: string, id: string) {
  await assertAdmin();
  const col = getCollection(collectionKey);
  if (!col) return;
  await delegateFor(col.model).delete({ where: { id } });
  revalidatePath("/");
  revalidatePath(`/admin/${collectionKey}`);
}

export async function reorderRecord(collectionKey: string, id: string, dir: "up" | "down") {
  await assertAdmin();
  const col = getCollection(collectionKey);
  if (!col) return;
  const delegate = delegateFor(col.model);

  const rec = await delegate.findUnique({ where: { id } });
  if (!rec) return;

  const neighbor = await delegate.findFirst({
    where: dir === "up" ? { sortOrder: { lt: rec.sortOrder } } : { sortOrder: { gt: rec.sortOrder } },
    orderBy: { sortOrder: dir === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    delegate.update({ where: { id: rec.id }, data: { sortOrder: neighbor.sortOrder } }),
    delegate.update({ where: { id: neighbor.id }, data: { sortOrder: rec.sortOrder } }),
  ]);

  revalidatePath("/");
  revalidatePath(`/admin/${collectionKey}`);
}
