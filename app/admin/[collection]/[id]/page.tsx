import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection, type Field } from "@/lib/admin/collections";
import { getRecord, getFieldOptions } from "@/lib/admin/data";
import { saveRecord } from "../../crud-actions";
import ImageUpload from "@/components/admin/ImageUpload";
import ColorField from "@/components/admin/ColorField";

export const dynamic = "force-dynamic";

const NEW_DEFAULTS: Record<string, unknown> = {
  published: true,
  accentColor: "oklch(72% 0.16 60)",
  color: "oklch(72% 0.16 60)",
  category: "press",
  area: "music",
};

type Choice = { value: string; label: string };

function FieldRenderer({
  field,
  value,
  choices,
}: {
  field: Field;
  value: unknown;
  choices?: Choice[];
}) {
  const id = `f_${field.name}`;

  if (field.type === "boolean") {
    return (
      <div className="admin-field">
        <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
          <input type="checkbox" name={field.name} defaultChecked={Boolean(value)} style={{ width: "18px", height: "18px", minHeight: "auto" }} />
          <span className="admin-label" style={{ marginBottom: 0 }}>{field.label}</span>
        </label>
        {field.help && <div className="admin-help">{field.help}</div>}
      </div>
    );
  }

  let control: React.ReactNode;
  if (field.type === "image") {
    control = <ImageUpload name={field.name} defaultValue={value as string} />;
  } else if (field.type === "color") {
    control = <ColorField name={field.name} defaultValue={value as string} />;
  } else if (field.type === "textarea") {
    control = <textarea id={id} name={field.name} defaultValue={(value as string) ?? ""} className="admin-textarea" placeholder={field.placeholder} required={field.required} />;
  } else if (field.type === "select" && field.optionsFrom) {
    control =
      choices && choices.length > 0 ? (
        <select id={id} name={field.name} defaultValue={(value as string) ?? choices[0].value} className="admin-select" required={field.required}>
          {choices.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      ) : (
        <div className="admin-help" style={{ color: "#fc5c64" }}>
          No artists yet — add one under <strong>Label &mdash; Artists</strong> first, then come back.
        </div>
      );
  } else if (field.type === "select") {
    control = (
      <select id={id} name={field.name} defaultValue={(value as string) ?? field.options?.[0]} className="admin-select">
        {field.options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  } else {
    control = (
      <input
        id={id}
        name={field.name}
        type={field.type === "url" ? "url" : "text"}
        defaultValue={(value as string) ?? ""}
        className="admin-input"
        placeholder={field.placeholder}
        required={field.required}
      />
    );
  }

  return (
    <div className="admin-field">
      <label className="admin-label" htmlFor={id}>
        {field.label}
        {field.required && " *"}
      </label>
      {control}
      {field.help && <div className="admin-help">{field.help}</div>}
    </div>
  );
}

export default async function EditRecordPage({ params }: { params: { collection: string; id: string } }) {
  const col = getCollection(params.collection);
  if (!col) notFound();

  const isNew = params.id === "new";
  const record = isNew ? null : await getRecord(params.collection, params.id);
  if (!isNew && !record) notFound();

  const values = record ?? NEW_DEFAULTS;
  const action = saveRecord.bind(null, params.collection, isNew ? null : params.id);

  // Load the choices for any select that draws on another table.
  const choicesByField: Record<string, Choice[]> = {};
  for (const f of col.fields) {
    if (f.optionsFrom) {
      choicesByField[f.name] = await getFieldOptions(f.optionsFrom.model, f.optionsFrom.labelField);
    }
  }

  return (
    <div>
      <Link href={`/admin/${col.key}`} style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-dim)", textDecoration: "none", display: "inline-block", marginBottom: "14px" }}>
        ← Back to {col.label}
      </Link>
      <h1 className="admin-h1">{isNew ? `New ${col.singular}` : `Edit ${col.singular}`}</h1>

      <form action={action} className="admin-panel" style={{ maxWidth: "620px", marginTop: "10px" }}>
        {col.fields.map((f) => (
          <FieldRenderer
            key={f.name}
            field={f}
            value={(values as Record<string, unknown>)[f.name]}
            choices={choicesByField[f.name]}
          />
        ))}
        <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
          <button type="submit" className="admin-btn admin-btn-primary">Save</button>
          <Link href={`/admin/${col.key}`} className="admin-btn">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
