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

/** EPK / bio page — mixes plain text fields with tag/pair transforms. */
export async function saveEpkForm(formData: FormData) {
  await assertAdmin();
  const plainKeys = [
    "about.p1",
    "about.p2",
    "epk.bio1",
    "epk.bio2",
    "epk.bio3",
    "epk.oneLiner",
    "epk.sound",
    "epk.performance",
    "epk.recognition",
    "epk.pressQuote",
    "epk.pressAttribution",
  ];
  const entries: Record<string, string> = {};
  for (const k of plainKeys) {
    const v = formData.get(k);
    entries[k] = v === null ? "" : String(v);
  }
  entries["epk.soundTags"] = toTags(String(formData.get("soundTags") || ""));
  entries["epk.identityFacts"] = toPairs(String(formData.get("identityFacts") || ""));
  entries["about.stats"] = toPairs(String(formData.get("stats") || ""));

  await setSettings(entries);
  revalidatePath("/", "layout");
  redirect("/admin/epk?saved=1");
}
