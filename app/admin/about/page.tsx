import { getAllSettings } from "@/lib/settings";
import { saveAboutForm } from "../settings-actions";
import { TextareaSetting, GroupHeading, SavedNote } from "@/components/admin/fields";
import ImageUpload from "@/components/admin/ImageUpload";

export const dynamic = "force-dynamic";

export default async function AboutPage({ searchParams }: { searchParams: { saved?: string } }) {
  const s = await getAllSettings();

  return (
    <div>
      <h1 className="admin-h1">About &amp; Bio</h1>
      <p className="admin-sub">Your photo and biography.</p>
      <SavedNote show={Boolean(searchParams?.saved)} />

      <form action={saveAboutForm} className="admin-panel" style={{ maxWidth: "700px" }}>
        <GroupHeading>About section</GroupHeading>
        <div className="admin-field">
          <label className="admin-label">About photo</label>
          <ImageUpload name="about.image" defaultValue={s["about.image"]} />
          <div className="admin-help">The portrait shown beside your biography.</div>
        </div>
        <TextareaSetting name="about.p1" label="Biography — paragraph 1" value={s["about.p1"]} rows={4} />
        <TextareaSetting name="about.p2" label="Biography — paragraph 2" value={s["about.p2"]} rows={4} />

        <button type="submit" className="admin-btn admin-btn-primary" style={{ marginTop: "18px" }}>
          Save changes
        </button>
      </form>
    </div>
  );
}
