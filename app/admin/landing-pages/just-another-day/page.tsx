import { getAllSettings } from "@/lib/settings";
import { saveSettingsForm } from "../../settings-actions";
import { TextSetting, TextareaSetting, SelectSetting, GroupHeading, SavedNote } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

// Show/Hide options for the on/off module toggles.
const SHOW = [
  { value: "on", label: "Show" },
  { value: "off", label: "Hide" },
];

// Every editable key for the "Just Another Day" landing page. Kept in one
// place so the form saves exactly these (see saveSettingsForm).
const KEYS = [
  "jad.eyebrow",
  "jad.tagline.enabled",
  "jad.tagline",
  "jad.info",
  "jad.infoSize",
  "jad.infoSizeMobile",
  "jad.credits.collapse",
  "jad.credits.lines",
  "jad.releaseDate",
  "jad.cta.enabled",
  "jad.presaveUrl",
  "jad.listenUrl",
  "jad.countdown.enabled",
  "jad.preview.enabled",
  "jad.preview.start",
  "jad.preview.duration",
  "jad.visualizer.enabled",
  "jad.visualizer.label",
  "jad.bandcampNote",
  "jad.email.enabled",
  "jad.email.heading",
  "jad.share.enabled",
  "jad.bandcamp",
  "jad.spotify",
  "jad.apple",
  "jad.soundcloud",
  "jad.youtube",
  "jad.youtubemusic",
  "jad.tidal",
  "jad.deezer",
];

export default async function JustAnotherDayAdmin({ searchParams }: { searchParams: { saved?: string } }) {
  const s = await getAllSettings();
  const action = saveSettingsForm.bind(null, KEYS, "/admin/landing-pages/just-another-day");

  return (
    <div>
      <h1 className="admin-h1">Just Another Day</h1>
      <p className="admin-sub">
        The single&rsquo;s landing page at <b>/just-another-day</b>, reached by clicking the song in Arema Arega&rsquo;s
        page. <a href="/just-another-day" target="_blank" rel="noopener noreferrer">View page ↗</a>
      </p>
      <SavedNote show={Boolean(searchParams?.saved)} />

      <form action={action} className="admin-panel" style={{ maxWidth: "640px" }}>
        <GroupHeading>Header &amp; tagline</GroupHeading>
        <TextSetting name="jad.eyebrow" label="Eyebrow (small line above the cover)" value={s["jad.eyebrow"]} placeholder="New Single" />
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 130px" }}>
            <SelectSetting name="jad.tagline.enabled" label="Tagline" value={s["jad.tagline.enabled"]} options={SHOW} />
          </div>
          <div style={{ flex: "1 1 300px" }}>
            <TextSetting name="jad.tagline" label="One-line phrase / lyric (under the artists)" value={s["jad.tagline"]} placeholder="A late-night tropical soul journey…" />
          </div>
        </div>

        <GroupHeading>Info &amp; credits</GroupHeading>
        <TextareaSetting name="jad.info" label="Info text (credits)" value={s["jad.info"]} rows={5} help="Shown under the cover. Press Enter to put each credit on its own line." />
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 150px" }}>
            <TextSetting name="jad.infoSize" label="Size — desktop (px)" value={s["jad.infoSize"]} type="number" help="Default 14." />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <TextSetting name="jad.infoSizeMobile" label="Size — mobile (px)" value={s["jad.infoSizeMobile"]} type="number" help="Default 14." />
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 150px" }}>
            <SelectSetting name="jad.credits.collapse" label="Collapse credits" value={s["jad.credits.collapse"]} options={SHOW} />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="jad.credits.lines" label="Lines shown before “Full credits +”" value={s["jad.credits.lines"]} type="number" help="Default 3. Only applies when Collapse is on." />
          </div>
        </div>

        <GroupHeading>Release date &amp; CTA</GroupHeading>
        <p className="admin-help" style={{ marginTop: "-8px", marginBottom: "14px" }}>
          Set the date and the button switches itself from <b>Pre-Save</b> to <b>Listen Now</b> on release day.
        </p>
        <TextSetting name="jad.releaseDate" label="Release date &amp; time" value={s["jad.releaseDate"]} type="datetime-local" help="Drives the OUT — … line, the countdown and the CTA. Leave empty for none." />
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 150px" }}>
            <SelectSetting name="jad.cta.enabled" label="Big CTA button" value={s["jad.cta.enabled"]} options={SHOW} />
          </div>
          <div style={{ flex: "0 0 150px" }}>
            <SelectSetting name="jad.countdown.enabled" label="Countdown" value={s["jad.countdown.enabled"]} options={SHOW} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.presaveUrl" label="Pre-Save link (before release)" value={s["jad.presaveUrl"]} placeholder="https://…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.listenUrl" label="Listen-Now / smart link (on release)" value={s["jad.listenUrl"]} placeholder="https://…" />
          </div>
        </div>

        <GroupHeading>Audio preview</GroupHeading>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 130px" }}>
            <SelectSetting name="jad.preview.enabled" label="Preview" value={s["jad.preview.enabled"]} options={SHOW} />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <TextSetting name="jad.preview.start" label="Start at (seconds)" value={s["jad.preview.start"]} type="number" help="Pick the most recognisable moment." />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <TextSetting name="jad.preview.duration" label="Length (seconds)" value={s["jad.preview.duration"]} type="number" help="15–30 is ideal." />
          </div>
        </div>

        <GroupHeading>Visualizer</GroupHeading>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 150px" }}>
            <SelectSetting name="jad.visualizer.enabled" label="Visualizer button" value={s["jad.visualizer.enabled"]} options={SHOW} />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.visualizer.label" label="Button label" value={s["jad.visualizer.label"]} placeholder="Watch the Visualizer" />
          </div>
        </div>

        <GroupHeading>Streaming links</GroupHeading>
        <p className="admin-help" style={{ marginTop: "-8px", marginBottom: "14px" }}>
          Paste each link as you get it — a button with no link yet still shows, just greyed out. Bandcamp is first
          (name-your-price / donations).
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.bandcamp" label="Bandcamp link (donations)" value={s["jad.bandcamp"]} placeholder="https://…bandcamp.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.spotify" label="Spotify link" value={s["jad.spotify"]} placeholder="https://open.spotify.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.apple" label="Apple Music link" value={s["jad.apple"]} placeholder="https://music.apple.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.soundcloud" label="SoundCloud link" value={s["jad.soundcloud"]} placeholder="https://soundcloud.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.youtube" label="YouTube link" value={s["jad.youtube"]} placeholder="https://youtube.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.youtubemusic" label="YouTube Music link" value={s["jad.youtubemusic"]} placeholder="https://music.youtube.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.tidal" label="Tidal link" value={s["jad.tidal"]} placeholder="https://tidal.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="jad.deezer" label="Deezer link" value={s["jad.deezer"]} placeholder="https://deezer.com/…" />
          </div>
        </div>

        <GroupHeading>Support (Bandcamp)</GroupHeading>
        <TextSetting name="jad.bandcampNote" label="Lead-in line (BANDCAMP stays the link)" value={s["jad.bandcampNote"]} placeholder="Support this Song directly on:" />

        <GroupHeading>Fan capture &amp; share</GroupHeading>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 150px" }}>
            <SelectSetting name="jad.email.enabled" label="Email capture" value={s["jad.email.enabled"]} options={SHOW} />
          </div>
          <div style={{ flex: "1 1 240px" }}>
            <TextSetting name="jad.email.heading" label="Email heading" value={s["jad.email.heading"]} placeholder="Stay connected" />
          </div>
        </div>
        <p className="admin-help" style={{ marginTop: "2px", marginBottom: "14px" }}>
          Sign-ups appear under <b>Audience → Subscribers</b>.
        </p>
        <div style={{ flex: "0 0 150px" }}>
          <SelectSetting name="jad.share.enabled" label="Share / copy link" value={s["jad.share.enabled"]} options={SHOW} />
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: "18px" }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
