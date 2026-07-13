import { getAllSettings, parseJsonSetting } from "@/lib/settings";
import { saveEpkForm } from "../settings-actions";
import { TextSetting, TextareaSetting, GroupHeading, SavedNote } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function EpkPage({ searchParams }: { searchParams: { saved?: string } }) {
  const s = await getAllSettings();

  const soundTags = parseJsonSetting<string[]>(s["epk.soundTags"], []).join(", ");
  const identityFacts = parseJsonSetting<[string, string][]>(s["epk.identityFacts"], [])
    .map(([k, v]) => `${k} | ${v}`)
    .join("\n");
  const stats = parseJsonSetting<[string, string][]>(s["about.stats"], [])
    .map(([n, l]) => `${n} | ${l}`)
    .join("\n");

  return (
    <div>
      <h1 className="admin-h1">EPK &amp; Bio</h1>
      <p className="admin-sub">Everything in the About and EPK / Press sections.</p>
      <SavedNote show={Boolean(searchParams?.saved)} />

      <form action={saveEpkForm} className="admin-panel" style={{ maxWidth: "700px" }}>
        <GroupHeading>About section</GroupHeading>
        <TextareaSetting name="about.p1" label="About — paragraph 1" value={s["about.p1"]} rows={3} />
        <TextareaSetting name="about.p2" label="About — paragraph 2" value={s["about.p2"]} rows={3} />
        <TextareaSetting
          name="stats"
          label="About stats"
          value={stats}
          rows={4}
          help="One per line, as: Number | Label   (e.g. 10+ | Years Active)"
        />

        <GroupHeading>EPK bio</GroupHeading>
        <TextareaSetting name="epk.bio1" label="Biography — paragraph 1" value={s["epk.bio1"]} rows={3} />
        <TextareaSetting name="epk.bio2" label="Biography — paragraph 2" value={s["epk.bio2"]} rows={3} />
        <TextareaSetting name="epk.bio3" label="Biography — paragraph 3" value={s["epk.bio3"]} rows={3} />

        <GroupHeading>EPK quick facts</GroupHeading>
        <TextSetting name="epk.oneLiner" label="One-liner" value={s["epk.oneLiner"]} />
        <TextSetting name="epk.sound" label="Sound" value={s["epk.sound"]} />
        <TextSetting name="epk.performance" label="Performance" value={s["epk.performance"]} />
        <TextSetting name="epk.recognition" label="Recognition" value={s["epk.recognition"]} />

        <GroupHeading>Press &amp; identity</GroupHeading>
        <TextareaSetting name="epk.pressQuote" label="Press quote" value={s["epk.pressQuote"]} rows={2} />
        <TextSetting name="epk.pressAttribution" label="Press quote attribution" value={s["epk.pressAttribution"]} placeholder="Press · 2024" />
        <TextSetting
          name="soundTags"
          label="Sound tags"
          value={soundTags}
          help="Comma-separated (e.g. Afro-Cuban House, Latin Afrobeat, Electronic Ritual)."
        />
        <TextareaSetting
          name="identityFacts"
          label="Identity facts"
          value={identityFacts}
          rows={5}
          help="One per line, as: Label | Value   (e.g. Based | New York City, USA)"
        />

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: "18px" }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
