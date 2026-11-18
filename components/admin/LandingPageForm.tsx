import type { ReactNode } from "react";
import { getAllSettings } from "@/lib/settings";
import { saveSettingsForm } from "@/app/admin/settings-actions";
import { TextSetting, TextareaSetting, SelectSetting, GroupHeading, SavedNote } from "@/components/admin/fields";

// Show/Hide options for the on/off module toggles.
const SHOW = [
  { value: "on", label: "Show" },
  { value: "off", label: "Hide" },
];

// The editable keys of a release landing page, without their "<prefix>." part.
const FIELDS = [
  "eyebrow",
  "tagline.enabled",
  "tagline",
  "info",
  "infoSize",
  "infoSizeMobile",
  "credits.collapse",
  "credits.lines",
  "releaseDate",
  "cta.enabled",
  "presaveUrl",
  "listenUrl",
  "countdown.enabled",
  "preview.enabled",
  "preview.start",
  "preview.duration",
  "visualizer.enabled",
  "visualizer.label",
  "email.enabled",
  "email.heading",
  "share.enabled",
  "bandcamp",
  "spotify",
  "apple",
  "soundcloud",
  "amazon",
  "youtubemusic",
  "tidal",
  "deezer",
];

/** Admin form shared by every release landing page ("jad", "hav"). */
export default async function LandingPageForm({
  prefix,
  heading,
  route,
  intro,
  eyebrowPlaceholder,
  audioPreview,
  searchParams,
}: {
  prefix: string;
  heading: string;
  route: string;
  intro: ReactNode;
  eyebrowPlaceholder: string;
  /** Show the audio-preview group (only pages with a hosted track). */
  audioPreview: boolean;
  searchParams: { saved?: string };
}) {
  const s = await getAllSettings();
  const key = (f: string) => `${prefix}.${f}`;
  const keys = FIELDS.filter((f) => audioPreview || !f.startsWith("preview.")).map(key);
  const action = saveSettingsForm.bind(null, keys, `/admin/landing-pages${route}`);
  const v = (f: string) => s[key(f)];

  return (
    <div>
      <h1 className="admin-h1">{heading}</h1>
      <p className="admin-sub">
        {intro} <a href={route} target="_blank" rel="noopener noreferrer">View page ↗</a>
      </p>
      <SavedNote show={Boolean(searchParams?.saved)} />

      <form action={action} className="admin-panel" style={{ maxWidth: "640px" }}>
        <GroupHeading>Header &amp; tagline</GroupHeading>
        <TextSetting name={key("eyebrow")} label="Eyebrow (small line above the cover)" value={v("eyebrow")} placeholder={eyebrowPlaceholder} />
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 130px" }}>
            <SelectSetting name={key("tagline.enabled")} label="Tagline" value={v("tagline.enabled")} options={SHOW} />
          </div>
          <div style={{ flex: "1 1 300px" }}>
            <TextSetting name={key("tagline")} label="One-line phrase / lyric (under the cover)" value={v("tagline")} placeholder="A late-night tropical soul journey…" />
          </div>
        </div>

        <GroupHeading>Info &amp; credits</GroupHeading>
        <TextareaSetting name={key("info")} label="Info text (credits)" value={v("info")} rows={5} help="Shown under the cover. Press Enter to put each credit on its own line." />
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 150px" }}>
            <TextSetting name={key("infoSize")} label="Size - desktop (px)" value={v("infoSize")} type="number" help="Default 14." />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <TextSetting name={key("infoSizeMobile")} label="Size - mobile (px)" value={v("infoSizeMobile")} type="number" help="Default 14." />
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 150px" }}>
            <SelectSetting name={key("credits.collapse")} label="Collapse credits" value={v("credits.collapse")} options={SHOW} />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name={key("credits.lines")} label="Lines shown before “Full credits +”" value={v("credits.lines")} type="number" help="Default 3. Only applies when Collapse is on." />
          </div>
        </div>

        <GroupHeading>Release date &amp; CTA</GroupHeading>
        <p className="admin-help" style={{ marginTop: "-8px", marginBottom: "14px" }}>
          Set the date and the button switches itself from <b>Pre-Save</b> to <b>Listen Now</b> on release day.
        </p>
        <TextSetting name={key("releaseDate")} label="Release date &amp; time" value={v("releaseDate")} type="datetime-local" help="Drives the OUT: … line, the countdown and the CTA. Leave empty for none." />
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 150px" }}>
            <SelectSetting name={key("cta.enabled")} label="Big CTA button" value={v("cta.enabled")} options={SHOW} />
          </div>
          <div style={{ flex: "0 0 150px" }}>
            <SelectSetting name={key("countdown.enabled")} label="Countdown" value={v("countdown.enabled")} options={SHOW} />
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("presaveUrl")} label="Pre-Save link (before release)" value={v("presaveUrl")} placeholder="https://…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("listenUrl")} label="Listen-Now / smart link (on release)" value={v("listenUrl")} placeholder="https://…" />
          </div>
        </div>

        {audioPreview ? (
          <>
            <GroupHeading>Audio preview</GroupHeading>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ flex: "0 0 130px" }}>
                <SelectSetting name={key("preview.enabled")} label="Preview" value={v("preview.enabled")} options={SHOW} />
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <TextSetting name={key("preview.start")} label="Start at (seconds)" value={v("preview.start")} type="number" help="Pick the most recognisable moment." />
              </div>
              <div style={{ flex: "1 1 150px" }}>
                <TextSetting name={key("preview.duration")} label="Length (seconds)" value={v("preview.duration")} type="number" help="15–30 is ideal." />
              </div>
            </div>
          </>
        ) : null}

        <GroupHeading>Visualizer</GroupHeading>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 150px" }}>
            <SelectSetting name={key("visualizer.enabled")} label="Visualizer button" value={v("visualizer.enabled")} options={SHOW} />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("visualizer.label")} label="Button label" value={v("visualizer.label")} placeholder="Watch the Visualizer" />
          </div>
        </div>

        <GroupHeading>Streaming links</GroupHeading>
        <p className="admin-help" style={{ marginTop: "-8px", marginBottom: "14px" }}>
          Paste each link as you get it - a button with no link yet still shows, just greyed out. Bandcamp is first
          (name-your-price / donations).
        </p>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("bandcamp")} label="Bandcamp link (donations)" value={v("bandcamp")} placeholder="https://…bandcamp.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("spotify")} label="Spotify link" value={v("spotify")} placeholder="https://open.spotify.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("apple")} label="Apple Music link" value={v("apple")} placeholder="https://music.apple.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("soundcloud")} label="SoundCloud link" value={v("soundcloud")} placeholder="https://soundcloud.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("amazon")} label="Amazon Music link" value={v("amazon")} placeholder="https://music.amazon.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("youtubemusic")} label="YouTube Music link" value={v("youtubemusic")} placeholder="https://music.youtube.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("tidal")} label="Tidal link" value={v("tidal")} placeholder="https://tidal.com/…" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name={key("deezer")} label="Deezer link" value={v("deezer")} placeholder="https://deezer.com/…" />
          </div>
        </div>

        <GroupHeading>Fan capture &amp; share</GroupHeading>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
          <div style={{ flex: "0 0 150px" }}>
            <SelectSetting name={key("email.enabled")} label="Email capture" value={v("email.enabled")} options={SHOW} />
          </div>
          <div style={{ flex: "1 1 240px" }}>
            <TextSetting name={key("email.heading")} label="Email heading" value={v("email.heading")} placeholder="Stay connected" />
          </div>
        </div>
        <p className="admin-help" style={{ marginTop: "2px", marginBottom: "14px" }}>
          Sign-ups appear under <b>Audience → Subscribers</b>.
        </p>
        <div style={{ flex: "0 0 150px" }}>
          <SelectSetting name={key("share.enabled")} label="Share / copy link" value={v("share.enabled")} options={SHOW} />
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: "18px" }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
