import { getAllSettings, HERO_ROLE_COLOR_FALLBACK } from "@/lib/settings";
import { HEADER_FONTS } from "@/lib/fonts";
import { saveSettingsForm } from "../settings-actions";
import { TextSetting, TextareaSetting, SelectSetting, GroupHeading, SavedNote } from "@/components/admin/fields";
import ImageUpload from "@/components/admin/ImageUpload";
import FileUpload from "@/components/admin/FileUpload";
import ColorSetting, { type ColorPreset } from "@/components/admin/ColorSetting";

export const dynamic = "force-dynamic";

// Ordered best-first. The contrast figures were measured against the dark
// top-left area of the hero artwork, where the role line actually sits.
const ROLE_COLORS: ColorPreset[] = [
  { hex: "#f5efe4", name: "Warm white", note: "Cleanest and most readable — contrast 14:1" },
  { hex: HERO_ROLE_COLOR_FALLBACK, name: "Site gold", note: "Matches every section heading — contrast 6:1" },
  { hex: "#efdc9c", name: "Champagne", note: "Same gold as the award laurels — contrast 12:1" },
  { hex: "#fc5c64", name: "Sunglasses red", note: "Taken from your own artwork — contrast 5:1" },
  { hex: "#00bec7", name: "Ocean cyan", note: "The site's cool accent — contrast 7:1" },
  { hex: "#ffffff", name: "Pure white", note: "Maximum contrast — 16:1" },
  { hex: "#000000", name: "Black", note: "Only readable over a light hero image — 1.3:1 on the current one" },
];

const KEYS = [
  "hero.name",
  "hero.eyebrow",
  "hero.roleLine",
  "hero.roleColor",
  "hero.copyX",
  "hero.copyY",
  "hero.oneLiner",
  "hero.image",
  "headers.font",
  "headers.titleScale",
  "headers.eyebrowScale",
  "headers.subtitleScale",
  "site.logo",
  "site.logoSize",
  "site.logoSizeMobile",
  "site.logoOffsetX",
  "site.logoOffsetY",
  "site.logoOffsetXMobile",
  "site.logoOffsetYMobile",
  "site.ogImage",
  "catalog.pinned",
  "epk.pdfUrl",
  "contact.email",
  "contact.whatsapp",
  "contact.whatsappUrl",
  "label.name",
  "label.location",
  "label.tagline",
  "label.intro",
  "label.logo",
  "label.logoSize",
  "label.wordmarkSize",
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
        <ColorSetting
          name="hero.roleColor"
          label="Role line colour (and the Booking button)"
          value={s["hero.roleColor"]}
          presets={ROLE_COLORS}
          fallback={HERO_ROLE_COLOR_FALLBACK}
          help="Pick a suggested colour, or use the picker / hex box for any colour you like. Hover a suggestion to see why it works. Leave the box empty to go back to the site gold."
        />
        <TextSetting name="hero.oneLiner" label="One-liner (italic)" value={s["hero.oneLiner"]} />
        <div className="admin-label" style={{ marginTop: "6px", opacity: 0.85 }}>One-liner &amp; Booking position — desktop</div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="hero.copyX" label="Left / right (px)" value={s["hero.copyX"]} type="number" help="Positive = right, negative = left. 0 = default." />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="hero.copyY" label="Up / down (px)" value={s["hero.copyY"]} type="number" help="Positive = down, negative = up. 0 = default." />
          </div>
        </div>
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
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="site.logoSize" label="Logo size — desktop (px)" value={s["site.logoSize"]} type="number" help="Logo height on computers. Try 40–72." />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="site.logoSizeMobile" label="Logo size — mobile (px)" value={s["site.logoSizeMobile"]} type="number" help="Logo height on phones. Leave empty to match the desktop size." />
          </div>
        </div>
        <div className="admin-label" style={{ marginTop: "6px", opacity: 0.85 }}>Logo position — desktop</div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="site.logoOffsetX" label="Left / right — desktop (px)" value={s["site.logoOffsetX"]} type="number" help="Positive = right, negative = left. 0 = default." />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="site.logoOffsetY" label="Up / down — desktop (px)" value={s["site.logoOffsetY"]} type="number" help="Positive = down, negative = up. Try -10 to 30." />
          </div>
        </div>
        <div className="admin-label" style={{ marginTop: "6px", opacity: 0.85 }}>Logo position — mobile</div>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="site.logoOffsetXMobile" label="Left / right — mobile (px)" value={s["site.logoOffsetXMobile"]} type="number" help="Leave empty to match desktop. 0 = no horizontal offset." />
          </div>
          <div style={{ flex: "1 1 180px" }}>
            <TextSetting name="site.logoOffsetYMobile" label="Up / down — mobile (px)" value={s["site.logoOffsetYMobile"]} type="number" help="Leave empty to match desktop. 0 = no vertical offset." />
          </div>
        </div>

        <div className="admin-field">
          <label className="admin-label">Social preview image</label>
          <ImageUpload name="site.ogImage" defaultValue={s["site.ogImage"]} />
          <div className="admin-help">
            The artwork behind the preview card people see when your link is shared on WhatsApp, Instagram or X.
            Leave empty to reuse the hero image. Wide artwork works best.
          </div>
        </div>

        <GroupHeading>Section headers (all sections)</GroupHeading>
        <p className="admin-help" style={{ marginTop: "-8px", marginBottom: "14px" }}>
          Controls the small label, big title and subtitle on every section (Catalog, Live, Films, Merch…). One change updates them all.
        </p>
        <SelectSetting
          name="headers.font"
          label="Title font"
          value={s["headers.font"]}
          options={HEADER_FONTS.map((f) => ({ value: f.key, label: f.label }))}
          help="The font of the big section titles."
        />
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 150px" }}>
            <TextSetting name="headers.titleScale" label="Title size (%)" value={s["headers.titleScale"]} type="number" help="100 = normal. 120 = 20% bigger." />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <TextSetting name="headers.eyebrowScale" label="Label size (%)" value={s["headers.eyebrowScale"]} type="number" help="The small line above the title." />
          </div>
          <div style={{ flex: "1 1 150px" }}>
            <TextSetting name="headers.subtitleScale" label="Subtitle size (%)" value={s["headers.subtitleScale"]} type="number" />
          </div>
        </div>

        <GroupHeading>Catalog</GroupHeading>
        <TextSetting
          name="catalog.pinned"
          label="Show these releases first"
          value={s["catalog.pinned"]}
          help="Comma-separated release titles, shown first in the Music Catalog in this order. The rest follow in their normal order."
        />

        <GroupHeading>EPK (Press Kit)</GroupHeading>
        <div className="admin-field">
          <label className="admin-label">EPK PDF</label>
          <FileUpload name="epk.pdfUrl" defaultValue={s["epk.pdfUrl"]} accept="application/pdf" label="Upload EPK PDF" />
          <div className="admin-help">Upload your EPK as a PDF. When set, the &ldquo;EPK&rdquo; menu link opens it directly and the on-site EPK section is hidden.</div>
        </div>

        <GroupHeading>Contact</GroupHeading>
        <TextSetting name="contact.email" label="Email" value={s["contact.email"]} type="email" />
        <TextSetting name="contact.whatsapp" label="WhatsApp / phone (display)" value={s["contact.whatsapp"]} placeholder="+1 (646) 547-7443" />
        <TextSetting name="contact.whatsappUrl" label="WhatsApp link" value={s["contact.whatsappUrl"]} placeholder="https://wa.me/16465477443" />

        <GroupHeading>Caribbean Sea Sound (label page)</GroupHeading>
        <TextSetting name="label.name" label="Label name" value={s["label.name"]} />
        <TextSetting name="label.location" label="Label location" value={s["label.location"]} />
        <TextSetting name="label.tagline" label="Tagline (small line under the header)" value={s["label.tagline"]} />
        <TextareaSetting
          name="label.intro"
          label="Intro paragraph"
          value={s["label.intro"]}
          rows={5}
          help="The opening text on the Caribbean Sea Sound page. Artists and songs are managed under Caribbean Sea Sound in the sidebar."
        />
        <div className="admin-field">
          <label className="admin-label">Caribbean Sea Sound logo</label>
          <ImageUpload name="label.logo" defaultValue={s["label.logo"]} />
          <div className="admin-help">Shown top-left on the Caribbean Sea Sound page. A dark logo on transparent works best (the page is white). Leave empty to show the label name as text.</div>
        </div>
        <TextSetting name="label.logoSize" label="Caribbean Sea Sound logo size (px)" value={s["label.logoSize"]} type="number" help="Height of the label logo, top-left. Try 28–56." />
        <TextSetting name="label.wordmarkSize" label="Caribbean Sea Sound text size (px)" value={s["label.wordmarkSize"]} type="number" help="Size of the 'Caribbean Sea Sound' text top-right. Leave empty to match the logo size." />

        <GroupHeading>Domain</GroupHeading>
        <TextSetting name="site.domain" label="Domain (shown in footer)" value={s["site.domain"]} />

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: "18px" }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
