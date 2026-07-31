"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { setSettings } from "@/lib/settings";
import { isAuthenticated } from "@/lib/session";

async function assertAdmin() {
  if (!(await isAuthenticated())) throw new Error("Unauthorized");
}

/** Generic saver for a flat list of string settings. */
export async function saveSettingsForm(keys: string[], redirectTo: string, formData: FormData) {
  await assertAdmin();
  const entries: Record<string, string> = {};
  for (const k of keys) {
    const v = formData.get(k);
    entries[k] = v === null ? "" : String(v);
  }
  await setSettings(entries);
  revalidatePath("/", "layout");
  redirect(`${redirectTo}?saved=1`);
}

/** About page — photo and biography. */
export async function saveAboutForm(formData: FormData) {
  await assertAdmin();
  const plainKeys = ["about.p1", "about.p2", "about.image"];
  const entries: Record<string, string> = {};
  for (const k of plainKeys) {
    const v = formData.get(k);
    entries[k] = v === null ? "" : String(v);
  }

  await setSettings(entries);
  revalidatePath("/", "layout");
  redirect("/admin/about?saved=1");
}
