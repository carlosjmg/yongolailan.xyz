import { getAllSettings, SECTION_KEYS, SECTION_LABELS, sectionState } from "@/lib/settings";
import { saveSettingsForm } from "../settings-actions";
import { SavedNote } from "@/components/admin/fields";

export const dynamic = "force-dynamic";

export default async function AvailabilityPage({ searchParams }: { searchParams: { saved?: string } }) {
  const settings = await getAllSettings();
  const keys = SECTION_KEYS.map((k) => `section.${k}`);
  const action = saveSettingsForm.bind(null, keys, "/admin/availability");

  return (
    <div>
      <h1 className="admin-h1">Availability</h1>
      <p className="admin-sub">
        Show, hide, or mark any section &ldquo;coming soon&rdquo;. Hidden sections disappear from the site and its menus.
      </p>
      <SavedNote show={Boolean(searchParams?.saved)} />

      <form action={action} className="admin-panel" style={{ maxWidth: "560px" }}>
        {SECTION_KEYS.map((k) => (
          <div
            key={k}
            className="admin-field"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "14px" }}
          >
            <label className="admin-label" htmlFor={`section.${k}`} style={{ marginBottom: 0 }}>
              {SECTION_LABELS[k]}
            </label>
            <select
              id={`section.${k}`}
              name={`section.${k}`}
              defaultValue={sectionState(settings, k)}
              className="admin-select"
              style={{ maxWidth: "190px" }}
            >
              <option value="on">Visible</option>
              <option value="soon">Coming soon</option>
              <option value="off">Hidden</option>
            </select>
          </div>
        ))}
        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: "14px" }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
