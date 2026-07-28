import { getAllSettings } from "@/lib/settings";
import { saveSettingsForm } from "../settings-actions";
import { TextSetting, TextareaSetting, GroupHeading, SavedNote } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

// Every section heading on the site, in the order it appears.
const SECTIONS: { key: string; label: string; hasSubtitle: boolean }[] = [
  { key: "catalog", label: "Catalog / Music", hasSubtitle: true },
  { key: "portfolio", label: "Portfolio", hasSubtitle: true },
  { key: "photos", label: "Photos", hasSubtitle: true },
  { key: "merch", label: "Merch", hasSubtitle: true },
  { key: "about", label: "About", hasSubtitle: false },
  { key: "contact", label: "Contact", hasSubtitle: true },
  { key: "newsletter", label: "Newsletter block", hasSubtitle: true },
  { key: "links", label: "Links", hasSubtitle: false },
];

const KEYS = [
  ...SECTIONS.flatMap((s) => [
    `text.${s.key}.eyebrow`,
    `text.${s.key}.title`,
    ...(s.hasSubtitle ? [`text.${s.key}.subtitle`] : []),
  ]),
  "contact.inquiryTypes",
];

export default async function SectionsPage({ searchParams }: { searchParams: { saved?: string } }) {
  const s = await getAllSettings();
  const action = saveSettingsForm.bind(null, KEYS, "/admin/sections");

  return (
    <div>
      <h1 className="admin-h1">Section Titles</h1>
      <p className="admin-sub">
        The headings for every section of your site. The small line is the &ldquo;eyebrow&rdquo; above the big title.
      </p>
      <SavedNote show={Boolean(searchParams?.saved)} />

      <form action={action} className="admin-panel" style={{ maxWidth: "700px" }}>
        {SECTIONS.map((sec) => (
          <div key={sec.key}>
            <GroupHeading>{sec.label}</GroupHeading>
            <TextSetting
              name={`text.${sec.key}.eyebrow`}
              label="Small line above (eyebrow)"
              value={s[`text.${sec.key}.eyebrow`]}
            />
            <TextSetting name={`text.${sec.key}.title`} label="Title" value={s[`text.${sec.key}.title`]} />
            {sec.hasSubtitle && (
              <TextareaSetting
                name={`text.${sec.key}.subtitle`}
                label="Subtitle"
                value={s[`text.${sec.key}.subtitle`]}
                rows={2}
              />
            )}
            {sec.key === "contact" && (
              <TextSetting
                name="contact.inquiryTypes"
                label="Inquiry types"
                value={s["contact.inquiryTypes"]}
                help="Comma-separated. These are the options in the contact form's dropdown."
              />
            )}
          </div>
        ))}

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: "18px" }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
