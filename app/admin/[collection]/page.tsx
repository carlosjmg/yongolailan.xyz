import Link from "next/link";
import { notFound } from "next/navigation";
import { getCollection } from "@/lib/admin/collections";
import { getRecords } from "@/lib/admin/data";
import { deleteRecord, reorderRecord } from "../crud-actions";
import ConfirmSubmit from "@/components/admin/ConfirmSubmit";

export const dynamic = "force-dynamic";

function cell(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  const s = String(value);
  return s.length > 48 ? s.slice(0, 47) + "…" : s;
}

/** Column names may reach into an included relation, e.g. "artist.name". */
function valueAt(record: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, record);
}

export default async function CollectionListPage({ params }: { params: { collection: string } }) {
  const col = getCollection(params.collection);
  if (!col) notFound();

  const records = await getRecords(params.collection);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
        <h1 className="admin-h1">{col.label}</h1>
        <Link href={`/admin/${col.key}/new`} className="admin-btn admin-btn-primary">
          + Add {col.singular}
        </Link>
      </div>
      <p className="admin-sub">
        {records.length} {records.length === 1 ? col.singular : col.label.toLowerCase()}.{" "}
        {col.alphabetical ? "Listed A–Z automatically." : "Use ↑ ↓ to reorder how they appear on the site."}
      </p>

      {records.length === 0 ? (
        <div className="admin-panel">Nothing here yet — add your first {col.singular}.</div>
      ) : (
        <div className="admin-panel" style={{ padding: 0, overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                {col.imageField && <th></th>}
                {col.listColumns.map((c) => (
                  <th key={c.name}>{c.label}</th>
                ))}
                {col.hasPublished && <th>Status</th>}
                {!col.alphabetical && <th>Order</th>}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {records.map((r, i) => (
                <tr key={r.id}>
                  {col.imageField && (
                    <td style={{ width: "60px" }}>
                      {r[col.imageField] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="admin-thumb" src={r[col.imageField]} alt="" />
                      ) : (
                        <div className="admin-thumb" />
                      )}
                    </td>
                  )}
                  {col.listColumns.map((c) => (
                    <td key={c.name}>{cell(valueAt(r, c.name))}</td>
                  ))}
                  {col.hasPublished && (
                    <td>
                      {r.published ? <span className="admin-tag on">Live</span> : <span className="admin-tag off">Hidden</span>}
                      {r.featured && <span className="admin-tag soon" style={{ marginLeft: "5px" }}>Featured</span>}
                    </td>
                  )}
                  {!col.alphabetical && (
                    <td>
                      <div className="admin-row-actions">
                        <form action={reorderRecord.bind(null, col.key, r.id, "up")}>
                          <button className="admin-btn admin-btn-sm" disabled={i === 0} aria-label="Move up">↑</button>
                        </form>
                        <form action={reorderRecord.bind(null, col.key, r.id, "down")}>
                          <button className="admin-btn admin-btn-sm" disabled={i === records.length - 1} aria-label="Move down">↓</button>
                        </form>
                      </div>
                    </td>
                  )}
                  <td>
                    <div className="admin-row-actions">
                      <Link href={`/admin/${col.key}/${r.id}`} className="admin-btn admin-btn-sm">Edit</Link>
                      <form action={deleteRecord.bind(null, col.key, r.id)}>
                        <ConfirmSubmit className="admin-btn admin-btn-sm admin-btn-danger" message={`Delete this ${col.singular}? This cannot be undone.`}>
                          Delete
                        </ConfirmSubmit>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
