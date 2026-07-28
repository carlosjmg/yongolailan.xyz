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

function toTags(input: string): string {
  return JSON.stringify(
    input
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
  );
}

function toPairs(input: string): string {
  const pairs = input
    .split(/\r?\n/)
    .map((line) => line.split("|").map((s) => s.trim()))
    .filter((p) => p[0])
    .map((p) => [p[0], p[1] ?? ""]);
  return JSON.stringify(pairs);
}

/** About page — plain text fields plus the "Number | Label" stats grid. */
export async function saveAboutForm(formData: FormData) {
  await assertAdmin();
  const plainKeys = ["about.p1", "about.p2", "about.image", "epk.pressQuote", "epk.pressAttribution"];
  const entries: Record<string, string> = {};
  for (const k of plainKeys) {
    const v = formData.get(k);
    entries[k] = v === null ? "" : String(v);
  }
  entries["about.stats"] = toPairs(String(formData.get("stats") || ""));

  await setSettings(entries);
  revalidatePath("/", "layout");
  redirect("/admin/about?saved=1");
}
