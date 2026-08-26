import React from "react";

export function TextSetting({
  name,
  label,
  value,
  placeholder,
  help,
  type = "text",
}: {
  name: string;
  label: string;
  value?: string | null;
  placeholder?: string;
  help?: string;
  type?: string;
}) {
  return (
    <div className="admin-field">
      <label className="admin-label" htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} type={type} defaultValue={value ?? ""} placeholder={placeholder} className="admin-input" />
      {help && <div className="admin-help">{help}</div>}
    </div>
  );
}

export function TextareaSetting({
  name,
  label,
  value,
  placeholder,
  help,
  rows = 3,
}: {
  name: string;
  label: string;
  value?: string | null;
  placeholder?: string;
  help?: string;
  rows?: number;
}) {
  return (
    <div className="admin-field">
      <label className="admin-label" htmlFor={name}>
        {label}
      </label>
      <textarea id={name} name={name} defaultValue={value ?? ""} placeholder={placeholder} rows={rows} className="admin-textarea" />
      {help && <div className="admin-help">{help}</div>}
    </div>
  );
}

export function SelectSetting({
  name,
  label,
  value,
  options,
  help,
}: {
  name: string;
  label: string;
  value?: string | null;
  options: { value: string; label: string }[];
  help?: string;
}) {
  return (
    <div className="admin-field">
      <label className="admin-label" htmlFor={name}>
        {label}
      </label>
      <select id={name} name={name} defaultValue={value ?? options[0]?.value} className="admin-select">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {help && <div className="admin-help">{help}</div>}
    </div>
  );
}

export function GroupHeading({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "10px",
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--gold)",
        margin: "10px 0 16px",
        paddingBottom: "8px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </div>
  );
}

export function SavedNote({ show }: { show: boolean }) {
  if (!show) return null;
  return <div className="admin-note">Saved. Your live site has been updated.</div>;
}
