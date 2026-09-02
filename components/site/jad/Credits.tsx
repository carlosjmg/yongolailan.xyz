"use client";

import { type CSSProperties, useState } from "react";

/**
 * The release credits. When `collapse` is on and there are more than `lines`
 * lines, only the first few show, with a "Full credits +" toggle that reveals
 * the rest — keeping the first viewport light (especially on phones). The size
 * CSS variables are inherited from the wrapper.
 */
export default function Credits({
  text,
  collapse,
  lines,
  style,
}: {
  text: string;
  collapse: boolean;
  lines: number;
  style?: CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const parts = text.split(/\r?\n/);
  const canCollapse = collapse && parts.length > lines;
  const shown = canCollapse && !open ? parts.slice(0, lines).join("\n") : text;

  return (
    <div className="jad-credits" style={style}>
      <p className="jad-info">{shown}</p>
      {canCollapse && (
        <button type="button" className="jad-credits-toggle" onClick={() => setOpen((o) => !o)}>
          {open ? "Less −" : "Full credits +"}
        </button>
      )}
    </div>
  );
}
