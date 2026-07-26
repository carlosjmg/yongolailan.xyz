import { getAllSettings } from "@/lib/settings";
import { saveSettingsForm } from "../settings-actions";
import { TextSetting, GroupHeading, SavedNote } from "@/components/admin/fields";
import ImageUpload from "@/components/admin/ImageUpload";

export const dynamic = "force-dynamic";

const KEYS = [
  "hero.name",
  "hero.eyebrow",
  "hero.roleLine",
  "hero.oneLiner",
  "hero.image",
  "site.logo",
  "contact.email",
  "contact.whatsapp",
  "contact.whatsappUrl",
  "label.name",
  "label.location",
  "site.domain",
];

export default async function SettingsPage({ searchParams }: { searchParams: { saved?: string } }) {
  const s = await getAllSettings();
  const action = saveSettingsForm.bind(null, KEYS, "/admin/settings");

  return (
    <div>
      <h1 className="admin-h1">Home &amp; Hero</h1>
      <p className="admin-sub">Your name, headline, hero image, and contact details.</p>
      <SavedNote show={Boolean(searchParams?.saved)} />

      <form action={action} className="admin-panel" style={{ maxWidth: "640px" }}>
        <GroupHeading>Hero</GroupHeading>
        <TextSetting name="hero.name" label="Artist name" value={s["hero.name"]} />
        <TextSetting name="hero.eyebrow" label="Eyebrow (small line above the name)" value={s["hero.eyebrow"]} />
        <TextSetting name="hero.roleLine" label="Role line" value={s["hero.roleLine"]} help="e.g. DJ · Producer · Live Electronic Performer" />
        <TextSetting name="hero.oneLiner" label="One-liner (italic)" value={s["hero.oneLiner"]} />
        <div className="admin-field">
          <label className="admin-label">Hero / background image</label>
          <ImageUpload name="hero.image" defaultValue={s["hero.image"]} />
          <div className="admin-help">This is the big background image at the top of the home page (your &ldquo;special art&rdquo;).</div>
        </div>
        <div className="admin-field">
          <label className="admin-label">Logo (top-left corner)</label>
          <ImageUpload name="site.logo" defaultValue={s["site.logo"]} />
          <div className="admin-help">Shown in the top-left of the site and footer. A white logo on a transparent background works best.</div>
        </div>

        <GroupHeading>Contact</GroupHeading>
        <TextSetting name="contact.email" label="Email" value={s["contact.email"]} type="email" />
        <TextSetting name="contact.whatsapp" label="WhatsApp / phone (display)" value={s["contact.whatsapp"]} placeholder="+1 (646) 547-7443" />
        <TextSetting name="contact.whatsappUrl" label="WhatsApp link" value={s["contact.whatsappUrl"]} placeholder="https://wa.me/16465477443" />

        <GroupHeading>Label &amp; domain</GroupHeading>
        <TextSetting name="label.name" label="Label name" value={s["label.name"]} />
        <TextSetting name="label.location" label="Label location" value={s["label.location"]} />
        <TextSetting name="site.domain" label="Domain (shown in footer)" value={s["site.domain"]} />

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: "18px" }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
