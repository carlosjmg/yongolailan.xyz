import { getAllSettings } from "@/lib/settings";
import { saveSettingsForm } from "../../settings-actions";
import { TextSetting, TextareaSetting, GroupHeading, SavedNote } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

// Every editable key for the "Just Another Day" landing page. Kept in one
// place so the form saves exactly these (see saveSettingsForm).
const KEYS = [
  "jad.info",
  "jad.infoSize",
  "jad.infoSizeMobile",
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
        <GroupHeading>Info</GroupHeading>
        <TextareaSetting name="jad.info" label="Info text (credits)" value={s["jad.info"]} rows={5} help="Shown under the cover. Press Enter to put each credit on its own line." />
        <div className="admin-label" style={{ marginTop: "6px", opacity: 0.85 }}>Credits text size</div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="jad.infoSize" label="Size — desktop (px)" value={s["jad.infoSize"]} type="number" help="Default 14." />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="jad.infoSizeMobile" label="Size — mobile (px)" value={s["jad.infoSizeMobile"]} type="number" help="Default 14." />
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

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: "18px" }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
