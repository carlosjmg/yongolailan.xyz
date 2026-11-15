import { getAllSettings } from "@/lib/settings";
import { saveSettingsForm } from "../settings-actions";
import { TextSetting, TextareaSetting, GroupHeading, SavedNote } from "@/components/admin/fields";
import ImageUpload from "@/components/admin/ImageUpload";

export const dynamic = "force-dynamic";

// Every editable text of the ARTeration Fest page (/arteration).
const KEYS = [
  "fest.name",
  "fest.year",
  "fest.tagline",
  "fest.taglineEs",
  "fest.venue",
  "fest.venue2",
  "fest.city",
  "fest.date",
  "fest.dateEs",
  "fest.time",
  "fest.startIso",
  "fest.endIso",
  "fest.presentedBy",
  "fest.curatedBy",
  "fest.producedBy",
  "fest.aboutTitle",
  "fest.aboutTitleEs",
  "fest.about1",
  "fest.about1Es",
  "fest.about2",
  "fest.about2Es",
  "fest.about3",
  "fest.about3Es",
  "fest.instagram",
  "fest.ticketUrl",
  "fest.ticketLabel",
  "fest.poster",
];

export default async function FestAdmin({ searchParams }: { searchParams: { saved?: string } }) {
  const s = await getAllSettings();
  const action = saveSettingsForm.bind(null, KEYS, "/admin/arteration");

  return (
    <div>
      <h1 className="admin-h1">ARTeration Fest</h1>
      <p className="admin-sub">
        The festival&rsquo;s own page at <b>/arteration</b> (English) and <b>/arteration/es</b> (Spanish). Artists, videos, photos and partners are managed in their own
        lists on the left. <a href="/arteration" target="_blank" rel="noopener noreferrer">View page ↗</a>
      </p>
      <SavedNote show={Boolean(searchParams?.saved)} />

      <form action={action} className="admin-panel" style={{ maxWidth: "640px" }}>
        <GroupHeading>Festival</GroupHeading>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.name" label="Name" value={s["fest.name"]} placeholder="ARTeration Fest" />
          </div>
          <div style={{ flex: "0 0 140px" }}>
            <TextSetting name="fest.year" label="Current year" value={s["fest.year"]} placeholder="2026" help="Artists with this year form the main lineup." />
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.tagline" label="Tagline (English)" value={s["fest.tagline"]} />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.taglineEs" label="Tagline (Spanish)" value={s["fest.taglineEs"]} />
          </div>
        </div>

        <GroupHeading>When &amp; where</GroupHeading>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.venue" label="Venue" value={s["fest.venue"]} placeholder="Nolan Park" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.venue2" label="Venue, second line" value={s["fest.venue2"]} placeholder="Governors Island" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.city" label="City" value={s["fest.city"]} placeholder="New York, NY" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.date" label="Date (English)" value={s["fest.date"]} placeholder="Saturday, August 15" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.dateEs" label="Date (Spanish)" value={s["fest.dateEs"]} placeholder="Sábado 15 de agosto" />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.time" label="Time (as shown)" value={s["fest.time"]} placeholder="3:00 PM - 9:00 PM" />
          </div>
        </div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.startIso" label="Starts (New York time)" value={s["fest.startIso"]} type="datetime-local" help="Drives the “days to go” line and Google's event info." />
          </div>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.endIso" label="Ends (New York time)" value={s["fest.endIso"]} type="datetime-local" />
          </div>
        </div>

        <GroupHeading>Credits</GroupHeading>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="fest.presentedBy" label="Presented by" value={s["fest.presentedBy"]} />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="fest.curatedBy" label="Curated by" value={s["fest.curatedBy"]} />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="fest.producedBy" label="Produced by" value={s["fest.producedBy"]} />
          </div>
        </div>

        <GroupHeading>About the festival</GroupHeading>
        <p className="admin-help" style={{ marginTop: "-8px", marginBottom: "14px" }}>
          Every text has an English and a Spanish version. If a Spanish one is empty, the English one is shown on /arteration/es.
        </p>
        <TextSetting name="fest.aboutTitle" label="Heading (English)" value={s["fest.aboutTitle"]} />
        <TextSetting name="fest.aboutTitleEs" label="Heading (Spanish)" value={s["fest.aboutTitleEs"]} />
        <TextareaSetting name="fest.about1" label="Paragraph 1 (English)" value={s["fest.about1"]} rows={5} help="The opening paragraph, shown larger." />
        <TextareaSetting name="fest.about1Es" label="Paragraph 1 (Spanish)" value={s["fest.about1Es"]} rows={5} />
        <TextareaSetting name="fest.about2" label="Paragraph 2 (English)" value={s["fest.about2"]} rows={4} />
        <TextareaSetting name="fest.about2Es" label="Paragraph 2 (Spanish)" value={s["fest.about2Es"]} rows={4} />
        <TextareaSetting name="fest.about3" label="Paragraph 3 (English)" value={s["fest.about3"]} rows={4} />
        <TextareaSetting name="fest.about3Es" label="Paragraph 3 (Spanish)" value={s["fest.about3Es"]} rows={4} />

        <GroupHeading>Links &amp; poster</GroupHeading>
        <TextSetting name="fest.instagram" label="Instagram link" value={s["fest.instagram"]} placeholder="https://www.instagram.com/arte.ration/" />
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 260px" }}>
            <TextSetting name="fest.ticketUrl" label="Info / tickets link" value={s["fest.ticketUrl"]} placeholder="https://…" help="Adds a button to the top of the page. Leave empty for none." />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="fest.ticketLabel" label="Button text" value={s["fest.ticketLabel"]} placeholder="Info & tickets" />
          </div>
        </div>
        <div className="admin-field">
          <label className="admin-label">Official poster</label>
          <ImageUpload name="fest.poster" defaultValue={s["fest.poster"]} />
          <div className="admin-help">Shown at the top of the page and used when the page is shared. Replace it each year.</div>
        </div>

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: "18px" }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
